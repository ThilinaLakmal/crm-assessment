import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import PageTransition from './PageTransition';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="app-layout">
      <div className="app-body">
        <Sidebar isOpen={isSidebarOpen} />
        <div className="app-content-wrapper">
          <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
          <main className="app-main-scrollable">
            <AnimatePresence mode="wait">
              <PageTransition>
                <div className="page-content-inner">
                  <Outlet />
                </div>
              </PageTransition>
            </AnimatePresence>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
