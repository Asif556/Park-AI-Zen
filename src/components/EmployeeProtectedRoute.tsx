import { Navigate } from "react-router-dom";
import { getEmployeeToken } from "@/lib/auth";

interface EmployeeProtectedRouteProps {
  children: React.ReactNode;
}

export const EmployeeProtectedRoute = ({ children }: EmployeeProtectedRouteProps) => {
  const token = getEmployeeToken();

  if (!token) {
    return <Navigate to="/employee/login" replace />;
  }

  return <>{children}</>;
};
