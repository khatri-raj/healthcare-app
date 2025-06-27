import React, { useEffect, useState, useContext, Component } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

// Error Boundary Component
class ErrorBoundary extends Component {
  state = { hasError: false, errorMessage: '' };

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            backgroundImage: `url("/src/assets/doctor1.jpg")`,
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
            style={{
              textAlign: 'center',
              padding: '20px',
              fontFamily: "'Inter', sans-serif",
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              maxWidth: '600px',
              width: '100%',
              margin: '20px',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p style={{ color: '#ef4444', fontSize: '1rem' }}>
              Something went wrong: {this.state.errorMessage}
            </p>
            <Link
              to="/patient/blogs"
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                backgroundColor: '#6b7280',
                color: '#fff',
                borderRadius: '4px',
                textDecoration: 'none',
                marginTop: '15px',
                fontSize: '0.875rem',
              }}
            >
              Back to Blogs
            </Link>
          </motion.div>
        </div>
      );
    }
    return this.props.children;
  }
}

const PatientBlogDetail = () => {
  const { blog_id } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { authState } = useContext(AuthContext);
  const { isAuthenticated, userType, accessToken } = authState;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || userType !== 'patient') {
      navigate('/login');
    } else {
      const fetchBlog = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`http://localhost:8000/api/patient/blogs/${blog_id}/`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          if (!response.data || typeof response.data !== 'object') {
            throw new Error('Invalid blog data received');
          }
          setBlog(response.data);
        } catch (err) {
          console.error('Fetch Error:', err.response?.data || err.message);
          setError(err.response?.data?.error || err.message || 'Failed to fetch blog');
        } finally {
          setLoading(false);
        }
      };
      fetchBlog();
    }
  }, [blog_id, isAuthenticated, userType, accessToken, navigate]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  if (!isAuthenticated || userType !== 'patient') {
    return null;
  }

  if (loading) {
    return (
      <div
        style={{
          backgroundImage: `url("/src/assets/doctor1.jpg")`,
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
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: "'Inter', sans-serif",
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            padding: '20px',
            maxWidth: '600px',
            width: '100%',
            margin: '20px',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '4px solid #3b82f6',
              borderTop: '4px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </motion.div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div
        style={{
          backgroundImage: `url("/src/assets/doctor1.jpg")`,
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
          style={{
            textAlign: 'center',
            padding: '20px',
            fontFamily: "'Inter', sans-serif",
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            maxWidth: '600px',
            width: '100%',
            margin: '20px',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p style={{ color: '#ef4444', fontSize: '1rem' }}>
            {error || 'Blog not found.'}
          </p>
          <Link
            to="/patient/blogs"
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              backgroundColor: '#6b7280',
              color: '#fff',
              borderRadius: '4px',
              textDecoration: 'none',
              marginTop: '15px',
              fontSize: '0.875rem',
            }}
          >
            Back to Blogs
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div
        style={{
          backgroundImage: `url("/src/assets/doctor1.jpg")`,
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
            maxWidth: '800px',
            width: '100%',
            margin: '20px',
            padding: '20px',
            fontFamily: "'Inter', sans-serif",
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }}
        >
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
          <motion.div
            variants={childVariants}
            style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
            }}
          >
            {blog.image && typeof blog.image === 'string' ? (
              <motion.img
                src={blog.image.startsWith('/media/') ? `http://localhost:8000${blog.image}` : blog.image}
                alt={blog.title || 'Blog Image'}
                style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = '/assets/placeholder.jpg';
                  console.error('Image failed to load:', blog.image);
                }}
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            ) : (
              <motion.div
                style={{
                  width: '100%',
                  height: '300px',
                  backgroundColor: '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4b5563',
                  fontSize: '1rem',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                No Image Available
              </motion.div>
            )}
            <div style={{ padding: '20px' }}>
              <motion.h2
                variants={childVariants}
                style={{ fontSize: '1.8rem', color: '#1e3a8a', marginBottom: '10px', fontWeight: '600' }}
              >
                {blog.title || 'Untitled Blog'}
              </motion.h2>
              <motion.p variants={childVariants} style={{ color: '#4b5563', marginBottom: '5px', fontSize: '0.875rem' }}>
                <strong>Category:</strong> {blog.category || 'N/A'}
              </motion.p>
              <motion.p variants={childVariants} style={{ color: '#4b5563', marginBottom: '5px', fontSize: '0.875rem' }}>
                <strong>By:</strong> Dr. {blog.author?.username || 'N/A'}
              </motion.p>
              <motion.p variants={childVariants} style={{ color: '#4b5563', marginBottom: '10px', fontSize: '0.875rem' }}>
                <strong>Published on:</strong>{' '}
                {blog.created_at
                  ? new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : 'N/A'}
              </motion.p>
              <motion.hr variants={childVariants} style={{ border: '1px solid #e5e7eb', margin: '10px 0' }} />
              <motion.p variants={childVariants} style={{ color: '#1e3a8a', marginBottom: '10px', fontSize: '0.875rem' }}>
                <strong>Summary:</strong> {blog.summary || 'No summary available'}
              </motion.p>
              <motion.hr variants={childVariants} style={{ border: '1px solid #e5e7eb', margin: '10px 0' }} />
              <motion.p variants={childVariants} style={{ color: '#4b5563', lineHeight: '1.6', fontSize: '1rem' }}>
                {blog.content || 'No content available'}
              </motion.p>
              <motion.div variants={childVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/patient/blogs"
                  style={{
                    display: 'inline-block',
                    padding: '10px 20px',
                    backgroundColor: '#6b7280',
                    color: '#fff',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    marginTop: '15px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = '#4b5563')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = '#6b7280')}
                >
                  ← Back to Blogs
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </ErrorBoundary>
  );
};

export default PatientBlogDetail;