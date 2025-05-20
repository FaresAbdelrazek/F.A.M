import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
      <Link to="/events" style={{ marginRight: '15px' }}>Events</Link>

      {user ? (
        <>
          <span>Hello, {user.name}</span>
          <button onClick={logout} style={{ marginLeft: '15px' }}>Logout</button>
          {user.role === 'Organizer' && <Link to="/my-events" style={{ marginLeft: '15px' }}>My Events</Link>}
          {user.role === 'Admin' && <Link to="/admin/users" style={{ marginLeft: '15px' }}>Admin Dashboard</Link>}
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginLeft: '15px' }}>Login</Link>
          <Link to="/register" style={{ marginLeft: '15px' }}>Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
