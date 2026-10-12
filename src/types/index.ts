export type AssignmentStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';

export interface StudentProfile {
  studentCode: string;
  fullName: string;
  className: string;
  major: string;
  academicYear: string;
  faculty: string;
  email: string;
  phone: string;
  currentSemester: string;
  gpa: number;
  cpa: number;
  totalCredits: number;
  completedCredits: number;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
  instructor: string;
  instructorEmail: string;
  instructorPhone: string;
  semester: string;
  room: string;
  scheduleText: string;
  description: string;
  color: string;
  progress: number; // 0 - 100
}

export interface ScheduleItem {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  dayOfWeek: number; // 2 = Thứ 2, ..., 8 = Chủ Nhật
  dayName: string; // "Thứ Hai", "Thứ Ba", ...
  startTime: string; // "07:30"
  endTime: string; // "11:00"
  room: string;
  instructor: string;
  shift: 'Sáng' | 'Chiều' | 'Tối';
  note?: string;
  color: string;
}

export interface Assignment {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  dueDate: string; // "2026-10-18T23:59:00"
  dueDateFormatted: string; // "18/10/2026 23:59"
  status: AssignmentStatus;
  description: string;
  requirements: string[];
  maxScore: number;
  studentNotes?: string;
}

export interface GradeItem {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  credits: number;
  semester: string;
  attendanceScore: number; // 10%
  exerciseScore: number; // 20%
  midtermScore: number; // 20%
  finalExamScore: number; // 50%
  totalScore10: number; // Điểm hệ 10
  totalScore4: number; // Điểm hệ 4
  letterGrade: string; // A, B+, B, C+, C, D, F
  evaluation: string; // Xuất sắc, Giỏi, Khá, Trung bình
  isPassed: boolean;
}

// Navigation types
export type RootStackParamList = {
  MainTabs: undefined;
  SubjectDetail: { subjectId: string };
  ScheduleDetail: { scheduleId: string };
  AssignmentDetail: { assignmentId: string };
  GradeDetail: { gradeId: string };
};

export type BottomTabParamList = {
  Dashboard: undefined;
  Subjects: undefined;
  Schedule: undefined;
  Assignments: undefined;
  Profile: undefined;
};
