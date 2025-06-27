import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const DoctorBlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { authState } = useContext(AuthContext);
  const { isAuthenticated, userType, accessToken } = authState;
  const navigate = useNavigate();
  const renderCount = useRef(0);

  const fetchBlogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:8000/api/doctor/blogs/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setBlogs(response.data.blogs || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch blogs');
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    renderCount.current += 1;
    if (!isAuthenticated || userType !== 'doctor') {
      navigate('/login');
    } else {
      fetchBlogs();
    }
  }, [isAuthenticated, userType, fetchBlogs, navigate]);

  const handleDelete = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await axios.delete(`http://localhost:8000/api/doctor/blogs/${blogId}/delete/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setBlogs(blogs.filter((blog) => blog.id !== blogId));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete blog');
    }
  };

  if (!isAuthenticated || userType !== 'doctor') {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2, staggerChildren: 0.03 } },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.15 } },
  };

  const skeletonVariants = {
    hidden: { opacity: 0.5 },
    visible: { opacity: 1, transition: { duration: 0.5, repeat: Infinity, repeatType: 'reverse' } },
  };

  return (
    <div
      style={{
        backgroundImage: `url("/src/assets/DoctorDashboard.jpg")`,
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
          maxWidth: '900px',
          width: '100%',
          margin: '20px',
          padding: '20px',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <motion.div
          variants={childVariants}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            padding: '15px',
            background: '#ffffff',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          }}
        >
          <motion.h2
            style={{
              fontSize: '1.8rem',
              color: '#1e3a8a',
              fontWeight: '700',
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            My Blog Posts
          </motion.h2>
          <Link
            to="/doctor/blogs/create"
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
              color: '#ffffff',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '0.95rem',
              fontWeight: '600',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => (e.target.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.target.style.transform = 'translateY(0)')}
          >
            Create New Blog
          </Link>
        </motion.div>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                color: '#dc2626',
                textAlign: 'center',
                marginBottom: '15px',
                fontSize: '0.9rem',
                background: '#fee2e2',
                padding: '10px',
                borderRadius: '6px',
              }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
        {isLoading ? (
          <motion.div
            style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
          >
            {[...Array(3)].map((_, index) => (
              <motion.div
                key={index}
                variants={skeletonVariants}
                initial="hidden"
                animate="visible"
                style={{
                  background: '#f1f5f9',
                  padding: '20px',
                  borderRadius: '10px',
                  height: '200px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                }}
              />
            ))}
          </motion.div>
        ) : blogs.length > 0 ? (
          <motion.div
            style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
          >
            {blogs.map((post) => (
              <motion.div
                key={post.id}
                variants={childVariants}
                style={{
                  background: '#ffffff',
                  padding: '20px',
                  borderRadius: '10px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.2s ease',
                }}
                whileHover={{ scale: 1.01, boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)' }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px',
                  }}
                >
                  <motion.h5
                    style={{
                      fontSize: '1.25rem',
                      color: '#1e3a8a',
                      margin: 0,
                      fontWeight: '600',
                    }}
                  >
                    {post.title}
                  </motion.h5>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span
                      style={{
                        padding: '5px 10px',
                        borderRadius: '6px',
                        background: post.is_draft ? '#fef3c7' : '#d1fae5',
                        color: post.is_draft ? '#d97706' : '#059669',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                      }}
                    >
                      {post.is_draft ? 'Draft' : 'Published'}
                    </span>
                    <Link
                      to={`/doctor/blogs/edit/${post.id}`}
                      style={{
                        padding: '5px 10px',
                        background: '#fef3c7',
                        color: '#d97706',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.target.style.background = '#fde68a')}
                      onMouseLeave={(e) => (e.target.style.background = '#fef3c7')}
                    >
                      Edit
                    </Link>
                    <motion.button
                      onClick={() => handleDelete(post.id)}
                      style={{
                        padding: '5px 10px',
                        background: '#ef4444',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                      }}
                      whileHover={{ background: '#dc2626' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Delete
                    </motion.button>
                  </div>
                </div>
                <small
                  style={{
                    color: '#6b7280',
                    display: 'block',
                    marginBottom: '10px',
                    fontSize: '0.85rem',
                  }}
                >
                  {post.category || 'N/A'} |{' '}
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </small>
                {post.image ? (
                  <motion.img
                    src={post.image.startsWith('/media/') ? `http://localhost:8000${post.image}` : post.image}
                    alt={post.title || 'Blog image'}
                    loading="lazy"
                    style={{
                      maxHeight: '200px',
                      width: '100%',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: '10px',
                      border: '1px solid #e5e7eb',
                    }}
                    onError={(e) => (e.target.src = '/assets/placeholder.jpg')}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.15 } }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '200px',
                      background: '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#6b7280',
                      fontSize: '0.9rem',
                      borderRadius: '8px',
                      marginBottom: '10px',
                      border: '1px solid #e5e7eb',
                    }}
                  >
                    No Image Available
                  </div>
                )}
                <p
                  style={{
                    color: '#374151',
                    fontSize: '0.95rem',
                    margin: 0,
                    lineHeight: '1.5',
                    display: '-webkit-box',
                    WebkitLineClamp: '3',
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {post.summary || 'No summary available'}
                </p>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.p
            variants={childVariants}
            style={{
              color: '#6b7280',
              textAlign: 'center',
              fontSize: '0.95rem',
              background: '#ffffff',
              padding: '15px',
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            }}
          >
            You have not created any blog posts yet.
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default DoctorBlogList;