import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const PatientBlogList = () => {
  const [blogsByCategory, setBlogsByCategory] = useState({});
  const [error, setError] = useState(null);
  const { authState } = useContext(AuthContext);
  const { isAuthenticated, userType, accessToken } = authState;
  const navigate = useNavigate();
  const renderCount = useRef(0);

  const fetchBlogs = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/patient/blogs/', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setBlogsByCategory(response.data);
    } catch (err) {
      console.error('Fetch Error:', err.response?.data);
      setError(err.response?.data?.error || 'Failed to fetch blogs');
    }
  }, [accessToken]);

  useEffect(() => {
    renderCount.current += 1;
    console.log(`PatientBlogList rendered ${renderCount.current} times`);

    if (!isAuthenticated || userType !== 'patient') {
      navigate('/login');
    } else {
      fetchBlogs();
    }
  }, [isAuthenticated, userType, fetchBlogs, navigate]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

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
        <motion.h2
          variants={childVariants}
          style={{ fontSize: '1.8rem', color: '#1e3a8a', textAlign: 'center', marginBottom: '20px' }}
        >
          🩺 Health Blogs by Category
        </motion.h2>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ color: '#ef4444', textAlign: 'center', marginBottom: '15px', fontSize: '0.875rem' }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
        {Object.keys(blogsByCategory).length > 0 ? (
          Object.entries(blogsByCategory).map(([category, blogs]) => (
            <motion.div key={category} variants={childVariants} style={{ marginBottom: '30px' }}>
              <motion.h3
                style={{ fontSize: '1.5rem', color: '#1e3a8a', marginBottom: '15px' }}
              >
                {category}
              </motion.h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                  gap: '20px',
                  minHeight: '200px',
                }}
              >
                {blogs.map((blog) => (
                  <motion.div
                    key={blog.id}
                    variants={childVariants}
                    whileHover={{ scale: 1.02, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)' }}
                    style={{
                      backgroundColor: '#fff',
                      borderRadius: '8px',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '450px',
                    }}
                  >
                    {blog.image ? (
                      <img
                        src={blog.image.startsWith('/media/') ? `http://localhost:8000${blog.image}` : blog.image}
                        alt={blog.title}
                        style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }}
                        onError={(e) => { e.target.src = '/assets/placeholder.jpg'; console.error('Image failed to load:', blog.image); }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '220px',
                          backgroundColor: '#f3f4f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#4b5563',
                          fontSize: '0.875rem',
                        }}
                      >
                        No Image Available
                      </div>
                    )}
                    <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h5
                        style={{
                          fontSize: '1.2rem',
                          color: '#1e3a8a',
                          marginBottom: '10px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {blog.title}
                      </h5>
                      <p
                        style={{
                          color: '#4b5563',
                          marginBottom: '10px',
                          fontSize: '0.875rem',
                          flex: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {blog.summary || 'No summary available'}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: '#4b5563', marginBottom: '10px' }}>
                        By Dr. {blog.author?.username || 'N/A'} |{' '}
                        {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                          to={`/patient/blogs/${blog.id}`}
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
                          Read More
                        </Link>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))
        ) : (
          <motion.p
            variants={childVariants}
            style={{ color: '#4b5563', textAlign: 'center', fontSize: '0.875rem' }}
          >
            No blogs available right now.
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default PatientBlogList;