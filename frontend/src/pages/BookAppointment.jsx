import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const BookAppointment = () => {
  const { doctor_id } = useParams();
  const { state } = useLocation();
  const [doctor, setDoctor] = useState(state?.doctor || null);
  const [formData, setFormData] = useState({ speciality: '', date: '', start_time: '' });
  const [error, setError] = useState(null);
  const { authState } = useContext(AuthContext);
  const { isAuthenticated, userType, accessToken } = authState;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || userType !== 'patient') {
      navigate('/login');
    } else if (!doctor) {
      const fetchDoctor = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/api/patient/doctors/${doctor_id}/`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          setDoctor(response.data);
        } catch (err) {
          console.error('Fetch doctor error:', err.response?.data);
          setError(err.response?.data?.error || 'Failed to fetch doctor');
        }
      };
      fetchDoctor();
    }
  }, [doctor_id, isAuthenticated, userType, accessToken, navigate, doctor]);

  const normalizeDate = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr.match(/^\d{2}-\d{2}-\d{4}$/)) { // DD-MM-YYYY
      const [day, month, year] = dateStr.split('-');
      return `${year}-${month}-${day}`;
    }
    return dateStr; // Assume YYYY-MM-DD
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || userType !== 'patient') {
      navigate('/login');
    } else {
      const startTime = formData.start_time.split(':').slice(0, 2).join(':');
      const startDateTime = new Date(`2025-06-26T${startTime}:00`);
      const endDateTime = new Date(startDateTime.getTime() + 45 * 60 * 1000); // Add 45 minutes
      const endTime = endDateTime.toTimeString().slice(0, 5); // HH:MM
      const normalizedFormData = {
        speciality: formData.speciality,
        date: normalizeDate(formData.date),
        start_time: startTime,
        end_time: endTime,
      };
      try {
        const response = await axios.post(
          `http://localhost:8000/api/patient/book_appointment/${doctor_id}/`,
          normalizedFormData,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        navigate(`/patient/appointment_confirmed/${response.data.id}`);
      } catch (err) {
        console.error('Book appointment error:', err.response?.data);
        const errorData = err.response?.data;
        const errorMessage = errorData && typeof errorData === 'object' && !errorData.error
          ? Object.entries(errorData).map(([key, value]) => `${key}: ${value.join(', ')}`).join('; ')
          : errorData?.error || 'Failed to book appointment';
        setError(errorMessage);
      }
    }
  };

  if (!isAuthenticated || userType !== 'patient') {
    return null;
  }

  if (!doctor) {
    return (
      <div
        style={{
          backgroundImage: `url("/src/assets/doctor2.jpg")`,
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
          style={{
            textAlign: 'center',
            padding: '20px',
            fontFamily: "'Inter', sans-serif",
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            maxWidth: '600px',
            width: '100%',
            margin: '20px',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error || 'Loading...'}
        </motion.div>
      </div>
    );
  }

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
        backgroundImage: `url("/src/assets/doctor2.jpg")`,
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
          maxWidth: '600px',
          width: '100%',
          margin: '20px',
          padding: '20px',
          fontFamily: "'Inter', sans-serif",
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <motion.h2
          variants={childVariants}
          style={{ fontSize: '1.8rem', color: '#1e3a8a', marginBottom: '20px', fontWeight: '600' }}
        >
          Book Appointment with Dr. {doctor.first_name} {doctor.last_name}
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
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <motion.div variants={childVariants}>
              <label htmlFor="speciality" style={{ display: 'block', marginBottom: '5px', color: '#4b5563', fontSize: '0.875rem' }}>
                Speciality
              </label>
              <motion.input
                type="text"
                id="speciality"
                value={formData.speciality}
                onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                whileFocus={{ scale: 1.02, boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.3)' }}
              />
            </motion.div>
            <motion.div variants={childVariants}>
              <label htmlFor="date" style={{ display: 'block', marginBottom: '5px', color: '#4b5563', fontSize: '0.875rem' }}>
                Date
              </label>
              <motion.input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                whileFocus={{ scale: 1.02, boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.3)' }}
              />
            </motion.div>
            <motion.div variants={childVariants}>
              <label htmlFor="start_time" style={{ display: 'block', marginBottom: '5px', color: '#4b5563', fontSize: '0.875rem' }}>
                Start Time
              </label>
              <motion.input
                type="time"
                id="start_time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '1rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                whileFocus={{ scale: 1.02, boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.3)' }}
              />
            </motion.div>
            <motion.button
              variants={childVariants}
              whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(34, 197, 94, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#22c55e',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#16a34a')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#22c55e')}
            >
              Confirm
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BookAppointment;