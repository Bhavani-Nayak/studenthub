
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Download, Eye, FileText, Mail, Phone, MapPin, Calendar, GraduationCap, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/AuthContext';

// Mock student data with additional details
const MOCK_STUDENTS = [
  { 
    id: '201', 
    name: 'Sarah Wilson', 
    email: 'sarah.wilson@example.com', 
    class: '10A',
    gender: 'Female',
    dob: '2005-05-15',
    phone: '555-123-4567',
    address: '123 Main St, Anytown, USA',
    parent: 'Robert Wilson',
    parentContact: '555-987-6543',
    enrollmentDate: '2020-09-01',
    status: 'Active',
    bloodGroup: 'A+',
    emergencyContact: '555-111-2222'
  },
  { 
    id: '202', 
    name: 'James Taylor', 
    email: 'james.taylor@example.com', 
    class: '11B',
    gender: 'Male',
    dob: '2004-07-22',
    phone: '555-234-5678',
    address: '456 Oak St, Somewhere, USA',
    parent: 'Jennifer Taylor',
    parentContact: '555-876-5432',
    enrollmentDate: '2019-09-01',
    status: 'Active',
    bloodGroup: 'O+',
    emergencyContact: '555-222-3333'
  },
  { 
    id: '203', 
    name: 'Emily Davis', 
    email: 'emily.davis@example.com', 
    class: '12C',
    gender: 'Female',
    dob: '2003-03-10',
    phone: '555-345-6789',
    address: '789 Pine St, Elsewhere, USA',
    parent: 'Michael Davis',
    parentContact: '555-765-4321',
    enrollmentDate: '2018-09-01',
    status: 'Active',
    bloodGroup: 'B-',
    emergencyContact: '555-333-4444'
  },
  { 
    id: '204', 
    name: 'Daniel Martinez', 
    email: 'daniel.martinez@example.com', 
    class: '10A',
    gender: 'Male',
    dob: '2005-11-30',
    phone: '555-456-7890',
    address: '101 Maple St, Nowhere, USA',
    parent: 'Sofia Martinez',
    parentContact: '555-654-3210',
    enrollmentDate: '2020-09-01',
    status: 'Active',
    bloodGroup: 'AB+',
    emergencyContact: '555-444-5555'
  },
  { 
    id: '205', 
    name: 'Olivia Anderson', 
    email: 'olivia.anderson@example.com', 
    class: '11B',
    gender: 'Female',
    dob: '2004-09-05',
    phone: '555-567-8901',
    address: '202 Cedar St, Anywhere, USA',
    parent: 'William Anderson',
    parentContact: '555-543-2109',
    enrollmentDate: '2019-09-01',
    status: 'Active',
    bloodGroup: 'O-',
    emergencyContact: '555-555-6666'
  },
];

