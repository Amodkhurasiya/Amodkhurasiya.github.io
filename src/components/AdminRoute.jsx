import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/slices/authSlice';

const AdminRoute = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      // First check if user is already in Redux state
      if (isAuthenticated && user?.role === 'admin') {
        setHasAccess(true);
        setIsChecking(false);
        return;
      }

      // If not authenticated in Redux, try to restore from localStorage
      try {
        const token = localStorage.getItem('token');
        const storedUser = JSON.parse(localStorage.getItem('user') || 'null');

        if (token && storedUser && storedUser.role === 'admin') {
          // Restore user to Redux state
          dispatch(loginSuccess(storedUser));
          setHasAccess(true);
        } else {
          setHasAccess(false);
        }
      } catch (error) {
        console.error('Error restoring authentication:', error);
        setHasAccess(false);
      }

      setIsChecking(false);
    };

    checkAuthentication();
  }, [isAuthenticated, user, dispatch]);

  // Show loading while checking authentication
  if (isChecking) {
    return <div>Checking admin authorization...</div>;
  }

  // Redirect to login if not authenticated
  if (!hasAccess) {
    return <Navigate to="/admin/login" />;
  }

  // Render the protected admin content
  return <Outlet />;
};

export default AdminRoute; 