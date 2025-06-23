import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const Signup = () => {
  const [userData, setUserData] = useState({
    first_name: '', last_name: '', profile_picture: null, username: '', email: '',
    password: '', confirm_password: '', address_line1: '', city: '', state: '',
    pincode: '', user_type: 'patient'
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profile_picture') {
      setUserData({ ...userData, profile_picture: files[0] });
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };

  const handleSignup = async () => {
    if (userData.password !== userData.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    const formData = new FormData();
    Object.entries(userData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    try {
      const response = await axios.post('http://localhost:8000/api/signup/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccessMessage('Signup successful! Redirecting to login...');
      setTimeout(() => {
        setSuccessMessage('');
        navigate('/login');
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.error || 'Signup failed');
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

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: 'calc(100vh - 200px)', 
      padding: '20px' 
    }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ 
          maxWidth: '600px', 
          width: '100%', 
          backgroundColor: '#fff', 
          borderRadius: '12px', 
          padding: '32px', 
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', 
          position: 'relative' 
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
                fontSize: '0.875rem' 
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
        <motion.h1
          variants={childVariants}
          style={{ 
            fontSize: '1.875rem', 
            fontWeight: '600', 
            color: '#1e3a8a', 
            textAlign: 'center', 
            marginBottom: '24px' 
          }}
        >
          Create Account
        </motion.h1>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '16px' 
        }}>
          <motion.div variants={childVariants}>
            <label style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '8px', display: 'block' }}>
              First Name
            </label>
            <motion.input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={userData.first_name}
              onChange={handleChange}
              style={{ 
                width: '100%', 
                padding: '12px', 
                fontSize: '1rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '8px',
                outline: 'none',
                transition: 'border-color 0.2s',
                backgroundColor: 'rgba(0,0,0,0.05)',
              }}
              whileFocus={{ scale: 1.02, boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.3)' }}
            />
          </motion.div>
          <motion.div variants={childVariants}>
            <label style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '8px', display: 'block' }}>
              Last Name
            </label>
            <motion.input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={userData.last_name}
              onChange={handleChange}
              style={{ 
                width: '100%', 
                padding: '12px', 
                fontSize: '1rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '8px',
                outline: 'none',
                transition: 'border-color 0.2s',
                backgroundColor: 'rgba(0,0,0,0.05)',
              }}
              whileFocus={{ scale: 1.02, boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.3)' }}
            />
          </motion.div>
          <motion.div variants={childVariants} style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '8px', display: 'block' }}>
              Profile Picture
            </label>
            <motion.input
              type="file"
              name="profile_picture"
              accept="image/*"
              onChange={handleChange}
              style={{ 
                width: '100%', 
                padding: '8px', 
                fontSize: '1rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '8px',
                backgroundColor: 'rgba(0,0,0,0.05)',
              }}
            />
          </motion.div>
          <motion.div variants={childVariants}>
            <label style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '8px', display: 'block' }}>
              Username
            </label>
            <motion.input
              type="text"
              name="username"
              placeholder="Username"
              value={userData.username}
              onChange={handleChange}
              style={{ 
                width: '100%', 
                padding: '12px', 
                fontSize: '1rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '8px',
                outline: 'none',
                transition: 'border-color 0.2s',
                backgroundColor: 'rgba(0,0,0,0.05)',
              }}
              whileFocus={{ scale: 1.02, boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.3)' }}
            />
          </motion.div>
          <motion.div variants={childVariants}>
            <label style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '8px', display: 'block' }}>
              Email
            </label>
            <motion.input
              type="email"
              name="email"
              placeholder="Email"
              value={userData.email}
              onChange={handleChange}
              style={{ 
                width: '100%', 
                padding: '12px', 
                fontSize: '1rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '8px',
                outline: 'none',
                transition: 'border-color 0.2s',
                backgroundColor: 'rgba(0,0,0,0.05)',
              }}
              whileFocus={{ scale: 1.02, boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.3)' }}
            />
          </motion.div>
          <motion.div variants={childVariants}>
            <label style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '8px', display: 'block' }}>
              Password
            </label>
            <motion.input
              type="password"
              name="password"
              placeholder="Password"
              value={userData.password}
              onChange={handleChange}
              style={{ 
                width: '100%', 
                padding: '12px', 
                fontSize: '1rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '8px',
                outline: 'none',
                transition: 'border-color 0.2s',
                backgroundColor: 'rgba(0,0,0,0.05)',
              }}
              whileFocus={{ scale: 1.02, boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.3)' }}
            />
          </motion.div>
          <motion.div variants={childVariants}>
            <label style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '8px', display: 'block' }}>
              Confirm Password
            </label>
            <motion.input
              type="password"
              name="confirm_password"
              placeholder="Confirm Password"
              value={userData.confirm_password}
              onChange={handleChange}
              style={{ 
                width: '100%', 
                padding: '12px', 
                fontSize: '1rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '8px',
                outline: 'none',
                transition: 'border-color 0.2s',
                backgroundColor: 'rgba(0,0,0,0.05)',
              }}
              whileFocus={{ scale: 1.02, boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.3)' }}
            />
          </motion.div>
          <motion.div variants={childVariants} style={{ gridColumn: 'span 2' }}>
            <label style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '8px', display: 'block' }}>
              Address Line 1
            </label>
            <motion.input
              type="text"
              name="address_line1"
              placeholder="Address Line 1"
              value={userData.address_line1}
              onChange={handleChange}
              style={{ 
                width: '100%', 
                padding: '12px', 
                fontSize: '1rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '8px',
                outline: 'none',
                transition: 'border-color 0.2s',
                backgroundColor: 'rgba(0,0,0,0.05)',
              }}
              whileFocus={{ scale: 1.02, boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.3)' }}
            />
          </motion.div>
          <motion.div variants={childVariants}>
            <label style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '8px', display: 'block' }}>
              City
            </label>
            <motion.input
              type="text"
              name="city"
              placeholder="City"
              value={userData.city}
              onChange={handleChange}
              style={{ 
                width: '100%', 
                padding: '12px', 
                fontSize: '1rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '8px',
                outline: 'none',
                transition: 'border-color 0.2s',
                backgroundColor: 'rgba(0,0,0,0.05)',
              }}
              whileFocus={{ scale: 1.02, boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.3)' }}
            />
          </motion.div>
          <motion.div variants={childVariants}>
            <label style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '8px', display: 'block' }}>
              State
            </label>
            <motion.input
              type="text"
              name="state"
              placeholder="State"
              value={userData.state}
              onChange={handleChange}
              style={{ 
                width: '100%', 
                padding: '12px', 
                fontSize: '1rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '8px',
                outline: 'none',
                transition: 'border-color 0.2s',
                backgroundColor: 'rgba(0,0,0,0.05)',
              }}
              whileFocus={{ scale: 1.02, boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.3)' }}
            />
          </motion.div>
          <motion.div variants={childVariants}>
            <label style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '8px', display: 'block' }}>
              Pincode
            </label>
            <motion.input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={userData.pincode}
              onChange={handleChange}
              style={{ 
                width: '100%', 
                padding: '12px', 
                fontSize: '1rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '8px',
                outline: 'none',
                transition: 'border-color 0.2s',
                backgroundColor: 'rgba(0,0,0,0.05)',
              }}
              whileFocus={{ scale: 1.02, boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.3)' }}
            />
          </motion.div>
          <motion.div variants={childVariants}>
            <label style={{ fontSize: '0.875rem', color: 'rgba(0,0,0,0.05)', marginBottom: '8px', display: 'block' }}>
              User Type
            </label>
            <motion.select
              name="user_type"
              value={userData.user_type}
              onChange={handleChange}
              style={{ 
                width: '100%', 
                padding: '12px', 
                fontSize: '1rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '8px',
                backgroundColor: 'rgba(0,0,0,0.05)',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              whileFocus={{ scale: 1.02, boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.3)' }}
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </motion.select>
          </motion.div>
          <motion.button
            variants={childVariants}
            whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            animate={{ scale: [1, 1.02, 1], transition: { repeat: Infinity, duration: 1.5 } }}
            onClick={handleSignup}
            style={{
              gridColumn: 'span 2',
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
            Sign Up
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;