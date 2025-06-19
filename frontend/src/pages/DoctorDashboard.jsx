import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const { authState } = useContext(AuthContext);
  const { isAuthenticated, userType, accessToken } = authState;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || userType !== 'doctor') {
      navigate('/login');
    } else {
      const fetchAppointments = async () => {
        try {
          const response = await axios.get('http://localhost:8000/api/doctor/appointments/', {
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

  if (!isAuthenticated || userType !== 'doctor') {
    return null;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontWeight: 'bold', fontSize: '1.8rem', color: '#333' }}>
          Welcome, Dr. {localStorage.getItem('username') || 'Doctor'}{' '}
          <span style={{ color: '#666', fontSize: '1rem' }}>(Doctor)</span>
        </h2>
      </div>
      {error && (
        <p style={{ color: '#dc3545', textAlign: 'center', marginBottom: '15px' }}>{error}</p>
      )}
      <div style={{ 
        backgroundColor: '#fff', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
        marginBottom: '20px' 
      }}>
        <h5 style={{ 
          backgroundColor: '#28a745', 
          color: '#fff', 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '15px' 
        }}>
          Your Details
        </h5>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
            <strong>Username:</strong> {localStorage.getItem('username') || 'N/A'}
          </li>
          <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
            <strong>Email:</strong> {localStorage.getItem('email') || 'N/A'}
          </li>
          <li style={{ padding: '10px 0' }}>
            <strong>Address:</strong> {localStorage.getItem('address_line1') || 'N/A'}
          </li>
        </ul>
      </div>
      <h3 style={{ fontSize: '1.5rem', color: '#333', marginBottom: '15px' }}>Your Appointments</h3>
      {appointments.length > 0 ? (
        <div style={{ 
          backgroundColor: '#fff', 
          padding: '20px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' 
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Patient</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Speciality</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Date</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Start Time</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>End Time</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((app) => (
                <tr key={app.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>{app.patient?.username || 'N/A'}</td>
                  <td style={{ padding: '10px' }}>{app.speciality || 'N/A'}</td>
                  <td style={{ padding: '10px' }}>{app.date || 'N/A'}</td>
                  <td style={{ padding: '10px' }}>{app.start_time || 'N/A'}</td>
                  <td style={{ padding: '10px' }}>{app.end_time || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p style={{ color: '#666', textAlign: 'center' }}>No appointments scheduled.</p>
      )}
    </div>
  );
};

export default DoctorDashboard;