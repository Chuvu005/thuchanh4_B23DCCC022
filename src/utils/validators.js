/**
 * Kiểm tra dữ liệu cho form bài tập
 * Yêu cầu A5: tiêu đề không rỗng, hạn nộp không ở quá khứ
 */
export function validateAssignmentForm({ title, dueDate, courseId }) {
  const errors = {};

  if (!title || !title.trim()) {
    errors.title = 'Tiêu đề không được để trống';
  }

  if (!courseId) {
    errors.courseId = 'Vui lòng chọn môn học';
  }

  if (!dueDate) {
    errors.dueDate = 'Vui lòng chọn hoặc nhập hạn nộp';
  } else {
    const dueTime = new Date(dueDate).getTime();
    if (isNaN(dueTime)) {
      errors.dueDate = 'Hạn nộp không đúng định dạng ngày giờ';
    } else if (dueTime < Date.now()) {
      errors.dueDate = 'Hạn nộp không được ở quá khứ';
    }
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}

/**
 * Kiểm tra dữ liệu cập nhật thông tin cá nhân sinh viên
 */
export function validateStudentProfile({ fullName, email, phone }) {
  const errors = {};

  if (!fullName || !fullName.trim()) {
    errors.fullName = 'Họ và tên không được để trống';
  }

  if (!email || !email.trim()) {
    errors.email = 'Email không được để trống';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      errors.email = 'Email không hợp lệ (ví dụ: student@ptit.edu.vn)';
    }
  }

  if (!phone || !phone.trim()) {
    errors.phone = 'Số điện thoại không được để trống';
  } else {
    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
    if (!phoneRegex.test(phone.trim().replace(/\s/g, ''))) {
      errors.phone = 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)';
    }
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}
