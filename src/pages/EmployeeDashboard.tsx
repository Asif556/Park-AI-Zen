import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogOut, User, Shield, Settings, Activity } from 'lucide-react';
import { logoutEmployee, getEmployeeToken } from '@/lib/auth';
import type { Employee } from '@/types/employee';

export default function EmployeeDashboard() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = getEmployeeToken();
    const employeeData = localStorage.getItem('employee_data');

    if (!token || !employeeData) {
      navigate('/employee/login');
      return;
    }

    try {
      setEmployee(JSON.parse(employeeData));
    } catch (err) {
      navigate('/employee/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    logoutEmployee();
    localStorage.removeItem('employee_data');
    localStorage.removeItem('user_type');
    navigate('/employee/login');
  };

  if (!employee) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'manager':
        return 'bg-purple-500';
      case 'attendant':
        return 'bg-blue-500';
      case 'security':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRolePermissions = (role: string) => {
    switch (role) {
      case 'manager':
        return ['View Reports', 'Manage Check-in/out', 'View Activity Logs'];
      case 'attendant':
        return ['Manage Check-in/out', 'View Parking Status'];
      case 'security':
        return ['View Parking Status', 'Monitor Activity'];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Employee Dashboard
              </h1>
              <p className="text-sm text-gray-500">Smart Parking System</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{employee.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Employee ID</p>
                <p className="font-mono text-sm">{employee.employee_id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-sm">{employee.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <Badge className={getRoleBadgeColor(employee.role)}>
                  {employee.role.toUpperCase()}
                </Badge>
              </div>
              {employee.department && (
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="text-sm">{employee.department}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Permissions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Access Permissions
              </CardTitle>
              <CardDescription>
                Based on your role: <strong>{employee.role}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {getRolePermissions(employee.role).map((permission, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    {permission}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(employee.role === 'attendant' || employee.role === 'manager') && (
                <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/user')}>
                  <Activity className="mr-2 h-4 w-4" />
                  Manage Parking
                </Button>
              )}
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/employee/change-password')}>
                <Settings className="mr-2 h-4 w-4" />
                Change Password
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Info Alert */}
        <Alert className="mt-6">
          <Activity className="h-4 w-4" />
          <AlertDescription>
            Welcome back, <strong>{employee.name}</strong>! You're logged in as a{' '}
            <strong>{employee.role}</strong>. 
            {employee.role === 'attendant' && ' You can manage vehicle check-in/out operations.'}
            {employee.role === 'security' && ' You can monitor parking activities.'}
            {employee.role === 'manager' && ' You have full access to reports and operations.'}
          </AlertDescription>
        </Alert>

        {/* Role-specific content */}
        {employee.role === 'manager' && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Manager Dashboard</CardTitle>
              <CardDescription>Additional manager-only features</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                As a manager, you can access analytics, view activity logs, and manage parking operations.
                Click "Manage Parking" above to access the full system.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
