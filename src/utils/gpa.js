/**
 * Chuyển đổi điểm hệ 10 sang điểm chữ và thang điểm 4 theo quy chế
 * @param {number} score10
 * @returns {{ letter: string, scale4: number }}
 */
export function toScale4(score10) {
  const num = typeof score10 === 'number' ? score10 : parseFloat(score10);
  if (isNaN(num)) return { letter: 'F', scale4: 0 };

  if (num >= 8.5) return { letter: 'A', scale4: 4.0 };
  if (num >= 8.0) return { letter: 'B+', scale4: 3.5 };
  if (num >= 7.0) return { letter: 'B', scale4: 3.0 };
  if (num >= 6.5) return { letter: 'C+', scale4: 2.5 };
  if (num >= 5.5) return { letter: 'C', scale4: 2.0 };
  if (num >= 5.0) return { letter: 'D+', scale4: 1.5 };
  if (num >= 4.0) return { letter: 'D', scale4: 1.0 };
  return { letter: 'F', scale4: 0.0 };
}

/**
 * Tính GPA hệ 4 có trọng số theo tín chỉ và tổng số tín chỉ tích lũy
 * GPA = tổng (điểm hệ 4 × số tín chỉ) / tổng số tín chỉ
 * Môn điểm F không tính vào số tín chỉ tích lũy.
 * @param {Array} grades - Danh sách bản ghi điểm (có course hoặc courseId)
 * @param {Array} [courses] - Danh sách môn học để tra cứu số tín chỉ nếu grade chưa có
 * @returns {{ gpa: number, totalCredits: number }}
 */
export function calcGpa(grades = [], courses = []) {
  if (!grades || grades.length === 0) {
    return { gpa: 0, totalCredits: 0 };
  }

  let totalPoints = 0;
  let totalGradeCredits = 0;
  let accumulatedCredits = 0;

  grades.forEach(grade => {
    const courseCredits =
      grade.course?.credits ||
      courses.find(c => c.id === grade.courseId)?.credits ||
      3;

    const { letter, scale4 } = toScale4(grade.total);

    totalPoints += scale4 * courseCredits;
    totalGradeCredits += courseCredits;

    if (letter !== 'F') {
      accumulatedCredits += courseCredits;
    }
  });

  const rawGpa = totalGradeCredits > 0 ? totalPoints / totalGradeCredits : 0;
  return {
    gpa: parseFloat(rawGpa.toFixed(2)),
    totalCredits: accumulatedCredits,
  };
}
