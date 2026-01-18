import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const LoginForm: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!credentials.username || !credentials.password) {
      setError('Please enter both username and password');
      return;
    }

     try {
    console.log('Attempting login with:', credentials.username);
    await login(credentials);
    console.log('Login successful, checking auth state...');
    
    // Debug: Check if auth data was stored
    setTimeout(() => {
      const token = localStorage.getItem('admin_token');
      const user = localStorage.getItem('admin_user');
      console.log('After login - Token:', !!token, 'User:', !!user);
    }, 100);
    
  } catch (err: any) {
    console.error('Login error:', err);
    setError(err.message || 'Login failed. Please check your credentials.');
  }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-hocco-primary">CART</h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Admin Panel</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to manage your cart tracking system
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={credentials.username}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-hocco-primary hover:bg-hocco-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hocco-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Demo Credentials:</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Username:</strong> admin | <strong>Password:</strong> admin123</p>
              <p><strong>Username:</strong> manager | <strong>Password:</strong> manager123</p>
              <p><strong>Username:</strong> supervisor | <strong>Password:</strong> supervisor123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};