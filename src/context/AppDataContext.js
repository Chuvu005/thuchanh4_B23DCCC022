import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { studentService } from '../api/studentService';
import { courseService } from '../api/courseService';
import { sessionService } from '../api/sessionService';
import { assignmentService } from '../api/assignmentService';
import { gradeService } from '../api/gradeService';
import { STORAGE_KEYS } from '../storage/keys';
import { getCache, setCache } from '../storage/cache';
import { enqueue } from '../storage/outbox';
import useNetworkStatus from '../hooks/useNetworkStatus';
import { useSync } from './SyncContext';

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const { isOnline } = useNetworkStatus();
  const { refreshPendingCount } = useSync();

  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);

  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Tải dữ liệu ban đầu: Đọc cache trước, sau đó gọi mạng
  const loadAllData = useCallback(async (isRefresh = false) => {
    if (!isRefresh) {
      setLoading(true);
    }
    setError(null);

    let hasAnyCache = false;

    // Đọc toàn bộ cache
    try {
      const [cachedStudent, cachedCourses, cachedSessions, cachedAssignments, cachedGrades] = await Promise.all([
        getCache(STORAGE_KEYS.CACHE_STUDENT),
        getCache(STORAGE_KEYS.CACHE_COURSES),
        getCache(STORAGE_KEYS.CACHE_SESSIONS),
        getCache(STORAGE_KEYS.CACHE_ASSIGNMENTS),
        getCache(STORAGE_KEYS.CACHE_GRADES),
      ]);

      if (cachedStudent?.data) {
        setStudent(cachedStudent.data);
        hasAnyCache = true;
      }
      if (cachedCourses?.data) {
        setCourses(cachedCourses.data);
        hasAnyCache = true;
      }
      if (cachedSessions?.data) {
        setSessions(cachedSessions.data);
        hasAnyCache = true;
      }
      if (cachedAssignments?.data) {
        setAssignments(cachedAssignments.data);
        hasAnyCache = true;
      }
      if (cachedGrades?.data) {
        setGrades(cachedGrades.data);
        hasAnyCache = true;
      }

      const timestamps = [
        cachedStudent?.savedAt,
        cachedCourses?.savedAt,
        cachedSessions?.savedAt,
        cachedAssignments?.savedAt,
        cachedGrades?.savedAt,
      ].filter(Boolean);

      if (timestamps.length > 0) {
        // Lấy thời điểm mới nhất trong cache
        timestamps.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
        setLastUpdated(timestamps[0]);
      }

      if (hasAnyCache && !isRefresh) {
        setLoading(false);
      }
    } catch (cacheErr) {
      console.warn('Lỗi đọc cache tổng thể:', cacheErr);
    }

    // Tải dữ liệu từ mạng nếu có thể
    try {
      const [remoteStudent, remoteCourses, remoteSessions, remoteAssignments, remoteGrades] = await Promise.all([
        studentService.getById(1),
        courseService.getAll(),
        sessionService.getAll(),
        assignmentService.getAll(),
        gradeService.getAll(),
      ]);

      const now = new Date().toISOString();

      setStudent(remoteStudent);
      setCourses(remoteCourses);
      setSessions(remoteSessions);
      setAssignments(remoteAssignments);
      setGrades(remoteGrades);
      setLastUpdated(now);
      setError(null);

      // Lưu kết quả vào cache
      await Promise.all([
        setCache(STORAGE_KEYS.CACHE_STUDENT, remoteStudent),
        setCache(STORAGE_KEYS.CACHE_COURSES, remoteCourses),
        setCache(STORAGE_KEYS.CACHE_SESSIONS, remoteSessions),
        setCache(STORAGE_KEYS.CACHE_ASSIGNMENTS, remoteAssignments),
        setCache(STORAGE_KEYS.CACHE_GRADES, remoteGrades),
      ]);
    } catch (fetchErr) {
      console.warn('Không thể lấy dữ liệu từ mạng:', fetchErr.message);
      if (!hasAnyCache) {
        setError(fetchErr.message || 'Không thể kết nối đến máy chủ.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // A6. Cập nhật lạc quan khi đổi trạng thái bài tập
  const toggleAssignmentStatus = useCallback(
    async id => {
      const targetAssignment = assignments.find(a => String(a.id) === String(id));
      if (!targetAssignment) return;

      const oldStatus = targetAssignment.status;
      const newStatus = oldStatus === 'done' ? 'todo' : 'done';
      const nowIso = new Date().toISOString();

      const updatedAssignment = {
        ...targetAssignment,
        status: newStatus,
        updatedAt: nowIso,
      };

      // Cập nhật lạc quan ngay lập tức lên giao diện
      const updatedList = assignments.map(a =>
        String(a.id) === String(id) ? updatedAssignment : a
      );
      setAssignments(updatedList);
      setCache(STORAGE_KEYS.CACHE_ASSIGNMENTS, updatedList);

      if (!isOnline) {
        // Đang offline -> đưa vào hàng đợi outbox
        await enqueue({
          entityId: targetAssignment.id,
          entityType: 'assignment',
          method: 'PATCH',
          url: `/assignments/${targetAssignment.id}`,
          body: { status: newStatus, updatedAt: nowIso },
        });
        await refreshPendingCount();
        return;
      }

      // Đang online -> gọi API
      try {
        await assignmentService.update(targetAssignment.id, {
          status: newStatus,
          updatedAt: nowIso,
        });
      } catch (err) {
        if (err.type === 'network' || err.type === 'timeout') {
          // Khi mất kết nối hoặc timeout (server offline / mạng chập chờn):
          // Lưu vào hàng đợi outbox để không chặn người dùng theo yêu cầu B3
          console.warn('Lỗi kết nối máy chủ, chuyển thao tác sang outbox:', err);
          await enqueue({
            entityId: targetAssignment.id,
            entityType: 'assignment',
            method: 'PATCH',
            url: `/assignments/${targetAssignment.id}`,
            body: { status: newStatus, updatedAt: nowIso },
          });
          await refreshPendingCount();
        } else {
          // Chỉ hoàn tác khi API trên server thực sự báo lỗi (mã lỗi HTTP 4xx, 5xx) theo yêu cầu A6
          console.warn('API báo lỗi cập nhật trạng thái bài tập, đang hoàn tác:', err);
          const revertedList = assignments.map(a =>
            String(a.id) === String(id) ? targetAssignment : a
          );
          setAssignments(revertedList);
          setCache(STORAGE_KEYS.CACHE_ASSIGNMENTS, revertedList);
          Alert.alert('Lỗi cập nhật', 'Không thể cập nhật trạng thái bài tập. Giao diện đã được hoàn tác.');
        }
      }
    },
    [assignments, isOnline, refreshPendingCount]
  );

  // A5 & B3. Thêm bài tập mới
  const addAssignment = useCallback(
    async assignmentData => {
      const nowIso = new Date().toISOString();
      // Sinh ID tạm thời nếu chưa có
      const newId = Date.now();
      const courseObj = courses.find(c => c.id === Number(assignmentData.courseId));

      const newAssignment = {
        id: newId,
        courseId: Number(assignmentData.courseId),
        title: assignmentData.title.trim(),
        description: assignmentData.description ? assignmentData.description.trim() : '',
        dueDate: assignmentData.dueDate,
        status: 'todo',
        updatedAt: nowIso,
        course: courseObj || null,
      };

      // Cập nhật state ngay lập tức
      const updatedList = [newAssignment, ...assignments];
      setAssignments(updatedList);
      setCache(STORAGE_KEYS.CACHE_ASSIGNMENTS, updatedList);

      if (!isOnline) {
        // Đang offline -> thêm vào outbox
        await enqueue({
          entityId: newId,
          entityType: 'assignment',
          method: 'POST',
          url: '/assignments',
          body: {
            courseId: newAssignment.courseId,
            title: newAssignment.title,
            description: newAssignment.description,
            dueDate: newAssignment.dueDate,
            status: newAssignment.status,
            updatedAt: newAssignment.updatedAt,
          },
        });
        await refreshPendingCount();
        return newAssignment;
      }

      // Đang online -> gửi POST
      try {
        const created = await assignmentService.create({
          courseId: newAssignment.courseId,
          title: newAssignment.title,
          description: newAssignment.description,
          dueDate: newAssignment.dueDate,
          status: newAssignment.status,
          updatedAt: newAssignment.updatedAt,
        });

        // Thay ID tạm thời bằng ID thật từ server nếu khác
        if (created && created.id) {
          const finalItem = { ...created, course: courseObj || null };
          const finalNormalizedList = assignments.map(a => (a.id === newId ? finalItem : a));
          setAssignments(finalNormalizedList);
          setCache(STORAGE_KEYS.CACHE_ASSIGNMENTS, finalNormalizedList);
          return finalItem;
        }
      } catch (err) {
        // Nếu mạng đột ngột lỗi, chuyển thành thao tác hàng đợi
        await enqueue({
          entityId: newId,
          entityType: 'assignment',
          method: 'POST',
          url: '/assignments',
          body: {
            courseId: newAssignment.courseId,
            title: newAssignment.title,
            description: newAssignment.description,
            dueDate: newAssignment.dueDate,
            status: newAssignment.status,
            updatedAt: newAssignment.updatedAt,
          },
        });
        await refreshPendingCount();
      }

      return newAssignment;
    },
    [assignments, courses, isOnline, refreshPendingCount]
  );

  // B3 & PATCH /students/1. Sửa thông tin cá nhân
  const updateStudentProfile = useCallback(
    async updatedFields => {
      const nowIso = new Date().toISOString();
      const updatedData = {
        ...student,
        ...updatedFields,
        updatedAt: nowIso,
      };

      setStudent(updatedData);
      setCache(STORAGE_KEYS.CACHE_STUDENT, updatedData);

      if (!isOnline) {
        await enqueue({
          entityId: 1,
          entityType: 'student',
          method: 'PATCH',
          url: '/students/1',
          body: { ...updatedFields, updatedAt: nowIso },
        });
        await refreshPendingCount();
        return updatedData;
      }

      try {
        await studentService.update(1, { ...updatedFields, updatedAt: nowIso });
      } catch (err) {
        console.warn('Lỗi gửi PATCH student, lưu vào outbox:', err);
        await enqueue({
          entityId: 1,
          entityType: 'student',
          method: 'PATCH',
          url: '/students/1',
          body: { ...updatedFields, updatedAt: nowIso },
        });
        await refreshPendingCount();
      }

      return updatedData;
    },
    [student, isOnline, refreshPendingCount]
  );

  // Số lượng bài tập chưa hoàn thành (để gán tabBarBadge)
  const todoAssignmentsCount = useMemo(() => {
    return assignments.filter(a => a.status === 'todo').length;
  }, [assignments]);

  const value = {
    student,
    courses,
    sessions,
    assignments,
    grades,
    lastUpdated,
    loading,
    error,
    todoAssignmentsCount,
    reloadAll: () => loadAllData(true),
    toggleAssignmentStatus,
    addAssignment,
    updateStudentProfile,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData phải được sử dụng bên trong AppDataProvider');
  }
  return context;
}

export default AppDataContext;
