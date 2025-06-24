import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const DoctorBlogCreate = () => {
  const [blogData, setBlogData] = useState({
    title: '',
    image: null,
    category: 'mental_health',
    summary: '',
    content: '',
    is_draft: true,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { authState, refreshToken } = useContext(AuthContext);
  const { isAuthenticated, userType, accessToken } = authState;
  const navigate = useNavigate();

  const createFormData = () => {
    const formData = new FormData();
    if (blogData.title) formData.append('title', blogData.title);
    if (blogData.image) formData.append('image', blogData.image);
    if (blogData.category) formData.append('category', blogData.category);
    if (blogData.summary) formData.append('summary', blogData.summary);
    if (blogData.content) formData.append('content', blogData.content);
    formData.append('is_draft', blogData.is_draft.toString());
    return formData;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setBlogData({ ...blogData, image: file });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || userType !== 'doctor') {
      navigate('/login');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const formData = createFormData();
      const response = await axios.post('http://localhost:8000/api/doctor/blogs/create/', formData, {
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'multipart/form-data' },
      });
      setBlogData({
        title: '',
        image: null,
        category: 'mental_health',
        summary: '',
        content: '',
        is_draft: true,
      });
      setImagePreview(null);
      document.getElementById('image').value = '';
      navigate('/doctor/blogs');
    } catch (err) {
      if (err.response?.status === 401) {
        const newToken = await refreshToken();
        if (newToken) {
          try {
            const formData = createFormData();
            await axios.post('http://localhost:8000/api/doctor/blogs/create/', formData, {
              headers: { Authorization: `Bearer ${newToken}`, 'Content-Type': 'multipart/form-data' },
            });
            setBlogData({
              title: '',
              image: null,
              category: 'mental_health',
              summary: '',
              content: '',
              is_draft: true,
            });
            setImagePreview(null);
            document.getElementById('image').value = '';
            navigate('/doctor/blogs');
          } catch (retryErr) {
            setError(JSON.stringify(retryErr.response?.data) || 'Failed to create blog after token refresh');
          }
        } else {
          navigate('/login');
        }
      } else {
        setError(JSON.stringify(err.response?.data) || 'Failed to create blog');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || userType !== 'doctor') {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: "'Inter', sans-serif" }}
    >
      <motion.h2
        variants={childVariants}
        style={{ fontSize: '1.8rem', color: '#1e3a8a', marginBottom: '20px', fontWeight: '600' }}
      >
        Create New Blog Post
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
      <motion.form
        onSubmit={handleSubmit}
        variants={childVariants}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <motion.div variants={childVariants}>
          <label
            htmlFor="title"
            style={{ display: 'block', marginBottom: '5px', color: '#1e3a8a', fontWeight: '500' }}
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={blogData.title}
            onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '1rem',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            disabled={loading}
            onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
            onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
          />
        </motion.div>
        <motion.div variants={childVariants}>
          <label
            htmlFor="image"
            style={{ display: 'block', marginBottom: '5px', color: '#1e3a8a', fontWeight: '500' }}
          >
            Image
          </label>
          {imagePreview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ marginBottom: '10px' }}
            >
              <p style={{ color: '#4b5563', fontSize: '0.875rem' }}>Image Preview:</p>
              <img
                src={imagePreview}
                alt="Preview"
                style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '4px' }}
              />
            </motion.div>
          )}
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            style={{ width: '100%', padding: '10px', fontSize: '0.875rem' }}
            disabled={loading}
          />
        </motion.div>
        <motion.div variants={childVariants}>
          <label
            htmlFor="category"
            style={{ display: 'block', marginBottom: '5px', color: '#1e3a8a', fontWeight: '500' }}
          >
            Category
          </label>
          <select
            id="category"
            value={blogData.category}
            onChange={(e) => setBlogData({ ...blogData, category: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '1rem',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            disabled={loading}
            onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
            onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
          >
            <option value="mental_health">Mental Health</option>
            <option value="heart_disease">Heart Disease</option>
            <option value="covid19">Covid19</option>
            <option value="immunization">Immunization</option>
          </select>
        </motion.div>
        <motion.div variants={childVariants}>
          <label
            htmlFor="summary"
            style={{ display: 'block', marginBottom: '5px', color: '#1e3a8a', fontWeight: '500' }}
          >
            Summary
          </label>
          <textarea
            id="summary"
            value={blogData.summary}
            onChange={(e) => setBlogData({ ...blogData, summary: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '1rem',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              minHeight: '100px',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            disabled={loading}
            onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
            onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
          ></textarea>
        </motion.div>
        <motion.div variants={childVariants}>
          <label
            htmlFor="content"
            style={{ display: 'block', marginBottom: '5px', color: '#1e3a8a', fontWeight: '500' }}
          >
            Content
          </label>
          <textarea
            id="content"
            value={blogData.content}
            onChange={(e) => setBlogData({ ...blogData, content: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '1rem',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              minHeight: '200px',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            disabled={loading}
            onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
            onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
          ></textarea>
        </motion.div>
        <motion.div variants={childVariants} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="checkbox"
            id="is_draft"
            checked={blogData.is_draft}
            onChange={(e) => setBlogData({ ...blogData, is_draft: e.target.checked })}
            style={{ width: '20px', height: '20px' }}
            disabled={loading}
          />
          <label htmlFor="is_draft" style={{ color: '#4b5563' }}>
            Save as Draft
          </label>
        </motion.div>
        <motion.div variants={childVariants} style={{ display: 'flex', gap: '10px' }}>
          <motion.button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
            }}
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.05, backgroundColor: loading ? '#3b82f6' : '#2563eb' }}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </motion.button>
          <Link
            to="/doctor/blogs"
            style={{
              padding: '10px 20px',
              backgroundColor: '#6b7280',
              color: '#fff',
              borderRadius: '4px',
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: '500',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Cancel
          </Link>
        </motion.div>
      </motion.form>
    </motion.div>
  );
};

export default DoctorBlogCreate;