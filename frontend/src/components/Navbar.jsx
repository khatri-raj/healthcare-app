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
    hover: { scale: 1.1, color: '#e6f3fa', boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' },
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
        background: 'linear-gradient(90deg, #1e3a8a, #15803d)', // Blue to green gradient
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)', 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000,
        padding: '10px 0',
        borderBottom: '2px solid #ffffff20'
      }}
    >
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '0 30px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <motion.div
          whileHover={{ scale: 1.05, color: '#e6f3fa' }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/" style={{ 
            fontSize: '1.8rem', 
            fontWeight: '800', 
            color: '#ffffff', 
            textDecoration: 'none',
            letterSpacing: '1px',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'
          }}>
            Healthcare Hub
          </Link>
        </motion.div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <motion.div
              variants={linkVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link 
                to="/" 
                style={{
                  fontSize: '1.1rem',
                  color: '#e6f3fa',
                  textDecoration: 'none',
                  padding: '12px 20px',
                  display: 'block',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  transition: 'background 0.3s ease'
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
                bottom: '6px',
                left: '20px',
                height: '3px',
                backgroundColor: '#38bdf8', // Light blue for hover effect
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
                          fontSize: '1.1rem',
                          color: '#e6f3fa',
                          textDecoration: 'none',
                          padding: '12px 20px',
                          display: 'block',
                          borderRadius: '8px',
                          background: 'rgba(16, 185, 129, 0.2)', // Green tint for patient
                          transition: 'background 0.3s ease'
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
                        bottom: '6px',
                        left: '20px',
                        height: '3px',
                        backgroundColor: '#10b981', // Green for patient
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
                          fontSize: '1.1rem',
                          color: '#e6f3fa',
                          textDecoration: 'none',
                          padding: '12px 20px',
                          display: 'block',
                          borderRadius: '8px',
                          background: 'rgba(16, 185, 129, 0.2)', // Green tint for patient
                          transition: 'background 0.3s ease'
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
                        bottom: '6px',
                        left: '20px',
                        height: '3px',
                        backgroundColor: '#10b981', // Green for patient
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
                          fontSize: '1.1rem',
                          color: '#e6f3fa',
                          textDecoration: 'none',
                          padding: '12px 20px',
                          display: 'block',
                          borderRadius: '8px',
                          background: 'rgba(16, 185, 129, 0.2)', // Green tint for patient
                          transition: 'background 0.3s ease'
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
                        bottom: '6px',
                        left: '20px',
                        height: '3px',
                        backgroundColor: '#10b981', // Green for patient
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
                          fontSize: '1.1rem',
                          color: '#e6f3fa',
                          textDecoration: 'none',
                          padding: '12px 20px',
                          display: 'block',
                          borderRadius: '8px',
                          background: 'rgba(59, 130, 246, 0.2)', // Blue tint for doctor
                          transition: 'background 0.3s ease'
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
                        bottom: '6px',
                        left: '20px',
                        height: '3px',
                        backgroundColor: '#3b82f6', // Blue for doctor
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
                          fontSize: '1.1rem',
                          color: '#e6f3fa',
                          textDecoration: 'none',
                          padding: '12px 20px',
                          display: 'block',
                          borderRadius: '8px',
                          background: 'rgba(59, 130, 246, 0.2)', // Blue tint for doctor
                          transition: 'background 0.3s ease'
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
                        bottom: '6px',
                        left: '20px',
                        height: '3px',
                        backgroundColor: '#3b82f6', // Blue for doctor
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
                          fontSize: '1.1rem',
                          color: '#e6f3fa',
                          textDecoration: 'none',
                          padding: '12px 20px',
                          display: 'block',
                          borderRadius: '8px',
                          background: 'rgba(59, 130, 246, 0.2)', // Blue tint for doctor
                          transition: 'background 0.3s ease'
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
                        bottom: '6px',
                        left: '20px',
                        height: '3px',
                        backgroundColor: '#3b82f6', // Blue for doctor
                      }}
                    />
                  </div>
                </>
              )}
              <motion.button
                animate={{ scale: isAuthenticated ? [1, 1.05, 1] : 1, rotate: isAuthenticated ? [0, 2, 0] : 0, transition: { repeat: isAuthenticated ? Infinity : 0, duration: 1.5 } }}
                whileHover={{ scale: 1.1, color: '#ffffff', background: '#ef4444', boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                style={{ 
                  fontSize: '1.1rem', 
                  color: '#e6f3fa', 
                  background: 'rgba(239, 68, 68, 0.3)', 
                  border: '1px solid #ef4444', 
                  padding: '12px 20px', 
                  cursor: 'pointer',
                  borderRadius: '8px',
                  transition: 'background 0.3s ease'
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
                      fontSize: '1.1rem',
                      color: '#e6f3fa',
                      textDecoration: 'none',
                      padding: '12px 20px',
                      display: 'block',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      transition: 'background 0.3s ease'
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
                    bottom: '6px',
                    left: '20px',
                    height: '3px',
                    backgroundColor: '#38bdf8', // Light blue for hover
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
                      fontSize: '1.1rem',
                      color: '#e6f3fa',
                      textDecoration: 'none',
                      padding: '12px 20px',
                      display: 'block',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      transition: 'background 0.3s ease'
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
                    bottom: '6px',
                    left: '20px',
                    height: '3px',
                    backgroundColor: '#38bdf8', // Light blue for hover
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