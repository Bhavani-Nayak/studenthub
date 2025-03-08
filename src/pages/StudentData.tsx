
import React from 'react';
import { useAuth } from '@/components/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Mock student data
const STUDENTS = [
  { id: '1', name: 'John Doe', email: 'john@example.com', grade: 'A', course: 'Computer Science', attendance: '90%' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', grade: 'B+', course: 'Physics', attendance: '85%' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', grade: 'A-', course: 'Mathematics', attendance: '95%' },
  { id: '4', name: 'Anna Williams', email: 'anna@example.com', grade: 'B', course: 'Biology', attendance: '80%' },
];

const StudentData = () => {
  const { user } = useAuth();
  
  // In a real app, you would fetch this data from an API
  // Different roles will see different data:
  // - Admin: all students
  // - Faculty: only assigned students
  // - Students: only their own data
  const filteredStudents = user?.role === 'admin' 
    ? STUDENTS 
    : user?.role === 'faculty' 
      ? STUDENTS.slice(0, 2) // Simulating assigned students
      : STUDENTS.filter(s => s.email === user?.email);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Student Records</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
          <CardDescription>
            {user?.role === 'admin' 
              ? 'Manage all student records' 
              : user?.role === 'faculty' 
                ? 'View and manage your assigned students' 
                : 'Your student record'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Attendance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.course}</TableCell>
                  <TableCell>{student.grade}</TableCell>
                  <TableCell>{student.attendance}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentData;
