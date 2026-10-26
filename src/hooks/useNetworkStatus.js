import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

/**
 * Custom hook theo dõi trạng thái kết nối mạng
 * @returns {{ isOnline: boolean }}
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Lấy trạng thái mạng ban đầu
    NetInfo.fetch().then(state => {
      if (isMounted) {
        const connected = Boolean(state.isConnected && state.isInternetReachable !== false);
        setIsOnline(connected);
      }
    });

    // Đăng ký lắng nghe thay đổi trạng thái mạng
    const unsubscribe = NetInfo.addEventListener(state => {
      if (isMounted) {
        const connected = Boolean(state.isConnected && state.isInternetReachable !== false);
        setIsOnline(connected);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return { isOnline };
}

export default useNetworkStatus;
