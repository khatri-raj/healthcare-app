import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { authState, logout } = useContext(AuthContext);
  const { isAuthenticated, userType } = authState;
  const navigate = useNavigate();

  console.log('Navbar Auth State:', { isAuthenticated, userType });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ 
      backgroundColor: '#ffffff', 
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
      position: 'sticky', 
      top: 0, 
      zIndex: 1000 
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '10px 20px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <Link to="/" style={{ 
          fontWeight: 'bold', 
          color: '#007bff', 
          fontSize: '1.5rem', 
          textDecoration: 'none' 
        }}>
          Healthcare App
        </Link>
        <div style={{ display: 'flex', gap: '15px' }}>
          <Link to="/" style={{ 
            fontSize: '1.1rem', 
            color: '#333', 
            textDecoration: 'none', 
            padding: '10px',
            transition: 'color 0.3s' 
          }}
          onMouseEnter={(e) => e.target.style.color = '#007bff'}
          onMouseLeave={(e) => e.target.style.color = '#333'}
          >
            Home
          </Link>
          {isAuthenticated ? (
            <>
              {userType === 'patient' && (
                <>
                  <Link to="/patient/dashboard" style={{ 
                    fontSize: '1.1rem', 
                    color: '#333', 
                    textDecoration: 'none', 
                    padding: '10px',
                    transition: 'color 0.3s' 
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#007bff'}
                  onMouseLeave={(e) => e.target.style.color = '#333'}
                  >
                    🏠 Dashboard
                  </Link>
                  <Link to="/patient/blogs" style={{ 
                    fontSize: '1.1rem', 
                    color: '#333', 
                    textDecoration: 'none', 
                    padding: '10px',
                    transition: 'color 0.3s' 
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#007bff'}
                  onMouseLeave={(e) => e.target.style.color = '#333'}
                  >
                    📰 Read Health Blogs
                  </Link>
                  <Link to="/patient/doctors" style={{ 
                    fontSize: '1.1rem', 
                    color: '#333', 
                    textDecoration: 'none', 
                    padding: '10px',
                    transition: 'color 0.3s' 
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#007bff'}
                  onMouseLeave={(e) => e.target.style.color = '#333'}
                  >
                    👨‍⚕️ Find Doctors
                  </Link>
                </>
              )}
              {userType === 'doctor' && (
                <>
                  <Link to="/doctor/dashboard" style={{ 
                    fontSize: '1.1rem', 
                    color: '#333', 
                    textDecoration: 'none', 
                    padding: '10px',
                    transition: 'color 0.3s' 
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#007bff'}
                  onMouseLeave={(e) => e.target.style.color = '#333'}
                  >
                    🏥 Dashboard
                  </Link>
                  <Link to="/doctor/blogs/create" style={{ 
                    fontSize: '1.1rem', 
                    color: '#333', 
                    textDecoration: 'none', 
                    padding: '10px',
                    transition: 'color 0.3s' 
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#007bff'}
                  onMouseLeave={(e) => e.target.style.color = '#333'}
                  >
                    ✍️ Create Blog
                  </Link>
                  <Link to="/doctor/blogs" style={{ 
                    fontSize: '1.1rem', 
                    color: '#333', 
                    textDecoration: 'none', 
                    padding: '10px',
                    transition: 'color 0.3s' 
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#007bff'}
                  onMouseLeave={(e) => e.target.style.color = '#333'}
                  >
                    📄 My Blog Posts
                  </Link>
                </>
              )}
              <button onClick={handleLogout} style={{ 
                fontSize: '1.1rem', 
                color: '#333', 
                background: 'none', 
                border: 'none', 
                padding: '10px', 
                cursor: 'pointer',
                transition: 'color 0.3s' 
              }}
              onMouseEnter={(e) => e.target.style.color = '#dc3545'}
              onMouseLeave={(e) => e.target.style.color = '#333'}
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ 
                fontSize: '1.1rem', 
                color: '#333', 
                textDecoration: 'none', 
                padding: '10px',
                transition: 'color 0.3s' 
              }}
              onMouseEnter={(e) => e.target.style.color = '#007bff'}
              onMouseLeave={(e) => e.target.style.color = '#333'}
              >
                🔐 Login
              </Link>
              <Link to="/signup" style={{ 
                fontSize: '1.1rem', 
                color: '#333', 
                textDecoration: 'none', 
                padding: '10px',
                transition: 'color 0.3s' 
              }}
              onMouseEnter={(e) => e.target.style.color = '#007bff'}
              onMouseLeave={(e) => e.target.style.color = '#333'}
              >
                📝 Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;