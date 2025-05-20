import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all'); // all, approved, pending, declined
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await axios.get('/events/admin'); // Corrected path here
        setEvents(res.data.events);
      } catch (error) {
        toast.error('Failed to fetch events');
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.status === filter;
  });

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/events/${id}/status`, { status }); // Corrected path here
      setEvents(events.map(event =>
        event._id === id ? { ...event, status } : event
      ));
      toast.success(`Event ${status}`);
    } catch (error) {
      toast.error('Failed to update event status');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h2>Manage Events</h2>

      <label>Filter by status: </label>
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="approved">Approved</option>
        <option value="pending">Pending</option>
        <option value="declined">Declined</option>
      </select>

      {filteredEvents.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Organizer</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map(event => (
              <tr key={event._id}>
                <td>{event.title}</td>
                <td>{new Date(event.date).toLocaleString()}</td>
                <td>{event.organizerName || event.organizer?.name || 'N/A'}</td>
                <td>{event.status}</td>
                <td>
                  {event.status === 'pending' && (
                    <>
                      <button onClick={() => updateStatus(event._id, 'approved')}>Approve</button>
                      <button onClick={() => updateStatus(event._id, 'declined')}>Decline</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminEvents;
