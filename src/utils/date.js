/**
 * Các hàm tiện ích xử lý định dạng ngày giờ theo chuẩn tiếng Việt
 */

export function formatDate(dateInput, includeTime = false) {
  if (!dateInput) return '';
  const date = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return '';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  if (includeTime) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}, ${day}/${month}/${year}`;
  }

  return `${day}/${month}/${year}`;
}

export function formatDateTime(dateInput) {
  return formatDate(dateInput, true);
}

export function isOverdue(dueDate, status) {
  if (!dueDate) return false;
  if (status === 'done') return false;
  const due = new Date(dueDate).getTime();
  const now = new Date().getTime();
  return due < now;
}

export function daysLeft(dueDate) {
  if (!dueDate) return 0;
  const due = new Date(dueDate).getTime();
  const now = new Date().getTime();
  const diffTime = due - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getDayOfWeekName(dayNumber) {
  const map = {
    2: 'Thứ 2',
    3: 'Thứ 3',
    4: 'Thứ 4',
    5: 'Thứ 5',
    6: 'Thứ 6',
    7: 'Thứ 7',
    8: 'Chủ nhật',
  };
  return map[dayNumber] || `Thứ ${dayNumber}`;
}
