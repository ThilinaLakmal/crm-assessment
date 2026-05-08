import { NavLink } from 'react-router-dom';
import { HiOutlineChartBar, HiOutlineUsers, HiOutlineCog, HiOutlineSparkles, HiOutlineLogout } from 'react-icons/hi';
import { motion } from 'framer-motion';

const Sidebar = ({ isOpen, onLogoutClick }) => {
  return (
    <motion.aside
      className="app-sidebar"
      initial={false}
      animate={{ width: isOpen ? 260 : 76 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div 
        className="sidebar-brand" 
        style={{ 
          flexDirection: isOpen ? 'column' : 'row', 
          padding: isOpen ? '40px 10px 30px 10px' : '24px 10px'
        }}
      >
        <motion.div 
          className="brand-icon-large"
          animate={{ 
            width: isOpen ? 96 : 48, 
            height: isOpen ? 96 : 48,
            borderRadius: isOpen ? 24 : 16,
            marginBottom: isOpen ? 24 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          <HiOutlineSparkles size={isOpen ? 48 : 26} />
        </motion.div>
        
        {isOpen && (
          <motion.div 
            className="brand-text-wrapper"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: 0.1, duration: 0.2 }}
          >
            <span className="brand-text-main">CRM Manager</span>
            <span className="brand-text-sub">Pro Edition</span>
          </motion.div>
        )}
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" end className="sidebar-link" title="Dashboard">
          <HiOutlineChartBar size={22} className="sidebar-icon" />
          {isOpen && <span className="sidebar-link-text">Dashboard</span>}
        </NavLink>
        <NavLink to="/leads" className="sidebar-link" title="Leads">
          <HiOutlineUsers size={22} className="sidebar-icon" />
          {isOpen && <span className="sidebar-link-text">Leads</span>}
        </NavLink>
        <NavLink to="/settings" className="sidebar-link" title="Settings">
          <HiOutlineCog size={22} className="sidebar-icon" />
          {isOpen && <span className="sidebar-link-text">Settings</span>}
        </NavLink>
      </nav>

      {/* ---- Sidebar Footer: Sign Out ---- */}
      <div className="mt-auto p-3 border-top" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <button 
          onClick={onLogoutClick}
          className="sidebar-link w-100 border-0 bg-transparent text-start"
          style={{ color: '#ef4444' }}
        >
          <HiOutlineLogout size={22} className="sidebar-icon" style={{ color: '#ef4444' }} />
          {isOpen && <span className="sidebar-link-text">Sign Out</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
