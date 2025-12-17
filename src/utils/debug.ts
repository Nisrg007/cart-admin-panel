export const debugAuth = {
  logAuthState: () => {
    const token = localStorage.getItem('admin_token');
    const user = localStorage.getItem('admin_user');
    
    console.log('🔐 Auth Debug:');
    console.log('Token exists:', !!token);
    console.log('User exists:', !!user);
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token));
        console.log('Token payload:', payload);
        console.log('Token expired:', payload.exp < Math.floor(Date.now() / 1000));
      } catch (e) {
        console.log('Invalid token format');
      }
    }
    
    if (user) {
      console.log('User data:', JSON.parse(user));
    }
  },
  
  clearAuth: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    console.log('Auth data cleared');
  }
};