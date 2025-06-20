import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
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

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '1.8rem', color: '#333', marginBottom: '20px' }}>Available Doctors</h1>
      {error && (
        <p style={{ color: '#dc3545', textAlign: 'center', marginBottom: '15px' }}>{error}</p>
      )}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px' 
      }}>
        {doctors.map((doctor) => (
          <div key={doctor.id} style={{ 
            backgroundColor: '#fff', 
            borderRadius: '8px', 
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
            padding: '15px', 
            display: 'flex', 
            alignItems: 'center' 
          }}>
            <img 
              src={doctor.profile_picture || '/placeholder.jpg'} 
              alt="Profile Picture" 
              style={{ width: '60px', height: '60px', borderRadius: '50%', marginRight: '15px' }} 
            />
            <div>
              <h5 style={{ fontSize: '1.2rem', color: '#333', marginBottom: '10px' }}>
                {doctor.first_name} {doctor.last_name}
              </h5>
              <Link
  to={`/patient/book_appointment/${doctor.id}`}
  state={{ doctor }} // Pass doctor data
  style={{ 
    padding: '8px 15px', 
    backgroundColor: '#007bff', 
    color: '#fff', 
    borderRadius: '4px', 
    textDecoration: 'none' 
  }}
>
  Book Appointment
</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorList;