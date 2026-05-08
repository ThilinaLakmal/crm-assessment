import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import PageTransition from './PageTransition';
import LogoutModal from './LogoutModal';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="app-layout">
      <div className="app-body">
        <Sidebar isOpen={isSidebarOpen} onLogoutClick={() => setShowLogoutModal(true)} />
        <div className="app-content-wrapper">
          <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} onLogoutClick={() => setShowLogoutModal(true)} />
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
      <LogoutModal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} />
    </div>
  );
};

export default Layout;
