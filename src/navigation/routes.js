/**
 * Khai báo hằng số tên màn hình và tabs trong ứng dụng.
 * Tuân thủ quy tắc 1: Không viết chuỗi trực tiếp khi gọi navigate.
 */
export const ROUTES = {
  // 5 Tabs chính
  HOME_TAB: 'HomeTab',
  COURSE_TAB: 'CourseTab',
  SCHEDULE_TAB: 'ScheduleTab',
  ASSIGNMENT_TAB: 'AssignmentTab',
  PROFILE_TAB: 'ProfileTab',

  // Tab 1: Home Stack
  HOME: 'HomeScreen',

  // Tab 2: Course Stack
  COURSE_LIST: 'CourseListScreen',
  COURSE_DETAIL: 'CourseDetailScreen',

  // Tab 3: Schedule Stack
  SCHEDULE: 'ScheduleScreen',
  SESSION_DETAIL: 'SessionDetailScreen',

  // Tab 4: Assignment Stack
  ASSIGNMENT_LIST: 'AssignmentListScreen',
  ASSIGNMENT_DETAIL: 'AssignmentDetailScreen',
  ASSIGNMENT_FORM: 'AssignmentFormScreen',

  // Tab 5: Profile Stack
  PROFILE: 'ProfileScreen',
  EDIT_PROFILE: 'EditProfileScreen',
  GRADE_LIST: 'GradeListScreen',
  GRADE_DETAIL: 'GradeDetailScreen',
};

export default ROUTES;
