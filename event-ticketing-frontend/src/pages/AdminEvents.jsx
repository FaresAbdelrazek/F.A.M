import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all'); // all, approved, pending, declined
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        console.log('Fetching admin events from /events/admin...');
        
        // Use the CORRECT admin endpoint
        const res = await axios.get('/events/admin');
        console.log('Admin events response:', res.data);
        
        setEvents(res.data.events || []);
        setError(null);
      } catch (error) {
        console.error('Error fetching admin events:', error);
        console.error('Error response:', error.response);
        
        if (error.response?.status === 403) {
          setError('Access denied. Admin privileges required.');
          toast.error('Access denied. Admin privileges required.');
        } else if (error.response?.status === 401) {
          setError('Please log in to access admin panel.');
          toast.error('Please log in to access admin panel.');
        } else if (error.response?.status === 404) {
          setError('Admin endpoint not found. Please check your backend.');
          toast.error('Admin endpoint not found.');
        } else {
          setError('Failed to fetch events. Please try again.');
          toast.error('Failed to fetch events');
        }
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
      console.log(`Updating event ${id} to status ${status}`);
      await axios.put(`/events/${id}/status`, { status });
      setEvents(events.map(event =>
        event._id === id ? { ...event, status } : event
      ));
      toast.success(`Event ${status} successfully`);
    } catch (error) {
      console.error('Error updating event status:', error);
      toast.error('Failed to update event status');
    }
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="page">
        <div className="text-center" style={{ padding: '3rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem', color: 'var(--error)' }}>⚠️</div>
          <h2 style={{ color: 'var(--error)', marginBottom: '1rem' }}>Error Loading Admin Panel</h2>
          <p style={{ color: 'var(--medium-gray)', marginBottom: '2rem' }}>{error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Admin - Manage Events</h1>
        <p className="page-subtitle">Review and approve events from organizers</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{events.length}</div>
          <div className="stat-label">Total Events</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{events.filter(e => e.status === 'approved').length}</div>
          <div className="stat-label">Approved</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{events.filter(e => e.status === 'pending').length}</div>
          <div className="stat-label">Pending Review</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{events.filter(e => e.status === 'declined').length}</div>
          <div className="stat-label">Declined</div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('all')}
            >
              📋 All Events ({events.length})
            </button>
            <button
              className={`btn ${filter === 'approved' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('approved')}
            >
              ✅ Approved ({events.filter(e => e.status === 'approved').length})
            </button>
            <button
              className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('pending')}
            >
              ⏳ Pending ({events.filter(e => e.status === 'pending').length})
            </button>
            <button
              className={`btn ${filter === 'declined' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('declined')}
            >
              ❌ Declined ({events.filter(e => e.status === 'declined').length})
            </button>
          </div>
        </div>
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <div className="card">
          <div className="card-body text-center" style={{ padding: '3rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
              {filter === 'all' ? '📋' : filter === 'pending' ? '⏳' : filter === 'approved' ? '✅' : '❌'}
            </div>
            <h3 style={{ marginBottom: '1rem', color: 'var(--medium-gray)' }}>
              No {filter === 'all' ? '' : filter} events found
            </h3>
            <p style={{ color: 'var(--medium-gray)' }}>
              {filter === 'all' 
                ? 'No events have been created yet.' 
                : `No events with ${filter} status.`
              }
            </p>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Event Title</th>
                <th>Organizer</th>
                <th>Date</th>
                <th>Location</th>
                <th>Category</th>
                <th>Tickets</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map(event => (
                <tr key={event._id}>
                  <td>
                    <strong>{event.title}</strong>
                    {event.description && (
                      <><br />
                      <small style={{ color: 'var(--medium-gray)' }}>
                        {event.description.substring(0, 50)}...
                      </small></>
                    )}
                  </td>
                  <td>{event.organizerName || event.organizer?.name || 'N/A'}</td>
                  <td>
                    {new Date(event.date).toLocaleDateString()}
                    <br />
                    <small style={{ color: 'var(--medium-gray)' }}>
                      {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </small>
                  </td>
                  <td>{event.location}</td>
                  <td>
                    <span style={{ 
                      background: 'var(--light-blue)', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem'
                    }}>
                      {event.category}
                    </span>
                  </td>
                  <td>
                    {event.remainingTickets}/{event.totalTickets}
                    <br />
                    <small style={{ color: 'var(--medium-gray)' }}>
                      {event.totalTickets - event.remainingTickets} sold
                    </small>
                  </td>
                  <td>${event.ticketPrice}</td>
                  <td>
                    <span className={`status-badge status-${event.status}`}>
                      {event.status}
                    </span>
                  </td>
                  <td>
                    {event.status === 'pending' && (
                      <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                        <button 
                          onClick={() => updateStatus(event._id, 'approved')}
                          className="btn btn-success"
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                        >
                          ✅ Approve
                        </button>
                        <button 
                          onClick={() => updateStatus(event._id, 'declined')}
                          className="btn btn-danger"
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                        >
                          ❌ Decline
                        </button>
                      </div>
                    )}
                    {event.status !== 'pending' && (
                      <span style={{ color: 'var(--medium-gray)', fontSize: '0.75rem' }}>
                        No actions
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;