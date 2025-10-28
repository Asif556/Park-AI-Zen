import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface SendOTPResponse {
  success: boolean;
  message: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  token?: string;
}

/**
 * Send OTP to the provided email address
 */
export const sendOTP = async (email: string): Promise<SendOTPResponse> => {
  try {
    const response = await axios.post(`${API_URL}/send-otp`, { email });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to send OTP');
  }
};

/**
 * Verify the OTP code for the provided email
 */
export const verifyOTP = async (email: string, otp: string): Promise<VerifyOTPResponse> => {
  try {
    const response = await axios.post(`${API_URL}/verify-otp`, { email, otp });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to verify OTP');
  }
};

/**
 * Store JWT token in localStorage
 */
export const saveToken = (token: string): void => {
  localStorage.setItem('admin_token', token);
};

/**
 * Get JWT token from localStorage
 */
export const getToken = (): string | null => {
  return localStorage.getItem('admin_token');
};

/**
 * Remove JWT token from localStorage
 */
export const removeToken = (): void => {
  localStorage.removeItem('admin_token');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;

  try {
    // Decode JWT token to check expiration
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiration = payload.exp * 1000; // Convert to milliseconds
    
    if (Date.now() >= expiration) {
      removeToken();
      return false;
    }
    
    return true;
  } catch (error) {
    removeToken();
    return false;
  }
};

/**
 * Logout user by removing token
 */
export const logout = (): void => {
  removeToken();
};
