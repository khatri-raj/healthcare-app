import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const { authState } = useContext(AuthContext);
  const { isAuthenticated, userType, accessToken } = authState;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || userType !== 'patient') {
      navigate('/login');
    } else {
      const fetchAppointments = async () => {
        try {
          const response = await axios.get('http://localhost:8000/api/patient/appointments/', {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          setAppointments(response.data.appointments || []);
        } catch (err) {
          setError(err.response?.data?.error || 'Failed to fetch appointments');
        }
      };
      fetchAppointments();
    }
  }, [isAuthenticated, userType, accessToken, navigate]);

  if (!isAuthenticated || userType !== 'patient') {
    return null;
  }

  const firstName = localStorage.getItem('first_name') || 'Patient';
  const lastName = localStorage.getItem('last_name') || '';
  const username = localStorage.getItem('username') || 'N/A';
  const email = localStorage.getItem('email') || 'N/A';
  const addressLine1 = localStorage.getItem('address_line1') || 'N/A';
  const city = localStorage.getItem('city') || 'N/A';
  const state = localStorage.getItem('state') || 'N/A';
  const pincode = localStorage.getItem('pincode') || 'N/A';
  const profilePicture = localStorage.getItem('profile_picture') || '/assets/placeholder.jpg';

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div
      style={{
        backgroundImage: `url("/src/assets/Login.jpg")`,
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
          maxWidth: '800px',
          width: '100%',
          margin: '20px',
          padding: '20px',
          fontFamily: "'Inter', sans-serif",
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <motion.div variants={childVariants} style={{ textAlign: 'center', marginBottom: '20px' }}>
          <motion.img
            src={profilePicture.startsWith('/media/') ? `http://localhost:8000${profilePicture}` : profilePicture}
            alt="Profile Picture"
            style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '10px' }}
            onError={(e) => { e.target.src = '/assets/placeholder.jpg'; console.error('Image load error:', e); }}
            whileHover={{ scale: 1.05 }}
          />
          <motion.h2
            style={{ fontWeight: '600', fontSize: '1.8rem', color: '#1e3a8a' }}
          >
            Welcome, {firstName} {lastName}{' '}
            <span style={{ color: '#4b5563', fontSize: '1rem' }}>(Patient)</span>
          </motion.h2>
        </motion.div>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ color: '#ef4444', textAlign: 'center', marginBottom: '15px', fontSize: '0.875rem' }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
        <motion.div
          variants={childVariants}
          style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            marginBottom: '20px',
          }}
        >
          <motion.h5
            style={{
              backgroundColor: '#3b82f6',
              color: '#fff',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '15px',
              fontSize: '1.25rem',
              fontWeight: '500',
            }}
          >
            Your Details
          </motion.h5>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <motion.li variants={childVariants} style={{ padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
              <strong>Username:</strong> {username}
            </motion.li>
            <motion.li variants={childVariants} style={{ padding: '10px 0', borderBottom: '1px solid #e5e7eb' }}>
              <strong>Email:</strong> {email}
            </motion.li>
            <motion.li variants={childVariants} style={{ padding: '10px 0' }}>
              <strong>Address:</strong> {addressLine1}, {city}, {state} - {pincode}
            </motion.li>
          </ul>
        </motion.div>
        <motion.h3 variants={childVariants} style={{ fontSize: '1.5rem', color: '#1e3a8a', marginBottom: '15px' }}>
          Your Appointments
        </motion.h3>
        {appointments.length > 0 ? (
          <motion.div
            variants={childVariants}
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f3f4f6', textAlign: 'left' }}>
                  <th style={{ padding: '10px', borderBottom: '1px solid #d1d5db' }}>Doctor</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid #d1d5db' }}>Speciality</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid #d1d5db' }}>Date</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid #d1d5db' }}>Start Time</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid #d1d5db' }}>End Time</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((app) => (
                  <motion.tr
                    key={app.id}
                    variants={childVariants}
                    style={{ borderBottom: '1px solid #d1d5db' }}
                    whileHover={{ backgroundColor: '#f9fafb' }}
                  >
                    <td style={{ padding: '10px' }}>{app.doctor?.username || 'N/A'}</td>
                    <td style={{ padding: '10px' }}>{app.speciality || 'N/A'}</td>
                    <td style={{ padding: '10px' }}>{app.date || 'N/A'}</td>
                    <td style={{ padding: '10px' }}>{app.start_time || 'N/A'}</td>
                    <td style={{ padding: '10px' }}>{app.end_time || 'N/A'}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        ) : (
          <motion.p
            variants={childVariants}
            style={{ color: '#4b5563', textAlign: 'center', fontSize: '0.875rem' }}
          >
            No appointments scheduled.
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default PatientDashboard;