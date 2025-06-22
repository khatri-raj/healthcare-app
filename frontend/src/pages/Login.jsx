import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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

// Login.js
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post('http://localhost:8000/api/login/', credentials);
    console.log('Login response:', response.data);
    const { access, refresh, user_type, user } = response.data;

    // Save user details to localStorage, including profile_picture
    localStorage.setItem('first_name', user.first_name || '');
    localStorage.setItem('last_name', user.last_name || '');
    localStorage.setItem('username', user.username || '');
    localStorage.setItem('email', user.email || '');
    localStorage.setItem('address_line1', user.address_line1 || '');
    localStorage.setItem('city', user.city || '');
    localStorage.setItem('state', user.state || '');
    localStorage.setItem('pincode', user.pincode || '');
    // Store full URL or a valid placeholder
    localStorage.setItem('profile_picture', user.profile_picture || '/path/to/local/placeholder.jpg');

    // Show success message
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
    console.error('Login error:', err.response?.data);
  }
};

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '50px auto', 
      padding: '20px', 
      backgroundColor: '#fff', 
      borderRadius: '8px', 
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', 
      position: 'relative' 
    }}>
      {successMessage && (
        <div style={{ 
          position: 'absolute', 
          top: '20px', 
          right: '20px', 
          backgroundColor: '#28a745', 
          color: '#fff', 
          padding: '10px 20px', 
          borderRadius: '4px', 
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
          zIndex: 1000 
        }}>
          {successMessage}
        </div>
      )}
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>Login</h2>
      {error && (
        <p style={{ color: '#dc3545', textAlign: 'center', marginBottom: '15px' }}>{error}</p>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '5px', color: '#333' }}>
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '1rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>
        <div>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px', color: '#333' }}>
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '1rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '10px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;