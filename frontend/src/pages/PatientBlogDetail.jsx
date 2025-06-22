import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PatientBlogDetail = () => {
  const { blog_id } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(null);
  const { authState } = useContext(AuthContext);
  const { isAuthenticated, userType, accessToken } = authState;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || userType !== 'patient') {
      navigate('/login');
    } else {
      const fetchBlog = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/api/patient/blogs/${blog_id}/`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          console.log('Fetched Blog:', response.data);
          console.log('Blog Image URL:', response.data.image);
          setBlog(response.data);

        } catch (err) {
          console.error('Fetch Error:', err.response?.data);
          setError(err.response?.data?.error || 'Failed to fetch blog');
        }
      };
      fetchBlog();
    }
  }, [blog_id, isAuthenticated, userType, accessToken, navigate]);

  if (!isAuthenticated || userType !== 'patient') {
    return null;
  }

  if (!blog) return <div style={{ textAlign: 'center', padding: '20px' }}>{error || 'Loading...'}</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ 
        backgroundColor: '#fff', 
        borderRadius: '8px', 
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
        overflow: 'hidden' 
      }}>
        {blog.image ? (
          <img 
            src={blog.image} 
            alt={blog.title} 
            style={{ width: '100%', height: '300px', objectFit: 'cover' }} 
            onError={(e) => {
              console.error('Image failed to load:', blog.image);
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div style={{ 
            width: '100%', 
            height: '300px', 
            backgroundColor: '#f0f0f0', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: '#666', 
            fontSize: '1rem' 
          }}>
            No Image Available
          </div>
        )}
        <div style={{ padding: '20px' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#333', marginBottom: '10px' }}>{blog.title}</h2>
          <p style={{ color: '#666', marginBottom: '5px' }}><strong>Category:</strong> {blog.category || 'N/A'}</p>
          <p style={{ color: '#666', marginBottom: '5px' }}><strong>By:</strong> Dr. {blog.author?.username || 'N/A'}</p>
          <p style={{ color: '#666', marginBottom: '10px' }}>
            <strong>Published on:</strong> {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
          <hr style={{ border: '1px solid #eee', margin: '10px 0' }} />
          <p style={{ color: '#333', marginBottom: '10px' }}><strong>Summary:</strong> {blog.summary || 'No summary available'}</p>
          <hr style={{ border: '1px solid #eee', margin: '10px 0' }} />
          <p style={{ color: '#333', lineHeight: '1.6' }}>{blog.content || 'No content available'}</p>
          <Link
            to="/patient/blogs"
            style={{ 
              display: 'inline-block', 
              padding: '10px 20px', 
              backgroundColor: '#6c757d', 
              color: '#fff', 
              borderRadius: '4px', 
              textDecoration: 'none', 
              marginTop: '15px' 
            }}
          >
            ← Back to Blogs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PatientBlogDetail;