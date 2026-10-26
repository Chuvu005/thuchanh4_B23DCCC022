import { useState, useEffect, useCallback, useRef } from 'react';
import { getCache, setCache } from '../storage/cache';

/**
 * Custom hook thực hiện truy vấn theo chiến lược "cache trước, mạng sau"
 * @param {string} key - Khóa cache trong AsyncStorage
 * @param {() => Promise<any>} fetcher - Hàm gọi API lấy dữ liệu
 * @returns {{
 *   data: any,
 *   loading: boolean,
 *   error: string | null,
 *   refreshing: boolean,
 *   lastUpdated: string | null,
 *   refresh: () => Promise<void>,
 *   setData: (data: any) => void
 * }}
 */
export function useCachedQuery(key, fetcher) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const loadData = useCallback(async (isPullToRefresh = false) => {
    if (isPullToRefresh) {
      setRefreshing(true);
    }

    let hasCachedData = false;

    // 1. Kiểm tra cache trước
    try {
      const cached = await getCache(key);
      if (cached && cached.data !== null && cached.data !== undefined) {
        hasCachedData = true;
        setData(cached.data);
        setLastUpdated(cached.savedAt);
        // Đã có dữ liệu từ cache thì tắt trạng thái loading chính
        if (!isPullToRefresh) {
          setLoading(false);
        }
      }
    } catch (cacheErr) {
      console.warn('Lỗi đọc cache trong useCachedQuery:', cacheErr);
    }

    // 2. Gọi mạng để lấy dữ liệu mới nhất
    try {
      const remoteData = await fetcherRef.current();
      setData(remoteData);
      setError(null);
      const nowIso = new Date().toISOString();
      setLastUpdated(nowIso);
      await setCache(key, remoteData);
    } catch (err) {
      // Nếu không có cache mà mạng lỗi thì hiển thị lỗi
      if (!hasCachedData) {
        setError(err.message || 'Không thể tải dữ liệu từ máy chủ.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [key]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refresh = useCallback(() => {
    return loadData(true);
  }, [loadData]);

  return {
    data,
    loading,
    error,
    refreshing,
    lastUpdated,
    refresh,
    setData,
  };
}

export default useCachedQuery;
