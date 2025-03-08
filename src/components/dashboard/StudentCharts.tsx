
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const STUDENT_PERFORMANCE_DATA = [
  { name: 'CS101', grade: 92 },
  { name: 'PHYS201', grade: 78 },
  { name: 'MATH150', grade: 88 },
  { name: 'BIO110', grade: 85 },
];

const StudentCharts: React.FC = () => {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Academic Progress</CardTitle>
          <CardDescription>Course performance this semester</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={STUDENT_PERFORMANCE_DATA}
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
  );
};

export default StudentCharts;
