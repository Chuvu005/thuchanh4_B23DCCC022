import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import useNetworkStatus from './useNetworkStatus';
import { getAll, remove } from '../storage/outbox';
import { request } from '../api/client';
import { formatDateTime } from '../utils/date';

/**
 * Custom hook quản lý hàng đợi outbox và tự động đồng bộ khi có mạng
 * @param {() => void} [onSyncCompleted] - Callback được gọi sau khi đồng bộ thành công để reload dữ liệu
 * @returns {{
 *   pendingCount: number,
 *   syncing: boolean,
 *   syncNow: () => Promise<number>,
 *   refreshPendingCount: () => Promise<number>
 * }}
 */
export function useOutboxSync(onSyncCompleted) {
  const { isOnline } = useNetworkStatus();
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);

  const prevOnlineRef = useRef(isOnline);
  const onSyncCompletedRef = useRef(onSyncCompleted);
  onSyncCompletedRef.current = onSyncCompleted;

  // Cập nhật số lượng thao tác chờ trong hàng đợi
  const refreshPendingCount = useCallback(async () => {
    try {
      const items = await getAll();
      setPendingCount(items.length);
      return items.length;
    } catch {
      return 0;
    }
  }, []);

  useEffect(() => {
    refreshPendingCount();
  }, [refreshPendingCount]);

  // Thực hiện đồng bộ các thao tác trong hàng đợi theo thứ tự FIFO
  const syncNow = useCallback(async () => {
    if (syncing) return 0;
    setSyncing(true);

    let syncedCount = 0;
    const conflictNotices = [];

    try {
      const queue = await getAll();
      if (queue.length === 0) {
        setSyncing(false);
        return 0;
      }

      for (const action of queue) {
        try {
          // B5. Xử lý xung đột:
          // Nếu thao tác là PATCH và có thể kiểm tra updatedAt từ server
          if (action.method === 'PATCH' && action.url) {
            try {
              const serverItem = await request('GET', action.url);
              if (serverItem && serverItem.updatedAt) {
                const serverTime = new Date(serverItem.updatedAt).getTime();
                const clientTime = new Date(action.createdAt || action.body?.updatedAt || 0).getTime();

                // Nếu dữ liệu trên server mới hơn thao tác offline
                if (serverTime > clientTime) {
                  // Xung đột: Ưu tiên dữ liệu server, hủy thao tác client
                  await remove(action.id);
                  conflictNotices.push(
                    `Mục "${serverItem.title || serverItem.fullName || action.url}" đã được cập nhật trên server (${formatDateTime(serverItem.updatedAt)}). Thay đổi offline bị hủy để ưu tiên dữ liệu máy chủ.`
                  );
                  continue;
                }
              }
            } catch {
              // Nếu không lấy được để so sánh thì tiếp tục thử gửi request PATCH
            }
          }

          // Thực hiện gửi thao tác lên server
          await request(action.method, action.url, action.body);
          await remove(action.id);
          syncedCount += 1;
        } catch (actionErr) {
          console.warn(`Lỗi khi đồng bộ thao tác [${action.id}]:`, actionErr);
          // Nếu lỗi mạng/timeout thì dừng đồng bộ để giữ lại thứ tự
          if (actionErr.type === 'network' || actionErr.type === 'timeout') {
            break;
          }
          // Nếu lỗi HTTP không thể hồi phục (ví dụ 404), xóa khỏi hàng đợi tránh tắc nghẽn
          if (actionErr.type === 'http' && actionErr.status === 404) {
            await remove(action.id);
          } else {
            break;
          }
        }
      }

      await refreshPendingCount();

      // Thông báo kết quả đồng bộ
      if (syncedCount > 0) {
        Alert.alert('Đồng bộ dữ liệu', `Đã đồng bộ ${syncedCount} thay đổi thành công!`);
        if (onSyncCompletedRef.current) {
          onSyncCompletedRef.current();
        }
      }

      if (conflictNotices.length > 0) {
        Alert.alert('Xung đột dữ liệu', conflictNotices.join('\n\n'));
        if (onSyncCompletedRef.current) {
          onSyncCompletedRef.current();
        }
      }

      return syncedCount;
    } catch (err) {
      console.error('Lỗi trong quá trình syncNow:', err);
      return syncedCount;
    } finally {
      setSyncing(false);
    }
  }, [syncing, refreshPendingCount]);

  // Tự động đồng bộ khi mạng từ offline -> online
  useEffect(() => {
    if (!prevOnlineRef.current && isOnline) {
      // Vừa có mạng trở lại
      syncNow();
    }
    prevOnlineRef.current = isOnline;
  }, [isOnline, syncNow]);

  return {
    pendingCount,
    syncing,
    syncNow,
    refreshPendingCount,
  };
}

export default useOutboxSync;
