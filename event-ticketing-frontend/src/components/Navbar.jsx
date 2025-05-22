import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/events');
  };

  return (
    <nav style={{ 
      padding: '15px 20px', 
      borderBottom: '2px solid #ddd',
      backgroundColor: '#f8f9fa',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link 
          to="/events" 
          style={{ 
            fontSize: '24px',
            fontWeight: 'bold',
            textDecoration: 'none',
            color: '#007bff'
          }}
        >
          EventTicket
        </Link>
        
        <Link 
          to="/events" 
          style={{ 
            marginLeft: '15px',
            textDecoration: 'none',
            color: '#333',
            fontWeight: '500'
          }}
        >
          Browse Events
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {user ? (
          <>
            <span style={{ color: '#666' }}>Hello, {user.name}</span>
            
            {/* Common links for all authenticated users */}
            <Link 
              to="/profile" 
              style={{ textDecoration: 'none', color: '#007bff' }}
            >
              Profile
            </Link>

            {/* Standard User specific links */}
            {user.role === 'Standard User' && (
              <Link 
                to="/bookings" 
                style={{ textDecoration: 'none', color: '#007bff' }}
              >
                My Bookings
              </Link>
            )}

            {/* Organizer specific links */}
            {user.role === 'Organizer' && (
              <>
                <Link 
                  to="/my-events" 
                  style={{ textDecoration: 'none', color: '#007bff' }}
                >
                  My Events
                </Link>
                <Link 
                  to="/create-event" 
                  style={{ textDecoration: 'none', color: '#28a745' }}
                >
                  Create Event
                </Link>
                <Link 
                  to="/analytics" 
                  style={{ textDecoration: 'none', color: '#007bff' }}
                >
                  Analytics
                </Link>
              </>
            )}

            {/* Admin specific links */}
            {user.role === 'Admin' && (
              <>
                <Link 
                  to="/admin/events" 
                  style={{ textDecoration: 'none', color: '#dc3545' }}
                >
                  Manage Events
                </Link>
                <Link 
                  to="/admin/users" 
                  style={{ textDecoration: 'none', color: '#dc3545' }}
                >
                  Manage Users
                </Link>
              </>
            )}

            <button 
              onClick={handleLogout}
              style={{ 
                padding: '8px 16px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              style={{ 
                textDecoration: 'none', 
                color: '#007bff',
                marginRight: '10px'
              }}
            >
              Login
            </Link>
            <Link 
              to="/register" 
              style={{ 
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;