import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axios.get('/users'); // Corrected here
        setUsers(res.data.users);
      } catch (error) {
        toast.error('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    try {
      await axios.put(`/users/${id}/role`, { role: newRole }); // Corrected here
      setUsers(users.map(user => user._id === id ? { ...user, role: newRole } : user));
      toast.success('User role updated');
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`/users/${id}`); // Corrected here
      setUsers(users.filter(user => user._id !== id));
      toast.success('User deleted');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h2>Manage Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Update Role</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  >
                    <option value="User">User</option>
                    <option value="Organizer">Organizer</option>
                    <option value="Admin">Admin</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => handleDelete(user._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUsers;
