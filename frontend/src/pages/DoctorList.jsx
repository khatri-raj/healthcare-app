import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);
  const { authState } = useContext(AuthContext);
  const { isAuthenticated, userType, accessToken } = authState;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || userType !== 'patient') {
      navigate('/login');
    } else {
      const fetchDoctors = async () => {
        try {
          const response = await axios.get('http://localhost:8000/api/patient/doctors/', {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          setDoctors(response.data.doctors || []);
        } catch (err) {
          setError(err.response?.data?.error || 'Failed to fetch doctors');
        }
      };
      fetchDoctors();
    }
  }, [isAuthenticated, userType, accessToken, navigate]);

  if (!isAuthenticated || userType !== 'patient') {
    return null;
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
        backgroundImage: `url("/src/assets/doctor3.jpg")`,
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
          maxWidth: '1200px',
          width: '100%',
          margin: '20px',
          padding: '20px',
          fontFamily: "'Inter', sans-serif",
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <motion.h1
          variants={childVariants}
          style={{ fontSize: '1.8rem', color: '#1e3a8a', marginBottom: '20px', fontWeight: '600' }}
        >
          Available Doctors
        </motion.h1>
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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
          }}
        >
          {doctors.map((doctor) => (
            <motion.div
              key={doctor.id}
              variants={childVariants}
              whileHover={{ scale: 1.02, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)' }}
              style={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                padding: '15px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <motion.img
                src={doctor.profile_picture.startsWith('/media/') ? `http://localhost:8000${doctor.profile_picture}` : doctor.profile_picture}
                alt="Profile Picture"
                style={{ width: '60px', height: '60px', borderRadius: '50%', marginRight: '15px' }}
                onError={(e) => { e.target.src = '/assets/placeholder.jpg'; console.error('Image failed to load:', doctor.profile_picture); }}
                whileHover={{ scale: 1.05 }}
              />
              <div>
                <motion.h5
                  variants={childVariants}
                  style={{ fontSize: '1.2rem', color: '#1e3a8a', marginBottom: '10px', fontWeight: '500' }}
                >
                  {doctor.first_name} {doctor.last_name}
                </motion.h5>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to={`/patient/book_appointment/${doctor.id}`}
                    state={{ doctor }}
                    style={{
                      padding: '8px 15px',
                      backgroundColor: '#3b82f6',
                      color: '#fff',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                    }}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = '#2563eb')}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = '#3b82f6')}
                  >
                    Book Appointment
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DoctorList;