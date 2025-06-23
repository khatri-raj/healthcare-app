import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { authState, logout } = useContext(AuthContext);
  const { isAuthenticated, userType } = authState;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkVariants = {
    hover: { scale: 1.1, color: '#1e3a8a', boxShadow: '0 0 8px rgba(59, 130, 246, 0.3)' },
    tap: { scale: 0.95 },
  };

  const underlineVariants = {
    hidden: { width: 0 },
    visible: { width: '100%', transition: { duration: 0.3 } },
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ 
        backgroundColor: '#fff', 
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000,
        padding: '16px 0'
      }}
    >
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '0 24px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <motion.div
          whileHover={{ scale: 1.05, color: '#2563eb' }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/" style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700', 
            color: '#1e3a8a', 
            textDecoration: 'none' 
          }}>
            Healthcare App
          </Link>
        </motion.div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <motion.div
              variants={linkVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link 
                to="/" 
                style={{
                  fontSize: '1rem',
                  color: '#4b5563',
                  textDecoration: 'none',
                  padding: '12px 16px',
                  display: 'block',
                }}
              >
                Home
              </Link>
            </motion.div>
            <motion.div
              variants={underlineVariants}
              initial="hidden"
              whileHover="visible"
              style={{
                position: 'absolute',
                bottom: '8px',
                left: '16px',
                height: '2px',
                backgroundColor: '#1e3a8a',
              }}
            />
          </div>
          {isAuthenticated ? (
            <>
              {userType === 'patient' && (
                <>
                  <div style={{ position: 'relative' }}>
                    <motion.div
                      variants={linkVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Link 
                        to="/patient/dashboard" 
                        style={{
                          fontSize: '1rem',
                          color: '#4b5563',
                          textDecoration: 'none',
                          padding: '12px 16px',
                          display: 'block',
                        }}
                      >
                        🏠 Dashboard
                      </Link>
                    </motion.div>
                    <motion.div
                      variants={underlineVariants}
                      initial="hidden"
                      whileHover="visible"
                      style={{
                        position: 'absolute',
                        bottom: '8px',
                        left: '16px',
                        height: '2px',
                        backgroundColor: '#1e3a8a',
                      }}
                    />
                  </div>
                  <div style={{ position: 'relative' }}>
                    <motion.div
                      variants={linkVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Link 
                        to="/patient/blogs" 
                        style={{
                          fontSize: '1rem',
                          color: '#4b5563',
                          textDecoration: 'none',
                          padding: '12px 16px',
                          display: 'block',
                        }}
                      >
                        📰 Blogs
                      </Link>
                    </motion.div>
                    <motion.div
                      variants={underlineVariants}
                      initial="hidden"
                      whileHover="visible"
                      style={{
                        position: 'absolute',
                        bottom: '8px',
                        left: '16px',
                        height: '2px',
                        backgroundColor: '#1e3a8a',
                      }}
                    />
                  </div>
                  <div style={{ position: 'relative' }}>
                    <motion.div
                      variants={linkVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Link 
                        to="/patient/doctors" 
                        style={{
                          fontSize: '1rem',
                          color: '#4b5563',
                          textDecoration: 'none',
                          padding: '12px 16px',
                          display: 'block',
                        }}
                      >
                        👨‍⚕️ Doctors
                      </Link>
                    </motion.div>
                    <motion.div
                      variants={underlineVariants}
                      initial="hidden"
                      whileHover="visible"
                      style={{
                        position: 'absolute',
                        bottom: '8px',
                        left: '16px',
                        height: '2px',
                        backgroundColor: '#1e3a8a',
                      }}
                    />
                  </div>
                </>
              )}
              {userType === 'doctor' && (
                <>
                  <div style={{ position: 'relative' }}>
                    <motion.div
                      variants={linkVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Link 
                        to="/doctor/dashboard" 
                        style={{
                          fontSize: '1rem',
                          color: '#4b5563',
                          textDecoration: 'none',
                          padding: '12px 16px',
                          display: 'block',
                        }}
                      >
                        🏥 Dashboard
                      </Link>
                    </motion.div>
                    <motion.div
                      variants={underlineVariants}
                      initial="hidden"
                      whileHover="visible"
                      style={{
                        position: 'absolute',
                        bottom: '8px',
                        left: '16px',
                        height: '2px',
                        backgroundColor: '#1e3a8a',
                      }}
                    />
                  </div>
                  <div style={{ position: 'relative' }}>
                    <motion.div
                      variants={linkVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Link 
                        to="/doctor/blogs/create" 
                        style={{
                          fontSize: '1rem',
                          color: '#4b5563',
                          textDecoration: 'none',
                          padding: '12px 16px',
                          display: 'block',
                        }}
                      >
                        ✏️ Create Blog
                      </Link>
                    </motion.div>
                    <motion.div
                      variants={underlineVariants}
                      initial="hidden"
                      whileHover="visible"
                      style={{
                        position: 'absolute',
                        bottom: '8px',
                        left: '16px',
                        height: '2px',
                        backgroundColor: '#1e3a8a',
                      }}
                    />
                  </div>
                  <div style={{ position: 'relative' }}>
                    <motion.div
                      variants={linkVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Link 
                        to="/doctor/blogs" 
                        style={{
                          fontSize: '1rem',
                          color: '#4b5563',
                          textDecoration: 'none',
                          padding: '12px 16px',
                          display: 'block',
                        }}
                      >
                        📋 My Blogs
                      </Link>
                    </motion.div>
                    <motion.div
                      variants={underlineVariants}
                      initial="hidden"
                      whileHover="visible"
                      style={{
                        position: 'absolute',
                        bottom: '8px',
                        left: '16px',
                        height: '2px',
                        backgroundColor: '#1e3a8a',
                      }}
                    />
                  </div>
                </>
              )}
              <motion.button
                animate={{ scale: isAuthenticated ? [1, 1.05, 1] : 1, rotate: isAuthenticated ? [0, 2, 0] : 0, transition: { repeat: isAuthenticated ? Infinity : 0, duration: 1.5 } }}
                whileHover={{ scale: 1.1, color: '#ef4444', boxShadow: '0 0 8px rgba(239, 68, 68, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                style={{ 
                  fontSize: '1rem', 
                  color: '#4b5563', 
                  background: 'none', 
                  border: 'none', 
                  padding: '12px 16px', 
                  cursor: 'pointer' 
                }}
              >
                🚪 Logout
              </motion.button>
            </>
          ) : (
            <>
              <div style={{ position: 'relative' }}>
                <motion.div
                  variants={linkVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link 
                    to="/login" 
                    style={{
                      fontSize: '1rem',
                      color: '#4b5563',
                      textDecoration: 'none',
                      padding: '12px 16px',
                      display: 'block',
                    }}
                  >
                    🔐 Login
                  </Link>
                </motion.div>
                <motion.div
                  variants={underlineVariants}
                  initial="hidden"
                  whileHover="visible"
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '16px',
                    height: '2px',
                    backgroundColor: '#1e3a8a',
                  }}
                />
              </div>
              <div style={{ position: 'relative' }}>
                <motion.div
                  variants={linkVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link 
                    to="/signup" 
                    style={{
                      fontSize: '1rem',
                      color: '#4b5563',
                      textDecoration: 'none',
                      padding: '12px 16px',
                      display: 'block',
                    }}
                  >
                    📝 Signup
                  </Link>
                </motion.div>
                <motion.div
                  variants={underlineVariants}
                  initial="hidden"
                  whileHover="visible"
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '16px',
                    height: '2px',
                    backgroundColor: '#1e3a8a',
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;