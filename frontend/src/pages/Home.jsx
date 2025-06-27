import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const features = [
    {
      title: 'Book Appointments',
      description: 'Easily schedule appointments with top doctors in various specialties.',
      link: '/login', // Redirect to login for patient/doctor access
      icon: '🩺',
    },
    {
      title: 'Health Blogs',
      description: 'Stay informed with expert-written articles on mental health, heart disease, and more.',
      link: '/login',
      icon: '📝',
    },
    {
      title: 'Manage Profile',
      description: 'Update your personal information and track your healthcare journey.',
      link: '/login',
      icon: '👤',
    },
  ];

  return (
    <div
      style={{
        backgroundImage: `url("/src/assets/Login.jpg")`,
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
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <motion.h1
          variants={childVariants}
          style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#1e3a8a',
            textAlign: 'center',
            marginBottom: '20px',
          }}
        >
          Welcome to Healthcare Portal
        </motion.h1>
        <motion.p
          variants={childVariants}
          style={{
            fontSize: '1.2rem',
            color: '#4b5563',
            lineHeight: '1.6',
            textAlign: 'center',
            marginBottom: '30px',
            maxWidth: '800px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Our Healthcare Portal connects patients and doctors for seamless healthcare management. Book appointments with trusted professionals, explore expert health blogs on topics like mental health and heart disease, and manage your medical profile—all in one place. Designed for ease and accessibility, we empower you to take control of your health journey.
        </motion.p>
        <motion.div
          variants={childVariants}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
            marginBottom: '40px',
          }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/login"
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                backgroundColor: '#3b82f6',
                color: '#fff',
                borderRadius: '4px',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: '500',
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#2563eb')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#3b82f6')}
            >
              Get Started
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/about"
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                backgroundColor: '#6b7280',
                color: '#fff',
                borderRadius: '4px',
                textDecoration: 'none',
                fontSize: '1rem',
                fontWeight: '500',
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#4b5563')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#6b7280')}
            >
              Learn More
            </Link>
          </motion.div>
        </motion.div>
        <motion.div
          variants={childVariants}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
          }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={childVariants}
              whileHover={{ scale: 1.02, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)' }}
              style={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                padding: '20px',
                textAlign: 'center',
              }}
            >
              <motion.div
                style={{
                  fontSize: '2rem',
                  marginBottom: '10px',
                }}
              >
                {feature.icon}
              </motion.div>
              <h3
                style={{
                  fontSize: '1.5rem',
                  color: '#1e3a8a',
                  marginBottom: '10px',
                  fontWeight: '500',
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  fontSize: '1rem',
                  color: '#4b5563',
                  marginBottom: '15px',
                }}
              >
                {feature.description}
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to={feature.link}
                  style={{
                    display: 'inline-block',
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
                  Explore
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;