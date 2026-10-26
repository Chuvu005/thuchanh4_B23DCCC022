import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import useNetworkStatus from '../hooks/useNetworkStatus';
import useOutboxSync from '../hooks/useOutboxSync';
import { getAll } from '../storage/outbox';

const SyncContext = createContext({
  isOnline: true,
  pendingCount: 0,
  syncing: false,
  pendingActions: [],
  isItemPending: () => false,
  syncNow: async () => 0,
  refreshPendingCount: async () => 0,
});

export function SyncProvider({ children, onSyncCompleted }) {
  const { isOnline } = useNetworkStatus();
  const [pendingActions, setPendingActions] = useState([]);

  const refreshPendingList = useCallback(async () => {
    try {
      const items = await getAll();
      setPendingActions(items);
      return items;
    } catch {
      return [];
    }
  }, []);

  const handleSyncCompleted = useCallback(() => {
    refreshPendingList();
    if (onSyncCompleted) {
      onSyncCompleted();
    }
  }, [refreshPendingList, onSyncCompleted]);

  const { pendingCount, syncing, syncNow, refreshPendingCount } = useOutboxSync(handleSyncCompleted);

  useEffect(() => {
    refreshPendingList();
  }, [pendingCount, refreshPendingList]);

  /**
   * Kiểm tra xem một thực thể (ví dụ assignment id = 1) có đang chờ đồng bộ hay không
   */
  const isItemPending = useCallback(
    (entityId, entityType) => {
      if (!entityId || pendingActions.length === 0) return false;
      const strId = String(entityId);
      return pendingActions.some(action => {
        if (action.entityId && String(action.entityId) === strId) return true;
        if (action.url && action.url.includes(`/${strId}`)) return true;
        if (entityType === 'assignment' && action.url?.startsWith('/assignments')) {
          if (action.body?.id && String(action.body.id) === strId) return true;
        }
        return false;
      });
    },
    [pendingActions]
  );

  const value = {
    isOnline,
    pendingCount,
    syncing,
    pendingActions,
    isItemPending,
    syncNow: async () => {
      const count = await syncNow();
      await refreshPendingList();
      return count;
    },
    refreshPendingCount: async () => {
      await refreshPendingList();
      return refreshPendingCount();
    },
  };

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
}

export function useSync() {
  return useContext(SyncContext);
}

export default SyncContext;
