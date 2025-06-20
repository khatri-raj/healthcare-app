import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
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

  if (!appointment) return <div style={{ textAlign: 'center', padding: '20px' }}>{error || 'Loading...'}</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ fontSize: '1.8rem', color: '#333', marginBottom: '20px' }}>
        Appointment Confirmed
      </h2>
      <div style={{ 
        backgroundColor: '#fff', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' 
      }}>
        <p><strong>Doctor:</strong> {appointment.doctor?.first_name} {appointment.doctor?.last_name}</p>
        <p><strong>Speciality:</strong> {appointment.speciality}</p>
        <p><strong>Date:</strong> {appointment.date}</p>
        <p><strong>Time:</strong> {appointment.start_time} - {appointment.end_time}</p>
        <button
          onClick={() => navigate('/patient/dashboard')}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            marginTop: '15px' 
          }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AppointmentConfirmed;