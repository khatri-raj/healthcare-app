import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PatientBlogList = () => {
  const [blogsByCategory, setBlogsByCategory] = useState({});
  const [error, setError] = useState(null);
  const { authState } = useContext(AuthContext);
  const { isAuthenticated, userType, accessToken } = authState;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || userType !== 'patient') {
      navigate('/login');
    } else {
      const fetchBlogs = async () => {
        try {
          const response = await axios.get('http://localhost:8000/api/patient/blogs/', {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          setBlogsByCategory(response.data);
        } catch (err) {
          setError(err.response?.data?.error || 'Failed to fetch blogs');
        }
      };
      fetchBlogs();
    }
  }, [isAuthenticated, userType, accessToken, navigate]);

  if (!isAuthenticated || userType !== 'patient') {
    return null;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ 
        fontSize: '1.8rem', 
        color: '#333', 
        textAlign: 'center', 
        marginBottom: '20px' 
      }}>
        🩺 Health Blogs by Category
      </h2>
      {error && (
        <p style={{ color: '#dc3545', textAlign: 'center', marginBottom: '15px' }}>{error}</p>
      )}
      {Object.keys(blogsByCategory).length > 0 ? (
        Object.entries(blogsByCategory).map(([category, blogs]) => (
          <div key={category} style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '1.5rem', color: '#333', marginBottom: '15px' }}>{category}</h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '20px' 
            }}>
              {blogs.map((blog) => (
                <div key={blog.id} style={{ 
                  backgroundColor: '#fff', 
                  borderRadius: '8px', 
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
                  overflow: 'hidden' 
                }}>
                  {blog.image && (
                    <img 
                      src={blog.image} 
                      alt="Blog Image" 
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
                    />
                  )}
                  <div style={{ padding: '15px' }}>
                    <h5 style={{ fontSize: '1.2rem', color: '#333', marginBottom: '10px' }}>{blog.title}</h5>
                    <p style={{ color: '#666', marginBottom: '10px' }}>{blog.summary || 'No summary available'}</p>
                    <p style={{ fontSize: '0.9rem', color: '#666' }}>
                      By Dr. {blog.author?.username || 'N/A'} | {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <Link
                      to={`/patient/blogs/${blog.id}`}
                      style={{ 
                        display: 'inline-block', 
                        padding: '8px 15px', 
                        backgroundColor: '#007bff', 
                        color: '#fff', 
                        borderRadius: '4px', 
                        textDecoration: 'none' 
                      }}
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p style={{ color: '#666', textAlign: 'center' }}>No blogs available right now.</p>
      )}
    </div>
  );
};

export default PatientBlogList;