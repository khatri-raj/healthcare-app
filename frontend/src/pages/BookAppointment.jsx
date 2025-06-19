import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const BookAppointment = () => {
  const { doctor_id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [formData, setFormData] = useState({ speciality: '', date: '', start_time: '' });
  const [error, setError] = useState(null);
  const { authState } = useContext(AuthContext);
  const { isAuthenticated, userType, accessToken } = authState;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || userType !== 'patient') {
      navigate('/login');
    } else {
      const fetchDoctor = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/api/patient/doctors/${doctor_id}/`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          setDoctor(response.data);
        } catch (err) {
          setError(err.response?.data?.error || 'Failed to fetch doctor');
        }
      };
      fetchDoctor();
    }
  }, [doctor_id, isAuthenticated, userType, accessToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || userType !== 'patient') {
      navigate('/login');
    } else {
      try {
        await axios.post(`http://localhost:8000/api/patient/book_appointment/${doctor_id}/`, formData, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        navigate('/patient/dashboard');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to book appointment');
      }
    }
  };

  if (!isAuthenticated || userType !== 'patient') {
    return null;
  }

  if (!doctor) return <div style={{ textAlign: 'center', padding: '20px' }}>{error || 'Loading...'}</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ fontSize: '1.8rem', color: '#333', marginBottom: '20px' }}>
        Book Appointment with Dr. {doctor.first_name} {doctor.last_name}
      </h2>
      {error && (
        <p style={{ color: '#dc3545', textAlign: 'center', marginBottom: '15px' }}>{error}</p>
      )}
      <div style={{ 
        backgroundColor: '#fff', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' 
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label htmlFor="speciality" style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Speciality</label>
            <input
              type="text"
              id="speciality"
              value={formData.speciality}
              onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
              required
              style={{ 
                width: '100%', 
                padding: '10px', 
                fontSize: '1rem', 
                border: '1px solid #ccc', 
                borderRadius: '4px' 
              }}
            />
          </div>
          <div>
            <label htmlFor="date" style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Date</label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              style={{ 
                width: '100%', 
                padding: '10px', 
                fontSize: '1rem', 
                border: '1px solid #ccc', 
                borderRadius: '4px' 
              }}
            />
          </div>
          <div>
            <label htmlFor="start_time" style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Start Time</label>
            <input
              type="time"
              id="start_time"
              value={formData.start_time}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              required
              style={{ 
                width: '100%', 
                padding: '10px', 
                fontSize: '1rem', 
                border: '1px solid #ccc', 
                borderRadius: '4px' 
              }}
            />
          </div>
          <button
            type="submit"
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#28a745', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer' 
            }}
          >
            Confirm
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;