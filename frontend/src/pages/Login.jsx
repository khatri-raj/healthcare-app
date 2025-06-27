import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/login/', credentials);
      const { access, refresh, user_type, user } = response.data;

      localStorage.setItem('first_name', user.first_name || '');
      localStorage.setItem('last_name', user.last_name || '');
      localStorage.setItem('username', user.username || '');
      localStorage.setItem('email', user.email || '');
      localStorage.setItem('address_line1', user.address_line1 || '');
      localStorage.setItem('city', user.city || '');
      localStorage.setItem('state', user.state || '');
      localStorage.setItem('pincode', user.pincode || '');
      localStorage.setItem('profile_picture', user.profile_picture || '/path/to/local/placeholder.jpg');

      setSuccessMessage('Login successful!');
      setTimeout(() => {
        setSuccessMessage('');
        login(access, refresh, user_type);
        if (user_type === 'patient') {
          navigate('/patient/dashboard');
        } else if (user_type === 'doctor') {
          navigate('/doctor/dashboard');
        } else {
          setError('Invalid user type');
        }
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, when: 'beforeChildren', staggerChildren: 0.1 },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const linkVariants = {
    hover: { scale: 1.1, color: '#1e3a8a' },
    tap: { scale: 0.95 },
  };

  return (
    <div
      style={{
        backgroundImage: `url("src/assets/Login.jpg")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        margin: 0,
        width: '100%',
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          maxWidth: '400px',
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // Increased transparency
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              style={{ 
                position: 'absolute', 
                top: '16px', 
                right: '16px', 
                backgroundColor: '#10b981', 
                color: '#fff', 
                padding: '8px 16px', 
                borderRadius: '8px', 
                fontSize: '0.875rem', 
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' 
              }}
            >
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              style={{ 
                color: '#ef4444', 
                textAlign: 'center', 
                marginBottom: '16px', 
                fontSize: '0.875rem' 
              }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
        <motion.h2
          variants={childVariants}
          style={{ 
            fontSize: '1.875rem', 
            fontWeight: '600', 
            color: '#1e3a8a', 
            textAlign: 'center', 
            marginBottom: '24px' 
          }}
        >
          Welcome Back
        </motion.h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <motion.div variants={childVariants}>
            <label htmlFor="username" style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              color: '#4b5563', 
              marginBottom: '8px' 
            }}>
              Username
            </label>
            <motion.input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '1rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                backgroundColor: 'rgba(0,0,0,0.05)',
              }}
              whileFocus={{ scale: 1.02, boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.3)' }}
            />
          </motion.div>
          <motion.div variants={childVariants}>
            <label htmlFor="password" style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              color: '#4b5563', 
              marginBottom: '8px' 
            }}>
              Password
            </label>
            <motion.input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '1rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                backgroundColor: 'rgba(0,0,0,0.05)',
              }}
              whileFocus={{ scale: 1.02, boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.3)' }}
            />
          </motion.div>
          <motion.button
            variants={childVariants}
            whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogin}
            style={{
              padding: '12px',
              backgroundColor: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
          >
            Sign In
          </motion.button>
          <motion.div
            variants={childVariants}
            style={{
              textAlign: 'center',
              fontSize: '0.875rem',
              color: '#4b5563',
              marginTop: '16px',
            }}
          >
            Not registered yet?{' '}
            <motion.span
              variants={linkVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                to="/signup"
                style={{
                  color: '#3b82f6',
                  textDecoration: 'none',
                  fontWeight: '500',
                }}
              >
                Sign up
              </Link>
            </motion.span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;