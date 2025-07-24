import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PublicRoute = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (token && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicRoute;
