import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const DoctorBlogEdit = () => {
  const { blog_id } = useParams();
  const [blogData, setBlogData] = useState({
    title: '',
    image: null,
    category: 'mental_health',
    summary: '',
    content: '',
    is_draft: true
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { authState, refreshToken } = useContext(AuthContext);
  const { isAuthenticated, userType, accessToken } = authState;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || userType !== 'doctor') {
      navigate('/login');
    } else {
      const fetchBlog = async (token = accessToken) => {
        try {
          console.log('Fetching blog ID:', blog_id);
          console.log('Access Token:', token);
          const response = await axios.get(`http://localhost:8000/api/doctor/blogs/${blog_id}/`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log('Fetched Blog Data:', response.data);
          setBlogData({
            title: response.data.title || '',
            image: null, // Image is handled separately
            category: response.data.category || 'mental_health',
            summary: response.data.summary || '',
            content: response.data.content || '',
            is_draft: response.data.is_draft || false
          });
          setLoading(false);
        } catch (err) {
          console.error('Fetch Error:', err.response?.data);
          if (err.response?.status === 401) {
            const newToken = await refreshToken();
            if (newToken) {
              fetchBlog(newToken); // Retry with new token
            } else {
              navigate('/login');
            }
          } else {
            setError(JSON.stringify(err.response?.data) || 'Failed to fetch blog');
            setLoading(false);
          }
        }
      };
      fetchBlog();
    }
  }, [blog_id, isAuthenticated, userType, accessToken, navigate, refreshToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || userType !== 'doctor') {
      navigate('/login');
    } else {
      try {
        const formData = new FormData();
        if (blogData.title) formData.append('title', blogData.title);
        if (blogData.image) formData.append('image', blogData.image);
        if (blogData.category) formData.append('category', blogData.category);
        if (blogData.summary) formData.append('summary', blogData.summary);
        if (blogData.content) formData.append('content', blogData.content); // Fixed syntax
        formData.append('is_draft', blogData.is_draft.toString());

        // Log FormData for debugging
        for (let [key, value] of formData.entries()) {
          console.log(`${key}: ${value instanceof File ? value.name : value}`);
        }

        const response = await axios.patch(`http://localhost:8000/api/doctor/blogs/${blog_id}/`, formData, {
          headers: { 
            Authorization: `Bearer ${accessToken}`, 
            'Content-Type': 'multipart/form-data' 
          }
        });
        console.log('Update Response:', response.data);
        navigate('/doctor/blogs');
      } catch (err) {
        console.error('Update Error:', err.response?.data);
        if (err.response?.status === 401) {
          const newToken = await refreshToken();
          if (newToken) {
            try {
              const formData = new FormData();
              if (blogData.title) formData.append('title', blogData.title);
              if (blogData.image) formData.append('image', blogData.image);
              if (blogData.category) formData.append('category', blogData.category);
              if (blogData.summary) formData.append('summary', blogData.summary);
              if (blogData.content) formData.append('content', blogData.content);
              formData.append('is_draft', blogData.is_draft.toString());
              const retryResponse = await axios.patch(`http://localhost:8000/api/doctor/blogs/${blog_id}/`, formData, {
                headers: { 
                  Authorization: `Bearer ${newToken}`, 
                  'Content-Type': 'multipart/form-data'
                }
              });
              console.log('Retry Response:', retryResponse.data);
              navigate('/doctor/blogs');
            } catch (retryErr) {
              console.error('Retry Error:', retryErr.response?.data);
              setError(JSON.stringify(retryErr.response?.data) || 'Failed to update blog after token refresh');
            }
          } else {
            navigate('/login');
          }
        } else {
          setError(JSON.stringify(err.response?.data) || 'Failed to update blog');
        }
      }
    }
  };

  if (!isAuthenticated || userType !== 'doctor') {
    return null;
  }

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ fontSize: '1.8rem', color: '#333', marginBottom: '20px' }}>Edit Blog Post</h2>
      {error && (
        <p style={{ color: '#dc3545', textAlign: 'center', marginBottom: '15px' }}>{error}</p>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="title" style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Title</label>
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
              border: '1px solid #ccc', 
              borderRadius: '4px' 
            }}
          />
        </div>
        <div>
          <label htmlFor="image" style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              console.log('Selected Image:', file ? file.name : 'None');
              setBlogData({ ...blogData, image: file });
            }}
            style={{ width: '100%', padding: '10px' }}
          />
        </div>
        <div>
          <label htmlFor="category" style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Category</label>
          <select
            id="category"
            value={blogData.category}
            onChange={(e) => setBlogData({ ...blogData, category: e.target.value })}
            required
            style={{ 
              width: '100%', 
              padding: '10px', 
              fontSize: '1rem', 
              border: '1px solid #ccc', 
              borderRadius: '4px' 
            }}
          >
            <option value="mental_health">Mental Health</option>
            <option value="heart_disease">Heart Disease</option>
            <option value="covid19">Covid19</option>
            <option value="immunization">Immunization</option>
          </select>
        </div>
        <div>
          <label htmlFor="summary" style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Summary</label>
          <textarea
            id="summary"
            value={blogData.summary}
            onChange={(e) => setBlogData({ ...blogData, summary: e.target.value })}
            required
            style={{ 
              width: '100%', 
              padding: '10px', 
              fontSize: '1rem', 
              border: '1px solid #ccc', 
              borderRadius: '4px', 
              minHeight: '100px' 
            }}
          ></textarea>
        </div>
        <div>
          <label htmlFor="content" style={{ display: 'block', marginBottom: '5px', color: '#333' }}>Content</label>
          <textarea
            id="content"
            value={blogData.content}
            onChange={(e) => setBlogData({ ...blogData, content: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '1rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              minHeight: '200px'
            }}
          ></textarea>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="checkbox"
            id="is_draft"
            checked={blogData.is_draft}
            onChange={(e) => setBlogData({ ...blogData, is_draft: e.target.checked })}
            style={{ width: '20px', height: '20px' }}
          />
          <label htmlFor="is_draft" style={{ color: 'inherit' }}>Save as Draft</label>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Update
          </button>
          <Link
            to="/doctor/blogs"
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: '#fff',
              borderRadius: '4px',
              textDecoration: 'none'
            }}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default DoctorBlogEdit;