
import React from 'react';
import { useAuth } from '@/components/AuthContext';
import { CalendarIcon, GraduationCapIcon, UsersIcon, BookOpenIcon, ShieldAlertIcon, AlertCircleIcon } from 'lucide-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCards from '@/components/dashboard/StatsCards';
import QuickAccessCards from '@/components/dashboard/QuickAccessCards';
import AdminCharts from '@/components/dashboard/AdminCharts';
import StudentCharts from '@/components/dashboard/StudentCharts';
import AdminRequests from '@/components/AdminRequests';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const { profile, isAdmin, isFaculty, isStudent } = useAuth();
  
  if (!profile) return null;

  // Check if the user is waiting for admin approval
  const isPending = (profile.role === 'faculty' || profile.role === 'student');
  
  // Get the appropriate stats based on user role
  const stats = OVERVIEW_STATS[profile.role] || OVERVIEW_STATS.student;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <DashboardHeader title={`${profile.role.charAt(0).toUpperCase() + profile.role.slice(1)} Dashboard`} />
      
      {/* Admin Requests Panel (Admin Only) */}
      {isAdmin && <AdminRequests />}
      
      {/* Overview Cards */}
      <StatsCards stats={stats} />
      
      {/* Role-specific content */}
      {isAdmin && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="courses">Course Management</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <AdminCharts />
            <QuickAccessCards />
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Manage users, roles, and permissions. View the Users page for detailed management options.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>Course Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Configure courses, assign faculty, and manage schedules.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Generate and view reports on attendance, academic performance, and other metrics.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
      
      {isFaculty && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">My Students</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <AdminCharts />
            <QuickAccessCards />
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Student Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  View and manage students enrolled in your courses.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>Course Materials</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Manage course materials, assignments, and grades.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Mark and review student attendance for your courses.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
      
      {isStudent && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">My Courses</TabsTrigger>
            <TabsTrigger value="grades">My Grades</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <StudentCharts />
            <QuickAccessCards />
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>Enrolled Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  View details about courses you're enrolled in.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grades">
            <Card>
              <CardHeader>
                <CardTitle>Academic Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  View your grades and academic progress.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Class Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  View your weekly schedule and upcoming classes.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Dashboard;
