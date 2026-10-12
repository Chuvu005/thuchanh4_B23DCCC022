import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StudentProfile,
  Subject,
  ScheduleItem,
  Assignment,
  GradeItem,
  AssignmentStatus,
} from '../types';
import {
  initialStudentProfile,
  initialSubjects,
  initialSchedule,
  initialAssignments,
  initialGrades,
} from '../data/mockData';

interface AppContextType {
  profile: StudentProfile;
  subjects: Subject[];
  schedules: ScheduleItem[];
  assignments: Assignment[];
  grades: GradeItem[];
  isLoading: boolean;
  updateProfileContact: (email: string, phone: string) => Promise<boolean>;
  updateAssignmentStatus: (assignmentId: string, status: AssignmentStatus) => Promise<void>;
  updateAssignmentNotes: (assignmentId: string, notes: string) => Promise<void>;
  getSubjectById: (id: string) => Subject | undefined;
  getScheduleById: (id: string) => ScheduleItem | undefined;
  getAssignmentById: (id: string) => Assignment | undefined;
  getGradeById: (id: string) => GradeItem | undefined;
  getAssignmentsBySubject: (subjectId: string) => Assignment[];
  getScheduleBySubject: (subjectId: string) => ScheduleItem[];
  getGradeBySubject: (subjectId: string) => GradeItem | undefined;
  uncompletedAssignmentsCount: number;
}

const STORAGE_KEYS = {
  PROFILE: '@studymanager_profile',
  ASSIGNMENTS: '@studymanager_assignments',
};

const AppDataContext = createContext<AppContextType | undefined>(undefined);

export const AppDataProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<StudentProfile>(initialStudentProfile);
  const [subjects] = useState<Subject[]>(initialSubjects);
  const [schedules] = useState<ScheduleItem[]>(initialSchedule);
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [grades] = useState<GradeItem[]>(initialGrades);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load persisted data on startup
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
        if (storedProfile) {
          const parsed = JSON.parse(storedProfile);
          setProfile(prev => ({ ...prev, ...parsed }));
        }

        const storedAssignments = await AsyncStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
        if (storedAssignments) {
          const parsed = JSON.parse(storedAssignments);
          setAssignments(parsed);
        }
      } catch (error) {
        console.warn('Error loading stored data from AsyncStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredData();
  }, []);

  // Update profile contact info
  const updateProfileContact = async (email: string, phone: string): Promise<boolean> => {
    try {
      const updatedProfile = {
        ...profile,
        email: email.trim(),
        phone: phone.trim(),
      };
      setProfile(updatedProfile);
      await AsyncStorage.setItem(
        STORAGE_KEYS.PROFILE,
        JSON.stringify({ email: updatedProfile.email, phone: updatedProfile.phone }),
      );
      return true;
    } catch (error) {
      console.error('Failed to update contact info:', error);
      return false;
    }
  };

  // Update assignment status
  const updateAssignmentStatus = async (assignmentId: string, status: AssignmentStatus) => {
    try {
      const updated = assignments.map(a =>
        a.id === assignmentId ? { ...a, status } : a,
      );
      setAssignments(updated);
      await AsyncStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to update assignment status:', error);
    }
  };

  // Update assignment notes
  const updateAssignmentNotes = async (assignmentId: string, studentNotes: string) => {
    try {
      const updated = assignments.map(a =>
        a.id === assignmentId ? { ...a, studentNotes } : a,
      );
      setAssignments(updated);
      await AsyncStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to update assignment notes:', error);
    }
  };

  // Query helpers
  const getSubjectById = (id: string) => subjects.find(s => s.id === id);
  const getScheduleById = (id: string) => schedules.find(s => s.id === id);
  const getAssignmentById = (id: string) => assignments.find(a => a.id === id);
  const getGradeById = (id: string) => grades.find(g => g.id === id);

  const getAssignmentsBySubject = (subjectId: string) =>
    assignments.filter(a => a.subjectId === subjectId);

  const getScheduleBySubject = (subjectId: string) =>
    schedules.filter(s => s.subjectId === subjectId);

  const getGradeBySubject = (subjectId: string) =>
    grades.find(g => g.subjectId === subjectId);

  const uncompletedAssignmentsCount = assignments.filter(
    a => a.status !== 'completed',
  ).length;

  return (
    <AppDataContext.Provider
      value={{
        profile,
        subjects,
        schedules,
        assignments,
        grades,
        isLoading,
        updateProfileContact,
        updateAssignmentStatus,
        updateAssignmentNotes,
        getSubjectById,
        getScheduleById,
        getAssignmentById,
        getGradeById,
        getAssignmentsBySubject,
        getScheduleBySubject,
        getGradeBySubject,
        uncompletedAssignmentsCount,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};
