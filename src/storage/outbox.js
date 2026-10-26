import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './keys';

/**
 * Lấy toàn bộ hàng đợi outbox (giữ đúng thứ tự thêm vào FIFO)
 * @returns {Promise<Array<{ id: string, method: string, url: string, body: any, createdAt: string }>>}
 */
export async function getAll() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.OUTBOX_QUEUE);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (error) {
    console.error('Lỗi lấy hàng đợi outbox:', error);
    return [];
  }
}

/**
 * Thêm một thao tác vào hàng đợi outbox
 * @param {{ id?: string, method: string, url: string, body: any, createdAt?: string, [key: string]: any }} action
 * @returns {Promise<{ id: string, method: string, url: string, body: any, createdAt: string }>}
 */
export async function enqueue(action) {
  try {
    const currentList = await getAll();
    const newAction = {
      id: action.id || `outbox_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      method: action.method || 'POST',
      url: action.url,
      body: action.body,
      createdAt: action.createdAt || new Date().toISOString(),
      ...action,
    };

    const updatedList = [...currentList, newAction];
    await AsyncStorage.setItem(STORAGE_KEYS.OUTBOX_QUEUE, JSON.stringify(updatedList));
    return newAction;
  } catch (error) {
    console.error('Lỗi thêm thao tác vào outbox:', error);
    throw error;
  }
}

/**
 * Xóa một thao tác khỏi hàng đợi theo id
 * @param {string} id
 * @returns {Promise<boolean>}
 */
export async function remove(id) {
  try {
    const currentList = await getAll();
    const updatedList = currentList.filter(item => item.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.OUTBOX_QUEUE, JSON.stringify(updatedList));
    return true;
  } catch (error) {
    console.error(`Lỗi xóa thao tác [${id}] khỏi outbox:`, error);
    return false;
  }
}

/**
 * Xóa sạch hàng đợi
 */
export async function clear() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.OUTBOX_QUEUE);
    return true;
  } catch (error) {
    console.error('Lỗi làm sạch outbox:', error);
    return false;
  }
}

export default {
  getAll,
  enqueue,
  remove,
  clear,
};
