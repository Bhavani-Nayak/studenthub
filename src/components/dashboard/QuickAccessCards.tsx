
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Users, GraduationCap, ClipboardCheck, BookOpen } from 'lucide-react';

const QuickAccessCards: React.FC = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <Link to="/students">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-32">
            <Users className="h-8 w-8 mb-2 text-blue-500" />
            <h3 className="font-medium">Student Records</h3>
          </CardContent>
        </Card>
      </Link>
      <Link to="/attendance">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-32">
            <ClipboardCheck className="h-8 w-8 mb-2 text-green-500" />
            <h3 className="font-medium">Attendance</h3>
          </CardContent>
        </Card>
      </Link>
      <Link to="/performance">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-32">
            <GraduationCap className="h-8 w-8 mb-2 text-amber-500" />
            <h3 className="font-medium">Performance</h3>
          </CardContent>
        </Card>
      </Link>
      <Link to="/courses">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-32">
            <BookOpen className="h-8 w-8 mb-2 text-purple-500" />
            <h3 className="font-medium">Courses & Timetable</h3>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};

export default QuickAccessCards;
