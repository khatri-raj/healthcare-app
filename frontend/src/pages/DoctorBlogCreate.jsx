import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const DoctorBlogCreate = () => {
  const [blogData, setBlogData] = useState({
    title: '', image: null, category: 'mental_health', summary: '', content: '', is_draft: true
  });
  const [error, setError] = useState(null);
  const { authState } = useContext(AuthContext);
  const { isAuthenticated, userType, accessToken } = authState;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || userType !== 'doctor') {
      navigate('/login');
    } else {
      try {
        const formData = new FormData();
        for (let key in blogData) {
          formData.append(key, blogData[key]);
        }
        await axios.post('http://localhost:8000/api/doctor/blogs/create/', formData, {
          headers: { 
            Authorization: `Bearer ${accessToken}`, 
            'Content-Type': 'multipart/form-data' 
          }
        });
        navigate('/doctor/blogs');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to create blog');
      }
    }
  };

  if (!isAuthenticated || userType !== 'doctor') {
    return null;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ fontSize: '1.8rem', color: '#333', marginBottom: '20px' }}>Create New Blog Post</h2>
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
            onChange={(e) => setBlogData({ ...blogData, image: e.target.files[0] })}
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
          <label htmlFor="is_draft" style={{ color: '#333' }}>Save as Draft</label>
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
            Submit
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

export default DoctorBlogCreate;