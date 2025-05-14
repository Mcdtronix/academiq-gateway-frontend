
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen, 
  FileText, 
  School, 
  Settings, 
  Users 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    courses: 0,
    pendingFees: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real app, you'd call these APIs and set the data
        // const studentsResponse = await adminApi.getAllStudents();
        // const teachersResponse = await adminApi.getAllTeachers();
        // etc...
        
        // For now, just simulate loading
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Simulate API fetch
    setTimeout(() => {
      setStats({
        students: 325,
        teachers: 42,
        courses: 36,
        pendingFees: 45,
      });
      setIsLoading(false);
    }, 1000);
    
    // Uncomment to use real API
    // fetchDashboardData();
  }, []);

  const dashboardCards = [
    {
      title: "Students",
      value: isLoading ? "..." : stats.students,
      icon: <Users className="h-6 w-6" />,
      color: "bg-blue-100 text-blue-700",
      link: "/admin/students",
    },
    {
      title: "Teachers",
      value: isLoading ? "..." : stats.teachers,
      icon: <School className="h-6 w-6" />,
      color: "bg-green-100 text-green-700",
      link: "/admin/teachers",
    },
    {
      title: "Courses",
      value: isLoading ? "..." : stats.courses,
      icon: <BookOpen className="h-6 w-6" />,
      color: "bg-purple-100 text-purple-700",
      link: "/admin/courses",
    },
    {
      title: "Pending Fees",
      value: isLoading ? "..." : stats.pendingFees,
      icon: <FileText className="h-6 w-6" />,
      color: "bg-amber-100 text-amber-700",
      link: "/admin/fees",
    },
    {
      title: "Settings",
      value: "Manage",
      icon: <Settings className="h-6 w-6" />,
      color: "bg-sky-100 text-sky-700",
      link: "/admin/settings",
    },
  ];

  return (
    <DashboardLayout userType="admin">
      <h1 className="page-title">Administration Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card, index) => (
          <Card key={index} className="dashboard-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                {card.title}
                <div className={`p-2 rounded-full ${card.color}`}>
                  {card.icon}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">{card.value}</div>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link to={card.link}>Manage</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="p-2 bg-accent rounded-md flex justify-between">
                <span>New student registration</span>
                <span className="text-sm text-muted-foreground">Today, 10:23 AM</span>
              </li>
              <li className="p-2 bg-accent rounded-md flex justify-between">
                <span>Fee payment received</span>
                <span className="text-sm text-muted-foreground">Today, 9:45 AM</span>
              </li>
              <li className="p-2 bg-accent rounded-md flex justify-between">
                <span>New course added</span>
                <span className="text-sm text-muted-foreground">Yesterday, 3:30 PM</span>
              </li>
              <li className="p-2 bg-accent rounded-md flex justify-between">
                <span>Teacher leave approved</span>
                <span className="text-sm text-muted-foreground">Yesterday, 11:15 AM</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>System Notices</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="p-2 bg-red-100 text-red-700 rounded-md">
                <div className="font-medium">Database backup required</div>
                <div className="text-sm">Scheduled backup failed last night</div>
              </li>
              <li className="p-2 bg-amber-100 text-amber-700 rounded-md">
                <div className="font-medium">System update available</div>
                <div className="text-sm">Version 2.3.4 ready to install</div>
              </li>
              <li className="p-2 bg-green-100 text-green-700 rounded-md">
                <div className="font-medium">All systems operational</div>
                <div className="text-sm">No critical issues detected</div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
