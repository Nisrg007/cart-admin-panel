import type { LoginCredentials, AuthResponse, AdminUser } from '../types/auth';

// Simple in-memory admin users (this is separate from backend authentication)
const adminUsers = [
  { username: 'admin', password: 'admin123', email: 'admin@hocco.com' },
  { username: 'manager', password: 'manager123', email: 'manager@hocco.com' },
  { username: 'supervisor', password: 'supervisor123', email: 'supervisor@hocco.com' }
].map(user => ({
  ...user,
  id: Math.random().toString(36).substr(2, 9),
  role: 'admin' as const,
  createdAt: new Date().toISOString()
}));

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log('🔐 Attempting login with:', credentials.username);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = adminUsers.find(
      u => u.username === credentials.username && u.password === credentials.password
    );

    if (!user) {
      console.log('❌ Login failed: Invalid credentials');
      throw new Error('Invalid credentials');
    }

    // Create a simple session token (frontend only)
    // Your backend uses x-admin-token for API authentication
    const tokenPayload = {
      userId: user.id,
      username: user.username,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
    };

    const token = btoa(JSON.stringify(tokenPayload));

    const authResponse: AuthResponse = {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        lastLogin: new Date().toISOString(),
        createdAt: user.createdAt
      },
      token,
      expiresIn: 7 * 24 * 60 * 60
    };

    // Store frontend session
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_user', JSON.stringify(authResponse.user));

    console.log('✅ Login successful, checking auth state...');
    return authResponse;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    console.log('👋 User logged out');
  },

  getCurrentUser(): AdminUser | null {
    const userStr = localStorage.getItem('admin_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken(): string | null {
    return localStorage.getItem('admin_token');
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      console.log('❌ No token found');
      return false;
    }

    try {
      const payload = JSON.parse(atob(token));
      const isExpired = payload.exp <= Math.floor(Date.now() / 1000);
      
      if (isExpired) {
        console.log('❌ Token expired');
        this.logout(); // Clean up expired token
        return false;
      }
      
      console.log('✅ Token valid');
      return true;
    } catch (error) {
      console.log('❌ Token invalid:', error);
      this.logout(); // Clean up invalid token
      return false;
    }
  }
};