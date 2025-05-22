import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, logout, restoreAuth } from '../redux/slices/authSlice';

/**
 * AuthProvider component to manage authentication state across the app.
 * It restores authentication from localStorage on app startup.
 */
const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, token } = useSelector(state => state.auth);

  useEffect(() => {
    // Restore authentication from localStorage if not already authenticated
    if (!isAuthenticated) {
      dispatch(restoreAuth());
    }
    
    // Verify token validity
    const verifyToken = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        
        if (!storedToken) {
          return;
        }
        
        // Check token validity with backend
        const response = await fetch('http://localhost:5000/api/auth/verify-token', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${storedToken}`
          }
        });
        
        if (!response.ok) {
          console.warn('Token validation failed, logging out');
          dispatch(logout());
          return;
        }
        
        const data = await response.json();
        
        // If token is valid but user data is not in Redux, restore it
        if (data.valid && data.user && !user) {
          dispatch(loginSuccess({
            user: data.user,
            token: storedToken
          }));
        }
      } catch (error) {
        console.error('Error verifying token:', error);
      }
    };
    
    verifyToken();
    
    // Set up interval to refresh token and verify validity periodically
    const refreshInterval = setInterval(() => {
      const refreshToken = async () => {
        try {
          const currentToken = localStorage.getItem('token');
          if (!currentToken) {
            clearInterval(refreshInterval);
            return;
          }
          
          const response = await fetch('http://localhost:5000/api/auth/refresh-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${currentToken}`
            }
          });
          
          if (!response.ok) {
            dispatch(logout());
            clearInterval(refreshInterval);
            return;
          }
          
          const data = await response.json();
          if (data.token) {
            // Update token in localStorage and Redux
            localStorage.setItem('token', data.token);
            
            // Get current user from localStorage
            const storedUser = JSON.parse(localStorage.getItem('user'));
            
            if (storedUser) {
              dispatch(loginSuccess({
                user: storedUser,
                token: data.token
              }));
            }
          }
        } catch (error) {
          console.error('Error refreshing token:', error);
        }
      };
      
      refreshToken();
    }, 15 * 60 * 1000); // Refresh every 15 minutes
    
    return () => {
      clearInterval(refreshInterval);
    };
  }, [dispatch, isAuthenticated, user]);
  
  return children;
};

export default AuthProvider; 