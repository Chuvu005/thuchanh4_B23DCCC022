import { Platform } from 'react-native';

// Địa chỉ json-server:
// - Android Emulator: http://10.0.2.2:3000
// - iOS Simulator / Web: http://localhost:3000
// - Thiết bị thật: Thay bằng IP mạng LAN của máy tính, ví dụ: http://192.168.1.10:3000
export const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export const TIMEOUT = 10000; // 10 giây timeout

export const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 giờ
