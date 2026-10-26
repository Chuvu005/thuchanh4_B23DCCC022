import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from './routes';
import HomeScreen from '../screens/home/HomeScreen';
import CourseDetailScreen from '../screens/courses/CourseDetailScreen';
import AssignmentDetailScreen from '../screens/assignments/AssignmentDetailScreen';
import SessionDetailScreen from '../screens/schedule/SessionDetailScreen';
import colors from '../theme/colors';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '700',
        },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name={ROUTES.HOME}
        component={HomeScreen}
        options={{ title: 'Tổng quan' }}
      />
      <Stack.Screen
        name={ROUTES.COURSE_DETAIL}
        component={CourseDetailScreen}
        options={{ title: 'Chi tiết môn học' }}
      />
      <Stack.Screen
        name={ROUTES.ASSIGNMENT_DETAIL}
        component={AssignmentDetailScreen}
        options={{ title: 'Chi tiết bài tập' }}
      />
      <Stack.Screen
        name={ROUTES.SESSION_DETAIL}
        component={SessionDetailScreen}
        options={{ title: 'Chi tiết buổi học' }}
      />
    </Stack.Navigator>
  );
}
