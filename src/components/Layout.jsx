import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      {isSidebarOpen && (
        <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
      )}

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'md:ml-64' : 'ml-0'
        }`}
      >
        <Header toggle={toggleSidebar} />
        <main className="p-4 flex-1 overflow-y-auto">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
