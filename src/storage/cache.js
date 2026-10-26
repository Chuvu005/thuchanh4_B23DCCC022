import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Lấy dữ liệu cache theo khóa
 * @param {string} key
 * @returns {Promise<{ data: any, savedAt: string } | null>}
 */
export async function getCache(key) {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && 'data' in parsed && 'savedAt' in parsed) {
      return parsed;
    }
    return { data: parsed, savedAt: new Date().toISOString() };
  } catch (error) {
    console.error(`Lỗi đọc cache [${key}]:`, error);
    return null;
  }
}

/**
 * Lưu dữ liệu vào cache kèm thời điểm lưu
 * @param {string} key
 * @param {any} data
 * @returns {Promise<boolean>}
 */
export async function setCache(key, data) {
  try {
    const payload = {
      data,
      savedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(key, JSON.stringify(payload));
    return true;
  } catch (error) {
    console.error(`Lỗi ghi cache [${key}]:`, error);
    return false;
  }
}

/**
 * Xóa cache theo khóa
 * @param {string} key
 * @returns {Promise<boolean>}
 */
export async function removeCache(key) {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Lỗi xóa cache [${key}]:`, error);
    return false;
  }
}

export default {
  getCache,
  setCache,
  removeCache,
};
