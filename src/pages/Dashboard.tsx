
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/components/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, GraduationCap, ClipboardCheck, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

// Sample data for charts
const attendanceData = [
  { name: 'Mon', value: 92 },
  { name: 'Tue', value: 88 },
  { name: 'Wed', value: 95 },
  { name: 'Thu', value: 90 },
  { name: 'Fri', value: 85 },
];

const performanceData = [
  { name: 'Math', value: 85 },
  { name: 'Science', value: 92 },
  { name: 'English', value: 78 },
  { name: 'History', value: 88 },
  { name: 'CS', value: 95 },
];

const Dashboard = () => {
  const { user } = useAuth();
  
  // Quick actions based on user role
  const getQuickActions = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { title: 'Manage Users', icon: Users, color: 'bg-blue-100', href: '/users' },
          { title: 'Student Records', icon: GraduationCap, color: 'bg-purple-100', href: '/students' },
          { title: 'View Attendance', icon: ClipboardCheck, color: 'bg-green-100', href: '/attendance' },
          { title: 'Manage Courses', icon: BookOpen, color: 'bg-amber-100', href: '/courses' }
        ];
      case 'faculty':
        return [
          { title: 'Mark Attendance', icon: ClipboardCheck, color: 'bg-green-100', href: '/attendance' },
          { title: 'Enter Grades', icon: GraduationCap, color: 'bg-purple-100', href: '/performance' },
          { title: 'Student Data', icon: Users, color: 'bg-blue-100', href: '/students' },
          { title: 'View Timetable', icon: BookOpen, color: 'bg-amber-100', href: '/courses' }
        ];
      case 'student':
        return [
          { title: 'My Attendance', icon: ClipboardCheck, color: 'bg-green-100', href: '/attendance' },
          { title: 'My Performance', icon: GraduationCap, color: 'bg-purple-100', href: '/performance' },
          { title: 'My Courses', icon: BookOpen, color: 'bg-amber-100', href: '/courses' },
          { title: 'Profile', icon: Users, color: 'bg-blue-100', href: '/profile' }
        ];
      default:
        return [];
    }
  };

  const quickActions = getQuickActions();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome section */}
        <div className="mb-8 animate-slide-in" style={{ animationDelay: '0ms' }}>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground mt-1">
            Here's an overview of your {user?.role === 'student' ? 'academic' : ''} dashboard
          </p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Card key={action.title} className="animate-slide-in overflow-hidden group hover:border-primary/20 transition-all duration-300" style={{ animationDelay: `${index * 50}ms` }}>
              <Link to={action.href}>
                <CardContent className="p-6 flex flex-col items-center text-center gap-2">
                  <div className={`p-3 rounded-full ${action.color} mb-2 transition-transform duration-300 group-hover:scale-110`}>
                    <action.icon className="h-6 w-6 text-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">{action.title}</h3>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {/* Charts and stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Attendance Chart */}
          <Card className="animate-slide-in" style={{ animationDelay: '200ms' }}>
            <CardHeader>
              <CardTitle>Weekly Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceData}>
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Attendance']}
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: 'none', 
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)'
                      }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Performance Chart */}
          <Card className="animate-slide-in" style={{ animationDelay: '250ms' }}>
            <CardHeader>
              <CardTitle>Academic Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Score']}
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: 'none', 
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)'
                      }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent activity */}
        <Card className="animate-slide-in" style={{ animationDelay: '300ms' }}>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 pb-3 border-b">
                <div className="bg-blue-100 p-2 rounded-full">
                  <ClipboardCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Attendance updated</p>
                  <p className="text-xs text-muted-foreground">Today, 10:30 AM</p>
                </div>
              </li>
              <li className="flex items-center gap-3 pb-3 border-b">
                <div className="bg-green-100 p-2 rounded-full">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Math quiz score added</p>
                  <p className="text-xs text-muted-foreground">Yesterday, 2:15 PM</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">New course materials added</p>
                  <p className="text-xs text-muted-foreground">Aug 10, 9:45 AM</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
