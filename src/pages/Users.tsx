
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, UserPlus, UserMinus, UserCog, Search, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserRole } from '@/components/AuthContext';

// Mock data
const MOCK_FACULTY = [
  { id: '101', name: 'John Smith', email: 'john.smith@example.com', department: 'Mathematics', role: 'faculty' },
  { id: '102', name: 'Emma Johnson', email: 'emma.johnson@example.com', department: 'Science', role: 'faculty' },
  { id: '103', name: 'Michael Brown', email: 'michael.brown@example.com', department: 'English', role: 'faculty' },
];

const MOCK_STUDENTS = [
  { id: '201', name: 'Sarah Wilson', email: 'sarah.wilson@example.com', class: '10A', role: 'student' },
  { id: '202', name: 'James Taylor', email: 'james.taylor@example.com', class: '11B', role: 'student' },
  { id: '203', name: 'Emily Davis', email: 'emily.davis@example.com', class: '12C', role: 'student' },
  { id: '204', name: 'Daniel Martinez', email: 'daniel.martinez@example.com', class: '10A', role: 'student' },
  { id: '205', name: 'Olivia Anderson', email: 'olivia.anderson@example.com', class: '11B', role: 'student' },
];

interface UserCardProps {
  user: any;
  onEdit: (user: any) => void;
  onDelete: (id: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete }) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={`https://avatar.vercel.sh/${user.id}`} />
              <AvatarFallback><User size={24} /></AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                  {user.role === 'faculty' ? user.department : `Class ${user.class}`}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onEdit(user)}
              className="h-8 w-8"
            >
              <UserCog size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onDelete(user.id)}
              className="h-8 w-8 text-destructive"
            >
              <UserMinus size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Users = () => {
  const [faculty, setFaculty] = useState(MOCK_FACULTY);
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'student' as UserRole,
    class: '10A',
    department: 'Mathematics'
  });

  // Filter users based on search query
  const filteredFaculty = faculty.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStudents = students.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.class.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = () => {
    const id = Math.floor(Math.random() * 1000).toString();
    const newUserData = { ...newUser, id };
    
    if (newUser.role === 'faculty') {
      setFaculty([...faculty, { ...newUserData, role: 'faculty' }]);
    } else {
      setStudents([...students, { ...newUserData, role: 'student' }]);
    }
    
    toast({
      title: "User added",
      description: `${newUser.name} has been added successfully.`
    });
    
    setNewUser({
      name: '',
      email: '',
      role: 'student',
      class: '10A',
      department: 'Mathematics'
    });
    
    setIsAddDialogOpen(false);
  };

  const handleEditUser = () => {
    if (currentUser.role === 'faculty') {
      setFaculty(faculty.map(user => 
        user.id === currentUser.id ? currentUser : user
      ));
    } else {
      setStudents(students.map(user => 
        user.id === currentUser.id ? currentUser : user
      ));
    }
    
    toast({
      title: "User updated",
      description: `${currentUser.name}'s information has been updated.`
    });
    
    setIsEditDialogOpen(false);
  };

  const handleDeleteUser = (id: string, role: UserRole) => {
    if (role === 'faculty') {
      setFaculty(faculty.filter(user => user.id !== id));
    } else {
      setStudents(students.filter(user => user.id !== id));
    }
    
    toast({
      title: "User removed",
      description: "The user has been removed successfully."
    });
  };

  const openEditDialog = (user: any) => {
    setCurrentUser(user);
    setIsEditDialogOpen(true);
  };

  return (
    <DashboardLayout requiredRoles={['admin']}>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">Add, edit, or remove faculty and student accounts</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="btn-hover">
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            className="pl-10 max-w-md"
            placeholder="Search users..."
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

        {/* User tabs */}
        <Tabs defaultValue="faculty" className="space-y-4">
          <TabsList>
            <TabsTrigger value="faculty">Faculty</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
          </TabsList>

          {/* Faculty tab content */}
          <TabsContent value="faculty" className="space-y-4">
            {filteredFaculty.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredFaculty.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onEdit={openEditDialog}
                    onDelete={(id) => handleDeleteUser(id, 'faculty')}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No faculty members found</p>
              </div>
            )}
          </TabsContent>

          {/* Students tab content */}
          <TabsContent value="students" className="space-y-4">
            {filteredStudents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStudents.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onEdit={openEditDialog}
                    onDelete={(id) => handleDeleteUser(id, 'student')}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No students found</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Add User Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Add a new faculty member or student to the system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="john.doe@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) => setNewUser({ ...newUser, role: value as UserRole })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="faculty">Faculty</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newUser.role === 'faculty' ? (
                <div className="grid gap-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={newUser.department}
                    onValueChange={(value) => setNewUser({ ...newUser, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="History">History</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="grid gap-2">
                  <Label htmlFor="class">Class</Label>
                  <Select
                    value={newUser.class}
                    onValueChange={(value) => setNewUser({ ...newUser, class: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10A">10A</SelectItem>
                      <SelectItem value="10B">10B</SelectItem>
                      <SelectItem value="11A">11A</SelectItem>
                      <SelectItem value="11B">11B</SelectItem>
                      <SelectItem value="12A">12A</SelectItem>
                      <SelectItem value="12B">12B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser}>Add User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user information.
              </DialogDescription>
            </DialogHeader>
            {currentUser && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    value={currentUser.name}
                    onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={currentUser.email}
                    onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                  />
                </div>
                {currentUser.role === 'faculty' ? (
                  <div className="grid gap-2">
                    <Label htmlFor="edit-department">Department</Label>
                    <Select
                      value={currentUser.department}
                      onValueChange={(value) => setCurrentUser({ ...currentUser, department: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="Science">Science</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="History">History</SelectItem>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    <Label htmlFor="edit-class">Class</Label>
                    <Select
                      value={currentUser.class}
                      onValueChange={(value) => setCurrentUser({ ...currentUser, class: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10A">10A</SelectItem>
                        <SelectItem value="10B">10B</SelectItem>
                        <SelectItem value="11A">11A</SelectItem>
                        <SelectItem value="11B">11B</SelectItem>
                        <SelectItem value="12A">12A</SelectItem>
                        <SelectItem value="12B">12B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditUser}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Users;
