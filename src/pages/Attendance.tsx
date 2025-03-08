
import React, { useState } from 'react';
import { useAuth } from '@/components/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';

// Mock student attendance data
const STUDENTS = [
  { id: '1', name: 'John Doe', present: true, date: '2023-05-01' },
  { id: '2', name: 'Jane Smith', present: false, date: '2023-05-01' },
  { id: '3', name: 'Mike Johnson', present: true, date: '2023-05-01' },
  { id: '4', name: 'Anna Williams', present: true, date: '2023-05-01' },
];

const Attendance = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState(STUDENTS);
  
  // For student view, show their own attendance history
  const ATTENDANCE_HISTORY = [
    { date: '2023-05-01', status: 'Present' },
    { date: '2023-04-30', status: 'Present' },
    { date: '2023-04-29', status: 'Absent' },
    { date: '2023-04-28', status: 'Present' },
    { date: '2023-04-27', status: 'Present' },
  ];

  const handleAttendanceChange = (studentId: string, isPresent: boolean) => {
    if (user?.role !== 'student') {
      setAttendance(prev => 
        prev.map(student => 
          student.id === studentId ? { ...student, present: isPresent } : student
        )
      );
    }
  };

  const saveAttendance = () => {
    toast({
      title: "Attendance Saved",
      description: "The attendance has been successfully recorded.",
    });
  };

  // Student view shows their own attendance history
  if (user?.role === 'student') {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">My Attendance</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Attendance History</CardTitle>
            <CardDescription>Your attendance record for this semester</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ATTENDANCE_HISTORY.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>
                      <span className={record.status === 'Present' ? 'text-green-600' : 'text-red-600'}>
                        {record.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin and Faculty view shows attendance marking interface
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Attendance Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Mark Attendance</CardTitle>
          <CardDescription>
            {user?.role === 'admin' 
              ? 'View and manage all student attendance' 
              : 'Mark attendance for your students'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Attendance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.date}</TableCell>
                  <TableCell>
                    <Checkbox 
                      checked={student.present}
                      onCheckedChange={(checked) => handleAttendanceChange(student.id, checked as boolean)}
                      disabled={user?.role === 'admin'} // Admin can view but not edit
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {user?.role === 'faculty' && (
            <Button onClick={saveAttendance} className="mt-4">
              Save Attendance
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Attendance;
