import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from './AuthContext';
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
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, href, active, onClick }) => {
  return (
    <Link
      to={href}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out group',
        active 
          ? 'bg-primary text-primary-foreground' 
          : 'hover:bg-secondary text-foreground'
      )}
      onClick={onClick}
    >
      <Icon size={20} className={cn(active ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground')} />
      <span className="font-medium">{label}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => isMobile && setIsOpen(false);

  const getMenuItems = (role: UserRole) => {
    const items = [
      { icon: Home, label: 'Dashboard', href: '/dashboard', roles: ['admin', 'faculty', 'student'] },
    ];

    if (role === 'admin') {
      items.push({ icon: Users, label: 'User Management', href: '/users', roles: ['admin'] });
    }

    items.push({ icon: GraduationCap, label: 'Students', href: '/students', roles: ['admin', 'faculty', 'student'] });
    
    items.push({ icon: ClipboardCheck, label: 'Attendance', href: '/attendance', roles: ['admin', 'faculty', 'student'] });
    
    items.push({ icon: BarChart3, label: 'Performance', href: '/performance', roles: ['admin', 'faculty', 'student'] });
    
    items.push({ icon: BookOpen, label: 'Courses', href: '/courses', roles: ['admin', 'faculty', 'student'] });

    return items.filter(item => item.roles.includes(role));
  };

  const items = getMenuItems(user.role);

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
                src="/lovable-uploads/74823540-2e67-496a-8656-b0ab67bfbdf7.png" 
                alt="StudentHub" 
                className="h-40 object-contain"
              />
            </div>
            <p className="text-sm text-muted-foreground text-center animate-fade-in">Student Record System</p>
          </div>

          <div className="p-4 border-b flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={`https://avatar.vercel.sh/${user.id}`} />
              <AvatarFallback><User size={20} /></AvatarFallback>
            </Avatar>
            <div className="space-y-0.5">
              <p className="text-sm font-medium line-clamp-1">{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-3 space-y-2">
            {items.map((item) => (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                active={location.pathname === item.href}
                onClick={closeSidebar}
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
