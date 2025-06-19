import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/login/', credentials);
      login(response.data.access, response.data.user_type);
      navigate(`/${response.data.user_type}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '0 auto', 
      padding: '40px 20px' 
    }}>
      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: 'bold', 
        color: '#333', 
        marginBottom: '20px', 
        textAlign: 'center' 
      }}>
        Login
      </h1>
      {error && (
        <p style={{ color: '#dc3545', textAlign: 'center', marginBottom: '15px' }}>{error}</p>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="text"
          placeholder="Username"
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          style={{ 
            padding: '10px', 
            fontSize: '1rem', 
            border: '1px solid #ccc', 
            borderRadius: '4px' 
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          style={{ 
            padding: '10px', 
            fontSize: '1rem', 
            border: '1px solid #ccc', 
            borderRadius: '4px' 
          }}
        />
        <button
          type="submit"
          style={{ 
            padding: '10px', 
            fontSize: '1rem', 
            backgroundColor: '#007bff', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;