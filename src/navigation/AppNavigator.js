import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ROUTES } from './routes';
import HomeStack from './HomeStack';
import CourseStack from './CourseStack';
import ScheduleStack from './ScheduleStack';
import AssignmentStack from './AssignmentStack';
import ProfileStack from './ProfileStack';
import { useAppData } from '../context/AppDataContext';
import colors from '../theme/colors';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const { todoAssignmentsCount } = useAppData();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name={ROUTES.HOME_TAB}
        component={HomeStack}
        options={{
          tabBarLabel: 'Tổng quan',
          tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name={ROUTES.COURSE_TAB}
        component={CourseStack}
        options={{
          tabBarLabel: 'Môn học',
          tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>📚</Text>,
        }}
      />
      <Tab.Screen
        name={ROUTES.SCHEDULE_TAB}
        component={ScheduleStack}
        options={{
          tabBarLabel: 'Thời khóa biểu',
          tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>📅</Text>,
        }}
      />
      <Tab.Screen
        name={ROUTES.ASSIGNMENT_TAB}
        component={AssignmentStack}
        options={{
          tabBarLabel: 'Bài tập',
          tabBarBadge: todoAssignmentsCount > 0 ? todoAssignmentsCount : undefined,
          tabBarBadgeStyle: styles.badgeStyle,
          tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>📝</Text>,
        }}
      />
      <Tab.Screen
        name={ROUTES.PROFILE_TAB}
        component={ProfileStack}
        options={{
          tabBarLabel: 'Cá nhân',
          tabBarIcon: ({ color }) => <Text style={[styles.tabIcon, { color }]}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.tabBackground,
    borderTopColor: colors.border,
    minHeight: 60,
    paddingBottom: 8,
    paddingTop: 6,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  tabIcon: {
    fontSize: 20,
  },
  badgeStyle: {
    backgroundColor: colors.danger,
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
});
