
import { cn } from "@/lib/utils";
import { 
  Book, 
  BookOpen, 
  CalendarDays, 
  FileText, 
  Home, 
  Library, 
  School, 
  Settings, 
  User, 
  Users 
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./ui/button";

interface SidebarProps {
  userType: "student" | "teacher" | "admin";
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export const Sidebar = ({ userType }: SidebarProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);
  
  useEffect(() => {
    setIsOpen(!isMobile);
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  let navItems: NavItem[] = [];

  switch (userType) {
    case "student":
      navItems = [
        { title: "Dashboard", href: "/student", icon: <Home size={18} /> },
        { title: "Courses", href: "/student/courses", icon: <Book size={18} /> },
        { title: "Timetable", href: "/student/timetable", icon: <CalendarDays size={18} /> },
        { title: "Results", href: "/student/results", icon: <FileText size={18} /> },
        { title: "Library", href: "/student/library", icon: <Library size={18} /> },
        { title: "Fee Payment", href: "/student/fees", icon: <FileText size={18} /> },
        { title: "Profile", href: "/student/profile", icon: <User size={18} /> },
      ];
      break;
    case "teacher":
      navItems = [
        { title: "Dashboard", href: "/teacher", icon: <Home size={18} /> },
        { title: "Courses", href: "/teacher/courses", icon: <Book size={18} /> },
        { title: "Students", href: "/teacher/students", icon: <Users size={18} /> },
        { title: "Attendance", href: "/teacher/attendance", icon: <CalendarDays size={18} /> },
        { title: "Results", href: "/teacher/results", icon: <FileText size={18} /> },
        { title: "Library", href: "/teacher/library", icon: <Library size={18} /> },
        { title: "Profile", href: "/teacher/profile", icon: <User size={18} /> },
      ];
      break;
    case "admin":
      navItems = [
        { title: "Dashboard", href: "/admin", icon: <Home size={18} /> },
        { title: "Students", href: "/admin/students", icon: <Users size={18} /> },
        { title: "Teachers", href: "/admin/teachers", icon: <School size={18} /> },
        { title: "Courses", href: "/admin/courses", icon: <Book size={18} /> },
        { title: "Library", href: "/admin/library", icon: <BookOpen size={18} /> },
        { title: "Fees", href: "/admin/fees", icon: <FileText size={18} /> },
        { title: "Settings", href: "/admin/settings", icon: <Settings size={18} /> },
      ];
      break;
  }

  const sidebarClasses = cn(
    "fixed h-full bg-sidebar border-r transition-all z-20",
    isOpen ? "w-64" : "w-0 md:w-16"
  );

  const sidebarContentClasses = cn(
    "flex flex-col h-full",
    !isOpen && "items-center"
  );

  return (
    <>
      <div className={sidebarClasses}>
        <div className={sidebarContentClasses}>
          <div className="h-16 flex items-center justify-between px-4 border-b">
            {isOpen && (
              <Link to={`/${userType}`} className="flex items-center gap-2">
                <div className="bg-primary rounded-md w-8 h-8 flex items-center justify-center text-primary-foreground font-bold">
                  A
                </div>
                <span className="font-bold text-lg">Academia</span>
              </Link>
            )}
            {!isOpen && (
              <div className="w-full flex justify-center">
                <Link to={`/${userType}`} className="flex items-center">
                  <div className="bg-primary rounded-md w-8 h-8 flex items-center justify-center text-primary-foreground font-bold">
                    A
                  </div>
                </Link>
              </div>
            )}
            {isMobile && (
              <Button variant="ghost" size="sm" onClick={toggleSidebar}>
                {isOpen ? "<" : ">"}
              </Button>
            )}
          </div>
          <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "nav-link",
                  location.pathname === item.href && "active",
                  !isOpen && "justify-center px-2"
                )}
              >
                {item.icon}
                {isOpen && <span>{item.title}</span>}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <div className={cn("hidden md:block", isOpen ? "ml-64" : "ml-16", "transition-all")} />
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black/30 z-10" onClick={toggleSidebar} />
      )}
    </>
  );
};
