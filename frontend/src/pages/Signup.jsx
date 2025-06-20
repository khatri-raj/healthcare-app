import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Signup = () => {
  const [userData, setUserData] = useState({
    first_name: '', last_name: '', profile_picture: '', username: '', email: '',
    password: '', confirm_password: '', address_line1: '', city: '', state: '',
    pincode: '', user_type: 'patient'
  });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userData.password !== userData.confirm_password) {
      alert('Passwords do not match');
      return;
    }
    try {
      // Signup request
      await axios.post('http://localhost:8000/api/signup/', userData);

      // Auto-login after signup
      const loginResponse = await axios.post('http://localhost:8000/api/login/', {
        username: userData.username,
        password: userData.password,
      });
      const { access, refresh, user_type, user } = loginResponse.data;

      // Save user details to localStorage
      localStorage.setItem('first_name', user.first_name || '');
      localStorage.setItem('last_name', user.last_name || '');
      localStorage.setItem('username', user.username || '');
      localStorage.setItem('email', user.email || '');
      localStorage.setItem('address_line1', user.address_line1 || '');
      localStorage.setItem('city', user.city || '');
      localStorage.setItem('state', user.state || '');
      localStorage.setItem('pincode', user.pincode || '');

      login(access, refresh, user_type);
      if (user_type === 'patient') {
        navigate('/patient/dashboard');
      } else if (user_type === 'doctor') {
        navigate('/doctor/dashboard');
      }
    } catch (error) {
      alert('Signup or login failed');
      console.error('Error:', error.response?.data);
    }
  };

  return (
    <div style={{ 
      maxWidth: '600px', 
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
        Signup
      </h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="text"
          placeholder="First Name"
          value={userData.first_name}
          onChange={(e) => setUserData({ ...userData, first_name: e.target.value })}
          style={{ 
            padding: '10px', 
            fontSize: '1rem', 
            border: '1px solid #ccc', 
            borderRadius: '4px' 
          }}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={userData.last_name}
          onChange={(e) => setUserData({ ...userData, last_name: e.target.value })}
          style={{ 
            padding: '10px', 
            fontSize: '1rem', 
            border: '1px solid #ccc', 
            borderRadius: '4px' 
          }}
        />
        <input
          type="text"
          placeholder="Username"
          value={userData.username}
          onChange={(e) => setUserData({ ...userData, username: e.target.value })}
          style={{ 
            padding: '10px', 
            fontSize: '1rem', 
            border: '1px solid #ccc', 
            borderRadius: '4px' 
          }}
        />
        <input
          type="email"
          placeholder="Email"
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
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
          value={userData.password}
          onChange={(e) => setUserData({ ...userData, password: e.target.value })}
          style={{ 
            padding: '10px', 
            fontSize: '1rem', 
            border: '1px solid #ccc', 
            borderRadius: '4px' 
          }}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={userData.confirm_password}
          onChange={(e) => setUserData({ ...userData, confirm_password: e.target.value })}
          style={{ 
            padding: '10px', 
            fontSize: '1rem', 
            border: '1px solid #ccc', 
            borderRadius: '4px' 
          }}
        />
        <input
          type="text"
          placeholder="Address Line 1"
          value={userData.address_line1}
          onChange={(e) => setUserData({ ...userData, address_line1: e.target.value })}
          style={{ 
            padding: '10px', 
            fontSize: '1rem', 
            border: '1px solid #ccc', 
            borderRadius: '4px' 
          }}
        />
        <input
          type="text"
          placeholder="City"
          value={userData.city}
          onChange={(e) => setUserData({ ...userData, city: e.target.value })}
          style={{ 
            padding: '10px', 
            fontSize: '1rem', 
            border: '1px solid #ccc', 
            borderRadius: '4px' 
          }}
        />
        <input
          type="text"
          placeholder="State"
          value={userData.state}
          onChange={(e) => setUserData({ ...userData, state: e.target.value })}
          style={{ 
            padding: '10px', 
            fontSize: '1rem', 
            border: '1px solid #ccc', 
            borderRadius: '4px' 
          }}
        />
        <input
          type="text"
          placeholder="Pincode"
          value={userData.pincode}
          onChange={(e) => setUserData({ ...userData, pincode: e.target.value })}
          style={{ 
            padding: '10px', 
            fontSize: '1rem', 
            border: '1px solid #ccc', 
            borderRadius: '4px' 
          }}
        />
        <select
          value={userData.user_type}
          onChange={(e) => setUserData({ ...userData, user_type: e.target.value })}
          style={{ 
            padding: '10px', 
            fontSize: '1rem', 
            border: '1px solid #ccc', 
            borderRadius: '4px' 
          }}
        >
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
        </select>
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
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;