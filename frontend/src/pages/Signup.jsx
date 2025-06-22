import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Signup = () => {
  const [userData, setUserData] = useState({
    first_name: '', last_name: '', profile_picture: null, username: '', email: '',
    password: '', confirm_password: '', address_line1: '', city: '', state: '',
    pincode: '', user_type: 'patient'
  });
  const [successMessage, setSuccessMessage] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profile_picture') {
      setUserData({ ...userData, profile_picture: files[0] });
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };

// Signup.js
const handleSubmit = async (e) => {
  e.preventDefault();
  if (userData.password !== userData.confirm_password) {
    alert('Passwords do not match');
    return;
  }

  const formData = new FormData();
  Object.entries(userData).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  try {
    const response = await axios.post('http://localhost:8000/api/signup/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log('Signup response:', response.data); // Log response

    setSuccessMessage('Signup successful! Please log in.');
    setTimeout(() => {
      setSuccessMessage('');
      navigate('/login');
    }, 2000);
  } catch (error) {
    console.error('Signup error:', error.response?.data); // Log error
    alert('Signup failed: ' + (error.response?.data?.error || 'Unknown error'));
  }
};

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '0 auto', 
      padding: '40px 20px', 
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
          name="first_name"
          placeholder="First Name"
          value={userData.first_name}
          onChange={handleChange}
          style={{ 
            padding: '10px', 
            fontSize: '1rem', 
            border: '1px solid #ccc', 
            borderRadius: '4px' 
          }}
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={userData.last_name}
          onChange={handleChange}
          style={{ 
            padding: '10px', 
            fontSize: '1rem', 
            border: '1px solid #ccc', 
            borderRadius: '4px' 
          }}
        />
        <input
          type="file"
          name="profile_picture"
          accept="image/*"
          onChange={(e) =>
            setUserData({ ...userData, profile_picture: e.target.files[0] })
          }
          style={{ 
            padding: '10px', 
            fontSize: '1rem', 
            border: '1px solid #ccc', 
            borderRadius: '4px' 
          }}
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={userData.username}
          onChange={handleChange}
          style={{ 
            padding: '10px', 
            fontSize: '1rem', 
            border: '1px solid #ccc', 
            borderRadius: '4px' 
          }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={userData.email}
          onChange={handleChange}
          style={{ 
            padding: '10px', 
            fontSize: '1rem', 
            border: '1px solid #ccc', 
            borderRadius: '4px' 
          }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={userData.password}
          onChange={handleChange}
          style={{ 
            padding: '10px', 
            fontSize: '1rem', 
            border: '1px solid #ccc', 
            borderRadius: '4px' 
          }}
        />
        <input
          type="password"
          name="confirm_password"
          placeholder="Confirm Password"
          value={userData.confirm_password}
          onChange={handleChange}
          style={{ 
            padding: '10px', 
            fontSize: '1rem', 
            border: '1px solid #ccc', 
            borderRadius: '4px' 
          }}
        />
        <input
          type="text"
          name="address_line1"
          placeholder="Address Line 1"
          value={userData.address_line1}
          onChange={handleChange}
          style={{ 
            padding: '10px', 
            fontSize: '1rem', 
            border: '1px solid #ccc', 
            borderRadius: '4px' 
          }}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={userData.city}
          onChange={handleChange}
          style={{ 
            padding: '10px', 
            fontSize: '1rem', 
            border: '1px solid #ccc', 
            borderRadius: '4px' 
          }}
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={userData.state}
          onChange={handleChange}
          style={{ 
            padding: '10px', 
            fontSize: '1rem', 
            border: '1px solid #ccc', 
            borderRadius: '4px' 
          }}
        />
        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={userData.pincode}
          onChange={handleChange}
          style={{ 
            padding: '10px', 
            fontSize: '1rem', 
            border: '1px solid #ccc', 
            borderRadius: '4px' 
          }}
        />
        <select
          name="user_type"
          value={userData.user_type}
          onChange={handleChange}
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