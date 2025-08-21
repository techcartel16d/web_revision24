import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const ProtectedRoute = ({ children }) => {
  const [authChecked, setAuthChecked] = useState(false);
  const [auth, setAuth] = useState(false);
  const location = useLocation();
  // console.log(location)

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
    sessionStorage.setItem('redirect_after_login', location.pathname);
    sessionStorage.setItem('stateValue', JSON.stringify(location.state))
    return <Navigate to="/login" replace />;
  }

  return children ? <div className='flex h-screen w-full overflow-y-auto'>
    <Sidebar />
    <div className='overflow-y-auto w-full'>
<Header />
    {children}
    </div>

  </div> : <Outlet />;
};

export default ProtectedRoute;
