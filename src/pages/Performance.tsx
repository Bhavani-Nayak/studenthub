
import React, { useState } from 'react';
import { useAuth } from '@/components/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock performance data
const PERFORMANCE_DATA = [
  { id: '1', name: 'John Doe', course: 'Computer Science', midterm: 85, final: 90, project: 88, total: 87.5 },
  { id: '2', name: 'Jane Smith', course: 'Physics', midterm: 78, final: 82, project: 90, total: 83.0 },
  { id: '3', name: 'Mike Johnson', course: 'Mathematics', midterm: 92, final: 95, project: 94, total: 93.7 },
  { id: '4', name: 'Anna Williams', course: 'Biology', midterm: 75, final: 80, project: 85, total: 80.0 },
];

// Chart data
const CHART_DATA = [
  { name: 'John', midterm: 85, final: 90, project: 88 },
  { name: 'Jane', midterm: 78, final: 82, project: 90 },
  { name: 'Mike', midterm: 92, final: 95, project: 94 },
  { name: 'Anna', midterm: 75, final: 80, project: 85 },
];

const Performance = () => {
  const { user } = useAuth();
  const [grades, setGrades] = useState(PERFORMANCE_DATA);
  
  // For student view, we filter to only show their own grades
  const studentData = user?.role === 'student' 
    ? PERFORMANCE_DATA.slice(0, 1) // Just showing one student for demo
    : PERFORMANCE_DATA;
    
  const chartData = user?.role === 'student'
    ? [CHART_DATA[0]] // Just the first student for demo
    : CHART_DATA;

  const handleGradeChange = (studentId: string, field: 'midterm' | 'final' | 'project', value: number) => {
    if (user?.role === 'faculty') {
      setGrades(prev => 
        prev.map(student => {
          if (student.id === studentId) {
            const updated = { ...student, [field]: value };
            // Recalculate total
            updated.total = (updated.midterm + updated.final + updated.project) / 3;
            return updated;
          }
          return student;
        })
      );
    }
  };

  const saveGrades = () => {
    toast({
      title: "Grades Saved",
      description: "The updated grades have been successfully saved.",
    });
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Performance Management</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Grade Overview</CardTitle>
            <CardDescription>
              {user?.role === 'student' 
                ? 'Your current grades' 
                : user?.role === 'faculty'
                  ? 'Manage student grades' 
                  : 'View all student grades'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Midterm</TableHead>
                  <TableHead>Final</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentData.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.course}</TableCell>
                    <TableCell>
                      {user?.role === 'faculty' ? (
                        <Input 
                          type="number" 
                          value={student.midterm} 
                          min={0}
                          max={100}
                          onChange={(e) => handleGradeChange(student.id, 'midterm', parseInt(e.target.value))}
                          className="w-16"
                        />
                      ) : (
                        student.midterm
                      )}
                    </TableCell>
                    <TableCell>
                      {user?.role === 'faculty' ? (
                        <Input 
                          type="number" 
                          value={student.final} 
                          min={0}
                          max={100}
                          onChange={(e) => handleGradeChange(student.id, 'final', parseInt(e.target.value))}
                          className="w-16"
                        />
                      ) : (
                        student.final
                      )}
                    </TableCell>
                    <TableCell>
                      {user?.role === 'faculty' ? (
                        <Input 
                          type="number" 
                          value={student.project} 
                          min={0}
                          max={100}
                          onChange={(e) => handleGradeChange(student.id, 'project', parseInt(e.target.value))}
                          className="w-16"
                        />
                      ) : (
                        student.project
                      )}
                    </TableCell>
                    <TableCell className="font-bold">{student.total.toFixed(1)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {user?.role === 'faculty' && (
              <Button onClick={saveGrades} className="mt-4">
                Save Grades
              </Button>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Performance Visualization</CardTitle>
            <CardDescription>Graphical representation of grades</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="midterm" fill="#8884d8" name="Midterm" />
                <Bar dataKey="final" fill="#82ca9d" name="Final" />
                <Bar dataKey="project" fill="#ffc658" name="Project" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Performance;
