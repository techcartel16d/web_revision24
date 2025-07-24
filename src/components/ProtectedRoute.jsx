import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children }) => {
  const [authChecked, setAuthChecked] = useState(false);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const result = await isAuthenticated();
      setAuth(result);          // result: true/false
      setAuthChecked(true);     // ताकि wait किया जाए auth check होने तक
    };
    checkAuth();
  }, []);

  if (!authChecked) {
    return <div>Loading...</div>; // या spinner लगाओ
  }

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
