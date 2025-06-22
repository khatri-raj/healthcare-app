import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const DoctorBlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState(null);
  const { authState } = useContext(AuthContext);
  const { isAuthenticated, userType, accessToken } = authState;
  const navigate = useNavigate();
  const renderCount = useRef(0);

  const fetchBlogs = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/doctor/blogs/', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      console.log('Fetched Doctor Blogs:', response.data);
      setBlogs(response.data.blogs || []);
    } catch (err) {
      console.error('Fetch Error:', err.response?.data);
      setError(err.response?.data?.error || 'Failed to fetch blogs');
    }
  }, [accessToken]);

  useEffect(() => {
    renderCount.current += 1;
    console.log(`DoctorBlogList rendered ${renderCount.current} times`);

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
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setBlogs(blogs.filter(blog => blog.id !== blogId));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete blog');
    }
  };

  if (!isAuthenticated || userType !== 'doctor') {
    return null;
  }

  return (
    <div className="blog-list-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
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
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <h5 style={{ fontSize: '1.2rem', margin: 0 }}>{post.title}</h5>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ 
                    padding: '5px 10px', 
                    borderRadius: '4px', 
                    backgroundColor: post.is_draft ? '#ffc107' : '#28a745', 
                    color: post.is_draft ? '#333' : '#fff', 
                    fontSize: '0.875rem' 
                  }}>
                    {post.is_draft ? 'Draft' : 'Published'}
                  </span>
                  <Link to={`/doctor/blogs/edit/${post.id}`} style={{ 
                    padding: '5px 10px', 
                    backgroundColor: '#ffc107', 
                    color: '#333', 
                    borderRadius: '4px', 
                    textDecoration: 'none', 
                    fontSize: '0.875rem' 
                  }}>
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(post.id)} 
                    style={{ 
                      padding: '5px 10px', 
                      backgroundColor: '#dc3545', 
                      color: '#fff', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: 'pointer', 
                      fontSize: '0.875rem' 
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                {post.category || 'N/A'} | {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </small>
              {post.image ? (
                <img 
                  src={post.image.startsWith('/media/') ? `http://localhost:8000${post.image}` : post.image}
                  alt={post.title || 'Blog image'} 
                  style={{ 
                    maxHeight: '200px', 
                    width: '100%', 
                    objectFit: 'cover', 
                    marginTop: '10px', 
                    borderRadius: '4px',
                    display: 'block'
                  }} 
                  onError={(e) => {
                    console.error('Image failed to load:', post.image);
                    e.target.src = '/assets/placeholder.jpg';
                  }}
                  onLoad={() => console.log('Image loaded:', post.image)}
                />
              ) : (
                <div style={{ 
                  width: '100%', 
                  height: '200px', 
                  backgroundColor: '#f0f0f0', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: '#666', 
                  fontSize: '0.9rem',
                  marginTop: '10px'
                }}>
                  No Image Available
                </div>
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