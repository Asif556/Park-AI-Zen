// Employee authentication types and API functions

export interface Employee {
  employee_id: string;
  name: string;
  email: string;
  role: 'attendant' | 'security' | 'manager';
  status: 'active' | 'inactive' | 'pending';
  department?: string;
  phone?: string;
  parking_area_id?: string;
  created_at?: string;
  last_login?: string;
}

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  role: string;
  phone?: string;
  department?: string;
}

export interface EmployeeRegisterRequest {
  employee_id: string;
  password: string;
}

export interface EmployeeLoginRequest {
  employee_id: string;
  password: string;
}

export interface EmployeeLoginResponse {
  success: boolean;
  message: string;
  token?: string;
  data?: Employee;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface ActivityLog {
  user_type: 'admin' | 'employee';
  user_id: string;
  action: string;
  details: any;
  timestamp: string;
  ip_address?: string;
}
