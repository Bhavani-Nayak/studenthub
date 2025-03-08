
import React from 'react';
import { useAuth } from '@/components/AuthContext';
import { CalendarIcon, GraduationCapIcon, UsersIcon, BookOpenIcon } from 'lucide-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCards from '@/components/dashboard/StatsCards';
import QuickAccessCards from '@/components/dashboard/QuickAccessCards';
import AdminCharts from '@/components/dashboard/AdminCharts';
import StudentCharts from '@/components/dashboard/StudentCharts';

// Mock data for the dashboard
const OVERVIEW_STATS = {
  admin: [
    { title: 'Total Students', value: 256, icon: <UsersIcon />, color: 'bg-blue-100 text-blue-600' },
    { title: 'Total Faculty', value: 32, icon: <GraduationCapIcon />, color: 'bg-purple-100 text-purple-600' },
    { title: 'Courses', value: 24, icon: <BookOpenIcon />, color: 'bg-amber-100 text-amber-600' },
    { title: 'Average Attendance', value: '87%', icon: <CalendarIcon />, color: 'bg-green-100 text-green-600' },
  ],
  faculty: [
    { title: 'My Students', value: 45, icon: <UsersIcon />, color: 'bg-blue-100 text-blue-600' },
    { title: 'My Courses', value: 3, icon: <BookOpenIcon />, color: 'bg-amber-100 text-amber-600' },
    { title: 'Next Class', value: 'CS101 at 9AM', icon: <CalendarIcon />, color: 'bg-purple-100 text-purple-600' },
    { title: 'Assignments Due', value: 5, icon: <GraduationCapIcon />, color: 'bg-red-100 text-red-600' },
  ],
  student: [
    { title: 'Courses Enrolled', value: 4, icon: <BookOpenIcon />, color: 'bg-blue-100 text-blue-600' },
    { title: 'Attendance', value: '92%', icon: <CalendarIcon />, color: 'bg-green-100 text-green-600' },
    { title: 'Current GPA', value: '3.7', icon: <GraduationCapIcon />, color: 'bg-amber-100 text-amber-600' },
    { title: 'Assignments Due', value: 3, icon: <UsersIcon />, color: 'bg-red-100 text-red-600' },
  ]
};

const Dashboard = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  // Get the appropriate stats based on user role
  const stats = OVERVIEW_STATS[user.role] || OVERVIEW_STATS.student;

  return (
    <div className="container mx-auto py-6">
      <DashboardHeader title="Dashboard" />
      
      {/* Overview Cards */}
      <StatsCards stats={stats} />
      
      {/* Quick Access Cards */}
      <QuickAccessCards />
      
      {/* Charts - Only show detailed analytics for admin and faculty */}
      {(user.role === 'admin' || user.role === 'faculty') && <AdminCharts />}
      
      {/* For student role, show a different view */}
      {user.role === 'student' && <StudentCharts />}
    </div>
  );
};

export default Dashboard;
