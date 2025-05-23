import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import { Link } from 'react-router-dom';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        console.log('Events page: Fetching approved events...');
        
        // This should get approved events for everyone
        const res = await axios.get('/events');
        console.log('Events response:', res.data);
        
        setEvents(res.data.events || []);
        setError(null);
      } catch (error) {
        console.error('Error fetching events:', error);
        console.error('Error details:', error.response);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Loading Events...</h2>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'red' }}>
        <h2>Error Loading Events</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  // Filter only approved events for public display
  const approvedEvents = events.filter(event => event.status === 'approved');

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Browse Events</h1>
        <p className="page-subtitle">Discover amazing events near you</p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <p>Showing {approvedEvents.length} approved events</p>
      </div>

      {approvedEvents.length === 0 ? (
        <div className="card">
          <div className="card-body text-center" style={{ padding: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎭</div>
            <h3 style={{ marginBottom: '1rem' }}>No approved events available</h3>
            <p style={{ marginBottom: '2rem' }}>
              Events are waiting for admin approval or no events have been created yet.
            </p>
          </div>
        </div>
      ) : (
        <div className="events-grid">
          {approvedEvents.map(event => (
            <div key={event._id} className="event-card">
              <div className="event-card-image">
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%'
                }}>
                  <div style={{ fontSize: '3rem' }}>
                    {event.category === 'Music' ? '🎵' : 
                     event.category === 'Sports' ? '⚽' :
                     event.category === 'Art' ? '🎨' : '🎉'}
                  </div>
                </div>
              </div>
              
              <div className="event-card-content">
                <h3 className="event-title">{event.title}</h3>
                
                <div className="event-details">
                  <div className="event-detail">
                    <span>📅</span>
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="event-detail">
                    <span>📍</span>
                    <span>{event.location}</span>
                  </div>
                  <div className="event-detail">
                    <span>🏷️</span>
                    <span>{event.category}</span>
                  </div>
                  <div className="event-detail">
                    <span>🎫</span>
                    <span>{event.remainingTickets} tickets left</span>
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--light-gray)'
                }}>
                  <div className="event-price">${event.ticketPrice}</div>
                  
                  <Link 
                    to={`/events/${event._id}`} 
                    className="btn btn-primary"
                    style={{ textDecoration: 'none', fontSize: '0.875rem' }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f0f0' }}>
        <h4>Debug Info:</h4>
        <p>Total events fetched: {events.length}</p>
        <p>Approved events: {approvedEvents.length}</p>
        <p>Event statuses: {events.map(e => e.status).join(', ')}</p>
      </div>
    </div>
  );
};

export default Events;