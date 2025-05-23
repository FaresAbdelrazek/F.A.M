import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/events');
  };

  const isActive = (path) => location.pathname === path;

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <Link to="/events" className="logo">
          🎫 EventTicket
        </Link>
        
        <Link 
          to="/events" 
          className={`nav-link ${isActive('/events') ? 'active' : ''}`}
        >
          🏠 Browse Events
        </Link>
      </div>

      <div className="nav-links">
        {user ? (
          <>
            {/* User Info */}
            <div className="user-info">
              <span>Hello, <strong>{user.name}</strong></span>
              <div className="user-avatar">
                {getUserInitials(user.name)}
              </div>
            </div>
            
            {/* Common links for all authenticated users */}
            <Link 
              to="/profile" 
              className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
            >
              👤 Profile
            </Link>

            {/* Standard User specific links */}
            {user.role === 'Standard User' && (
              <Link 
                to="/bookings" 
                className={`nav-link ${isActive('/bookings') ? 'active' : ''}`}
              >
                🎫 My Bookings
              </Link>
            )}

            {/* Organizer specific links */}
            {user.role === 'Organizer' && (
              <>
                <Link 
                  to="/my-events" 
                  className={`nav-link ${isActive('/my-events') ? 'active' : ''}`}
                >
                  📋 My Events
                </Link>
                <Link 
                  to="/create-event" 
                  className={`nav-link ${isActive('/create-event') ? 'active' : ''}`}
                >
                  ➕ Create Event
                </Link>
                <Link 
                  to="/analytics" 
                  className={`nav-link ${isActive('/analytics') ? 'active' : ''}`}
                >
                  📊 Analytics
                </Link>
              </>
            )}

            {/* Admin specific links */}
            {user.role === 'Admin' && (
              <>
                <Link 
                  to="/admin/events" 
                  className={`nav-link ${isActive('/admin/events') ? 'active' : ''}`}
                >
                  🛠️ Manage Events
                </Link>
                <Link 
                  to="/admin/users" 
                  className={`nav-link ${isActive('/admin/users') ? 'active' : ''}`}
                >
                  👥 Manage Users
                </Link>
              </>
            )}

            <button 
              onClick={handleLogout}
              className="btn btn-danger"
              style={{ 
                fontSize: '0.875rem',
                padding: '0.5rem 1rem'
              }}
            >
              🚪 Logout
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              className={`nav-link ${isActive('/login') ? 'active' : ''}`}
            >
              🔐 Login
            </Link>
            <Link 
              to="/register" 
              className="btn btn-primary"
              style={{
                fontSize: '0.875rem',
                padding: '0.5rem 1rem'
              }}
            >
              ✨ Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;