const Students = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Filter students based on search query and selected class
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    
    return matchesSearch && matchesClass;
  });

  // If faculty, only show their assigned class (10A for demo)
  const isAdmin = user?.role === 'admin';
  const isFaculty = user?.role === 'faculty';
  const isStudent = user?.role === 'student';
  
  // For faculty we'll pretend they're assigned to 10A
  const facultyAssignedClass = '10A';
  
  // For student we'll only show their own record
  const studentViewableData = isStudent 
    ? students.filter(s => s.id === user?.id || s.id === '201') // For demo, let's say the student has ID 201
    : filteredStudents;
  
  // Final filtered list based on role
  const displayStudents = isFaculty 
    ? filteredStudents.filter(s => s.class === facultyAssignedClass)
    : studentViewableData;

  const viewStudentDetails = (student: any) => {
    setSelectedStudent(student);
    setIsViewDialogOpen(true);
  };

  // Get unique class values for filter
  const classes = ['all', ...new Set(students.map(s => s.class))];
  
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Student Records</h1>
            <p className="text-muted-foreground">
              {isAdmin && "View and manage all student records"}
              {isFaculty && "View and manage your assigned students"}
              {isStudent && "View your student profile"}
            </p>
          </div>
          {(isAdmin || isFaculty) && (
            <Button variant="outline" className="btn-hover">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          )}
        </div>

        {/* Search and Filter */}
        {!isStudent && (
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                className="pl-10"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="w-full sm:w-60">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      {cls === 'all' ? 'All Classes' : `Class ${cls}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Student Records Table */}
        {(!isStudent || displayStudents.length > 0) && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Student List</CardTitle>
              <CardDescription>
                {displayStudents.length} {displayStudents.length === 1 ? 'student' : 'students'} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead className="hidden md:table-cell">Class</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://avatar.vercel.sh/${student.id}`} />
                            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{student.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{student.email}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline">{student.class}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => viewStudentDetails(student)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {/* Additional actions for admin/faculty */}
                        {!isStudent && (
                          <Button 
                            variant="ghost" 
                            size="icon"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Student Profile View (for student role) */}
        {isStudent && displayStudents.length === 1 && (
          <Card className="overflow-hidden animate-slide-in">
            <CardContent className="p-0">
              <div className="bg-primary/5 p-6 flex flex-col md:flex-row gap-6 items-center md:items-start">
                <Avatar className="h-24 w-24 border-4 border-background">
                  <AvatarImage src={`https://avatar.vercel.sh/${displayStudents[0].id}`} />
                  <AvatarFallback className="text-xl">{displayStudents[0].name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left space-y-1">
                  <h2 className="text-2xl font-bold">{displayStudents[0].name}</h2>
                  <p className="text-muted-foreground">Student ID: {displayStudents[0].id}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                    <Badge variant="outline" className="bg-primary/10">Class {displayStudents[0].class}</Badge>
                    <Badge variant="outline">{displayStudents[0].status}</Badge>
                  </div>
                </div>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Personal Information</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{displayStudents[0].email}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{displayStudents[0].phone}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Date of Birth: {new Date(displayStudents[0].dob).toLocaleDateString()}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{displayStudents[0].address}</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Academic Information</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span>Enrollment: {new Date(displayStudents[0].enrollmentDate).toLocaleDateString()}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p>Parent/Guardian: {displayStudents[0].parent}</p>
                        <p className="text-sm text-muted-foreground">{displayStudents[0].parentContact}</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>Emergency: {displayStudents[0].emergencyContact}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-red-50 text-red-500">
                        Blood Group: {displayStudents[0].bloodGroup}
                      </Badge>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Student Details Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Student Details</DialogTitle>
              <DialogDescription>
                Comprehensive student information
              </DialogDescription>
            </DialogHeader>
            {selectedStudent && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={`https://avatar.vercel.sh/${selectedStudent.id}`} />
                      <AvatarFallback>{selectedStudent.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-lg">{selectedStudent.name}</h3>
                      <p className="text-muted-foreground">ID: {selectedStudent.id}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">Personal Details</h4>
                    <div className="space-y-1">
                      <p className="text-sm flex items-center gap-2">
                        <Mail className="h-4 w-4" /> {selectedStudent.email}
                      </p>
                      <p className="text-sm flex items-center gap-2">
                        <Phone className="h-4 w-4" /> {selectedStudent.phone}
                      </p>
                      <p className="text-sm flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> {selectedStudent.address}
                      </p>
                      <p className="text-sm flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> DOB: {new Date(selectedStudent.dob).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">Academic Details</h4>
                    <div className="space-y-1">
                      <p className="text-sm flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" /> Class: {selectedStudent.class}
                      </p>
                      <p className="text-sm flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> Enrolled: {new Date(selectedStudent.enrollmentDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm flex items-center gap-2">
                        <Badge variant="outline">{selectedStudent.status}</Badge>
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">Guardian Information</h4>
                    <div className="space-y-1">
                      <p className="text-sm">{selectedStudent.parent}</p>
                      <p className="text-sm flex items-center gap-2">
                        <Phone className="h-4 w-4" /> {selectedStudent.parentContact}
                      </p>
                      <p className="text-sm flex items-center gap-2">
                        <Phone className="h-4 w-4" /> Emergency: {selectedStudent.emergencyContact}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">Additional Information</h4>
                    <div className="space-y-1">
                      <p className="text-sm flex items-center gap-2">
                        Gender: {selectedStudent.gender}
                      </p>
                      <p className="text-sm flex items-center gap-2">
                        Blood Group: {selectedStudent.bloodGroup}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              {(isAdmin || isFaculty) && (
                <Button variant="outline" className="mr-auto">
                  <FileText className="mr-2 h-4 w-4" />
                  View Full Record
                </Button>
              )}
              <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Students;
