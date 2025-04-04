
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { cn } from '@/lib/utils';
import {
  Users,
  GraduationCap,
  ClipboardCheck,
  BarChart3,
  BookOpen,
  Home,
  LogOut,
  Menu,
  X,
  User,
  Settings,
  Shield,
  Mail,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active: boolean;
  onClick?: () => void;
  badge?: number | string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon: Icon, 
  label, 
  href, 
  active, 
  onClick,
  badge 
}) => {
  return (
    <Link
      to={href}
      className={cn(
        'flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out group',
        active 
          ? 'bg-primary text-primary-foreground' 
          : 'hover:bg-secondary text-foreground'
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} className={cn(active ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground')} />
        <span className="font-medium">{label}</span>
      </div>
      {badge && (
        <Badge variant={active ? "outline" : "secondary"} className={cn(
          "h-5 min-w-5 px-1.5 flex items-center justify-center rounded-full text-xs",
          active ? "bg-primary-foreground/20 text-primary-foreground" : ""
        )}>
          {badge}
        </Badge>
      )}
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const { profile, logout, isAdmin, isFaculty, isStudent } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  if (!profile) return null;

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => isMobile && setIsOpen(false);

  // Role-based menu items
  const commonItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard', roles: ['admin', 'faculty', 'student'] },
  ];

  const adminItems = [
    { icon: Users, label: 'User Management', href: '/users', roles: ['admin'], badge: 3 },
    { icon: BookOpen, label: 'Courses', href: '/courses', roles: ['admin'] },
    { icon: ClipboardCheck, label: 'Attendance', href: '/attendance', roles: ['admin'] },
    { icon: BarChart3, label: 'Performance', href: '/performance', roles: ['admin'] },
    { icon: Settings, label: 'Settings', href: '/settings', roles: ['admin'] },
  ];

  const facultyItems = [
    { icon: GraduationCap, label: 'Students', href: '/students', roles: ['faculty'] },
    { icon: BookOpen, label: 'My Courses', href: '/courses', roles: ['faculty'], badge: 3 },
    { icon: ClipboardCheck, label: 'Attendance', href: '/attendance', roles: ['faculty'] },
    { icon: BarChart3, label: 'Grades', href: '/performance', roles: ['faculty'] },
  ];

  const studentItems = [
    { icon: BookOpen, label: 'My Courses', href: '/courses', roles: ['student'], badge: 4 },
    { icon: ClipboardCheck, label: 'Attendance', href: '/attendance', roles: ['student'] },
    { icon: BarChart3, label: 'My Grades', href: '/performance', roles: ['student'] },
    { icon: Mail, label: 'Messages', href: '/messages', roles: ['student'], badge: 2 },
  ];

  // Combine items based on user role
  let menuItems = [...commonItems];
  
  if (isAdmin) {
    menuItems = [...menuItems, ...adminItems];
  } else if (isFaculty) {
    menuItems = [...menuItems, ...facultyItems];
  } else if (isStudent) {
    menuItems = [...menuItems, ...studentItems];
  }

  // Filter items by role
  const filteredItems = menuItems.filter(item => item.roles.includes(profile.role));

  return (
    <>
      {isMobile && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="fixed top-4 right-4 z-50" 
          onClick={toggleSidebar}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      )}

      <div 
        className={cn(
          'fixed left-0 top-0 h-full bg-card border-r z-40 transition-all duration-300 ease-in-out shadow-lg',
          isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0',
          'w-64'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <div className="flex justify-center mb-2">
              <img 
                src="/lovable-uploads/34960ea5-f71c-4260-85c5-2a45a34637c1.png" 
                alt="StudentHub" 
                className="h-40 object-contain"
              />
            </div>
            <p className="text-sm text-muted-foreground text-center animate-fade-in">Student Record System</p>
          </div>

          <div className="p-4 border-b flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={`https://avatar.vercel.sh/${profile.id}`} />
              <AvatarFallback><User size={20} /></AvatarFallback>
            </Avatar>
            <div className="space-y-0.5">
              <p className="text-sm font-medium line-clamp-1">{profile.name}</p>
              <div className="flex items-center">
                <p className="text-xs text-muted-foreground capitalize">{profile.role}</p>
                {isAdmin && (
                  <Badge variant="outline" className="ml-2 h-5 px-1 text-xs bg-blue-50 text-blue-600 border-blue-200">
                    <Shield className="h-3 w-3 mr-0.5" /> Admin
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredItems.map((item) => (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                active={location.pathname === item.href}
                onClick={closeSidebar}
                badge={item.badge}
              />
            ))}
          </nav>

          <div className="p-4 border-t">
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2" 
              onClick={logout}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30" 
          onClick={closeSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
