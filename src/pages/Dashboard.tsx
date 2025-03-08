
import React from 'react';
import { useAuth } from '@/components/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CalendarIcon, GraduationCapIcon, UsersIcon, BookOpenIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

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

// Chart data for admin view
const PERFORMANCE_DATA = [
  { name: 'CS101', average: 87 },
  { name: 'PHYS201', average: 79 },
  { name: 'MATH150', average: 82 },
  { name: 'BIO110', average: 91 },
];

// Attendance pie chart data
const ATTENDANCE_DATA = [
  { name: 'Present', value: 87 },
  { name: 'Absent', value: 13 },
];

// Colors for the pie chart
const COLORS = ['#4CAF50', '#F44336'];

const Dashboard = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  // Get the appropriate stats based on user role
  const stats = OVERVIEW_STATS[user.role] || OVERVIEW_STATS.student;

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                {stat.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Quick Access Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Link to="/students">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center h-32">
              <UsersIcon className="h-8 w-8 mb-2 text-blue-500" />
              <h3 className="font-medium">Student Records</h3>
            </CardContent>
          </Card>
        </Link>
        <Link to="/attendance">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center h-32">
              <CalendarIcon className="h-8 w-8 mb-2 text-green-500" />
              <h3 className="font-medium">Attendance</h3>
            </CardContent>
          </Card>
        </Link>
        <Link to="/performance">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center h-32">
              <GraduationCapIcon className="h-8 w-8 mb-2 text-amber-500" />
              <h3 className="font-medium">Performance</h3>
            </CardContent>
          </Card>
        </Link>
        <Link to="/courses">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center h-32">
              <BookOpenIcon className="h-8 w-8 mb-2 text-purple-500" />
              <h3 className="font-medium">Courses & Timetable</h3>
            </CardContent>
          </Card>
        </Link>
      </div>
      
      {/* Charts - Only show detailed analytics for admin and faculty */}
      {(user.role === 'admin' || user.role === 'faculty') && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Course Performance</CardTitle>
              <CardDescription>Average grades across courses</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={PERFORMANCE_DATA}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="average" fill="#4CAF50" name="Average Grade" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Attendance Overview</CardTitle>
              <CardDescription>Present vs. absent statistics</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ATTENDANCE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {ATTENDANCE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* For student role, show a different view */}
      {user.role === 'student' && (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Academic Progress</CardTitle>
              <CardDescription>Course performance this semester</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'CS101', grade: 92 },
                    { name: 'PHYS201', grade: 78 },
                    { name: 'MATH150', grade: 88 },
                    { name: 'BIO110', grade: 85 },
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="grade" fill="#4CAF50" name="Your Grade" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
