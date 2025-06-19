import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const DoctorBlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const { authState } = useContext(AuthContext);
  const { isAuthenticated, userType, accessToken } = authState;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || userType !== 'doctor') {
      navigate('/login');
    } else {
      const fetchBlogs = async () => {
        try {
          const response = await axios.get('http://localhost:8000/api/doctor/blogs/', {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          setBlogs(response.data.blogs || []);
        } catch (err) {
          setError(err.response?.data?.error || 'Failed to fetch blogs');
        }
      };
      fetchBlogs();
    }
  }, [isAuthenticated, userType, accessToken, navigate]);

  if (!isAuthenticated || userType !== 'doctor') {
    return null;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px' 
      }}>
        <h2 style={{ fontSize: '1.8rem', color: '#333' }}>My Blog Posts</h2>
        <Link to="/doctor/blogs/create" style={{ 
          padding: '10px 20px', 
          backgroundColor: '#007bff', 
          color: '#fff', 
          borderRadius: '4px', 
          textDecoration: 'none' 
        }}>
          Create New Post
        </Link>
      </div>
      {error && (
        <p style={{ color: '#dc3545', textAlign: 'center', marginBottom: '15px' }}>{error}</p>
      )}
      {blogs.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {blogs.map((post) => (
            <div key={post.id} style={{ 
              backgroundColor: '#fff', 
              padding: '15px', 
              borderRadius: '8px', 
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' 
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <h5 style={{ fontSize: '1.2rem', margin: 0 }}>{post.title}</h5>
                <span style={{ 
                  padding: '5px 10px', 
                  borderRadius: '4px', 
                  backgroundColor: post.is_draft ? '#ffc107' : '#28a745', 
                  color: post.is_draft ? '#333' : '#fff', 
                  fontSize: '0.2rem' 
                }}>
                  {post.is_draft ? 'Draft' : 'Published'}
                </span>
              </div>
              <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                {post.category || 'N/A'} | {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </small>
              {post.image && (
                <img 
                  src={post.image} 
                  alt={post.title} 
                  style={{ maxHeight: '200px', width: '100%', objectFit: 'cover', marginTop: '10px', borderRadius: '4px' }} 
                />
              )}
              <p style={{ marginTop: '10px', color: '#333' }}>{post.summary || 'No summary available'}</p>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: '#666', textAlign: 'center' }}>You have not created any blog posts yet.</p>
      )}
    </div>
  );
};

export default DoctorBlogList;