import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const AppointmentConfirmed = () => {
  const { appointment_id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [error, setError] = useState(null);
  const { authState } = useContext(AuthContext);
  const { isAuthenticated, userType, accessToken } = authState;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || userType !== 'patient') {
      navigate('/login');
    } else {
      const fetchAppointment = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/api/patient/appointment_confirmed/${appointment_id}/`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          setAppointment(response.data);
        } catch (err) {
          setError(err.response?.data?.error || 'Failed to fetch appointment details');
        }
      };
      fetchAppointment();
    }
  }, [appointment_id, isAuthenticated, userType, accessToken, navigate]);

  if (!isAuthenticated || userType !== 'patient') {
    return null;
  }

  if (!appointment) return <motion.div style={{ textAlign: 'center', padding: '20px', fontFamily: "'Inter', sans-serif" }}>{error || 'Loading...'}</motion.div>;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: "'Inter', sans-serif" }}
    >
      <motion.h2
        variants={childVariants}
        style={{ fontSize: '1.8rem', color: '#1e3a8a', marginBottom: '20px', fontWeight: '600' }}
      >
        Appointment Confirmed
      </motion.h2>
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
        }}
      >
        <motion.p variants={childVariants} style={{ color: '#4b5563', marginBottom: '10px', fontSize: '1rem' }}>
          <strong>Doctor:</strong> {appointment.doctor?.first_name} {appointment.doctor?.last_name}
        </motion.p>
        <motion.p variants={childVariants} style={{ color: '#4b5563', marginBottom: '10px', fontSize: '1rem' }}>
          <strong>Speciality:</strong> {appointment.speciality}
        </motion.p>
        <motion.p variants={childVariants} style={{ color: '#4b5563', marginBottom: '10px', fontSize: '1rem' }}>
          <strong>Date:</strong> {appointment.date}
        </motion.p>
        <motion.p variants={childVariants} style={{ color: '#4b5563', marginBottom: '10px', fontSize: '1rem' }}>
          <strong>Time:</strong> {appointment.start_time} - {appointment.end_time}
        </motion.p>
        <motion.button
          variants={childVariants}
          whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/patient/dashboard')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '15px',
            fontSize: '1rem',
            fontWeight: '500',
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#2563eb')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#3b82f6')}
        >
          Back to Dashboard
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default AppointmentConfirmed;