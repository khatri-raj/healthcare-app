import React from 'react';

const Home = () => {
  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      textAlign: 'center', 
      padding: '40px 20px' 
    }}>
      <h1 style={{ 
        fontSize: '2.5rem', 
        fontWeight: 'bold', 
        color: '#333', 
        marginBottom: '20px' 
      }}>
        Welcome to Healthcare Portal
      </h1>
      <p style={{ 
        fontSize: '1.2rem', 
        color: '#555', 
        lineHeight: '1.6' 
      }}>
        Explore our services for patients and doctors. Book appointments, read health blogs, and manage your healthcare needs seamlessly.
      </p>
    </div>
  );
};

export default Home;