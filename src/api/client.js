import { BASE_URL, TIMEOUT } from '../config';

/**
 * Hàm gọi API chung theo chuẩn thiết kế
 * Hợp đồng: Trả về dữ liệu JSON; khi lỗi throw { type, status, message }
 * trong đó type là 'network', 'timeout' hoặc 'http'
 *
 * @param {'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'} method
 * @param {string} url - Đường dẫn (ví dụ '/courses' hoặc 'http://...')
 * @param {object|null} [body]
 * @returns {Promise<any>}
 */
export async function request(method, url, body = null) {
  const fullUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `${BASE_URL}${url}`;

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const options = {
    method: method.toUpperCase(),
    headers,
  };

  if (body && ['POST', 'PATCH', 'PUT'].includes(options.method)) {
    options.body = JSON.stringify(body);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => {
    controller.abort();
  }, TIMEOUT);

  options.signal = controller.signal;

  try {
    const response = await fetch(fullUrl, options);
    clearTimeout(timer);

    if (!response.ok) {
      let errorMsg = `Lỗi máy chủ (${response.status})`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.message) {
          errorMsg = errorData.message;
        }
      } catch {
        // Không phân tích được JSON lỗi thì dùng thông báo mặc định
      }

      const httpError = new Error(errorMsg);
      httpError.type = 'http';
      httpError.status = response.status;
      httpError.message = errorMsg;
      throw httpError;
    }

    // Với 204 No Content
    if (response.status === 204) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timer);

    if (error.type === 'http') {
      throw error;
    }

    if (error.name === 'AbortError') {
      const timeoutError = new Error('Yêu cầu vượt quá thời gian chờ (10 giây)');
      timeoutError.type = 'timeout';
      timeoutError.status = 408;
      timeoutError.message = 'Yêu cầu vượt quá thời gian chờ (10 giây)';
      throw timeoutError;
    }

    const networkError = new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng.');
    networkError.type = 'network';
    networkError.status = 0;
    networkError.message = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng.';
    throw networkError;
  }
}
