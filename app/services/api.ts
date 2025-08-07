import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your actual IP address and port
const BASE_URL = 'http://YOUR_LOCAL_IP:8000/api';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  success: boolean;
}

class ApiService {
  private async getAuthHeaders() {
    const token = await AsyncStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  private async handleResponse(response: Response): Promise<ApiResponse> {
    try {
      const data = await response.json();
      
      if (response.ok) {
        return { data, success: true };
      } else {
        return { 
          error: data.message || data.detail || 'Something went wrong',
          success: false 
        };
      }
    } catch (error) {
      return { 
        error: 'Network error or invalid response',
        success: false 
      };
    }
  }

  async signup(userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }): Promise<ApiResponse> {
    try {
      const response = await fetch(`${BASE_URL}/auth/signup/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      return await this.handleResponse(response);
    } catch (error) {
      return { 
        error: 'Network error. Please check your connection.',
        success: false 
      };
    }
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse> {
    try {
      const response = await fetch(`${BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const result = await this.handleResponse(response);
      
      if (result.success && result.data) {
        // Store tokens
        if (result.data.access) {
          await AsyncStorage.setItem('access_token', result.data.access);
        }
        if (result.data.refresh) {
          await AsyncStorage.setItem('refresh_token', result.data.refresh);
        }
        if (result.data.user) {
          await AsyncStorage.setItem('user_data', JSON.stringify(result.data.user));
        }
      }

      return result;
    } catch (error) {
      return { 
        error: 'Network error. Please check your connection.',
        success: false 
      };
    }
  }

  async logout(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user_data']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async refreshToken(): Promise<ApiResponse> {
    try {
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      
      if (!refreshToken) {
        return { error: 'No refresh token available', success: false };
      }

      const response = await fetch(`${BASE_URL}/auth/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      const result = await this.handleResponse(response);
      
      if (result.success && result.data?.access) {
        await AsyncStorage.setItem('access_token', result.data.access);
      }

      return result;
    } catch (error) {
      return { 
        error: 'Network error during token refresh',
        success: false 
      };
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('access_token');
      return !!token;
    } catch {
      return false;
    }
  }

  async getUserData(): Promise<any> {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  // Generic authenticated request method
  async authenticatedRequest(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any
  ): Promise<ApiResponse> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers,
        ...(body && { body: JSON.stringify(body) }),
      });

      // Handle token expiration
      if (response.status === 401) {
        const refreshResult = await this.refreshToken();
        if (refreshResult.success) {
          // Retry the request with new token
          const newHeaders = await this.getAuthHeaders();
          const retryResponse = await fetch(`${BASE_URL}${endpoint}`, {
            method,
            headers: newHeaders,
            ...(body && { body: JSON.stringify(body) }),
          });
          return await this.handleResponse(retryResponse);
        } else {
          // Refresh failed, user needs to login again
          await this.logout();
          return { error: 'Session expired. Please login again.', success: false };
        }
      }

      return await this.handleResponse(response);
    } catch (error) {
      return { 
        error: 'Network error. Please check your connection.',
        success: false 
      };
    }
  }
}

export default new ApiService();