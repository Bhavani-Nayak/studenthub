
import React from 'react';
import { useAuth } from '@/components/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

// Mock course data and timetable
const COURSES = [
  { id: '1', code: 'CS101', name: 'Introduction to Computer Science', faculty: 'Prof. Smith' },
  { id: '2', code: 'PHYS201', name: 'Classical Physics', faculty: 'Dr. Johnson' },
  { id: '3', code: 'MATH150', name: 'Calculus I', faculty: 'Prof. Williams' },
  { id: '4', code: 'BIO110', name: 'Introduction to Biology', faculty: 'Dr. Brown' },
];

const TIMETABLE = [
  { day: 'Monday', time: '9:00 AM - 10:30 AM', course: 'CS101', room: 'A101' },
  { day: 'Monday', time: '11:00 AM - 12:30 PM', course: 'PHYS201', room: 'B202' },
  { day: 'Tuesday', time: '9:00 AM - 10:30 AM', course: 'MATH150', room: 'C303' },
  { day: 'Tuesday', time: '11:00 AM - 12:30 PM', course: 'BIO110', room: 'D404' },
  { day: 'Wednesday', time: '9:00 AM - 10:30 AM', course: 'CS101', room: 'A101' },
  { day: 'Thursday', time: '11:00 AM - 12:30 PM', course: 'MATH150', room: 'C303' },
  { day: 'Friday', time: '9:00 AM - 10:30 AM', course: 'PHYS201', room: 'B202' },
  { day: 'Friday', time: '11:00 AM - 12:30 PM', course: 'BIO110', room: 'D404' },
];

const Courses = () => {
  const { user } = useAuth();
  
  const createNewCourse = () => {
    toast({
      title: "Feature Not Implemented",
      description: "This feature would allow admins to create new courses.",
    });
  };
  
  const editTimetable = () => {
    toast({
      title: "Feature Not Implemented",
      description: "This feature would allow admins to edit the timetable.",
    });
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Courses & Timetable</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Course List</CardTitle>
            <CardDescription>
              {user?.role === 'admin' 
                ? 'Manage all courses and assign faculty' 
                : 'View available courses'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Faculty</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {COURSES.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>{course.code}</TableCell>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>{course.faculty}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {user?.role === 'admin' && (
              <Button onClick={createNewCourse} className="mt-4">
                Add New Course
              </Button>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Timetable</CardTitle>
            <CardDescription>Weekly class schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Room</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TIMETABLE.map((slot, index) => (
                  <TableRow key={index}>
                    <TableCell>{slot.day}</TableCell>
                    <TableCell>{slot.time}</TableCell>
                    <TableCell>{slot.course}</TableCell>
                    <TableCell>{slot.room}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {user?.role === 'admin' && (
              <Button onClick={editTimetable} className="mt-4">
                Edit Timetable
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Courses;
