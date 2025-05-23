import React, { useEffect, useState, useContext } from 'react';
import axios from '../services/api';
import Loader from '../components/Loader';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const UserBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, past, cancelled

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await axios.get('/bookings');
        setBookings(res.data.bookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const cancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      await axios.delete(`/bookings/${bookingId}`);
      setBookings(bookings.map(b => 
        b._id === bookingId ? { ...b, status: 'canceled' } : b
      ));
      toast.success('Booking canceled successfully');
    } catch (error) {
      console.error('Error canceling booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  if (loading) return <Loader />;

  if (!user) {
    return (
      <div className="page">
        <div className="text-center" style={{ padding: '3rem' }}>
          <h2 className="page-title">Please Login</h2>
          <p className="page-subtitle">You need to be logged in to view your bookings.</p>
          <a href="/login" className="btn btn-primary mt-4">
            Login Now
          </a>
        </div>
      </div>
    );
  }

  // Filter bookings based on selected filter
  const getFilteredBookings = () => {
    const now = new Date();
    switch (filter) {
      case 'upcoming':
        return bookings.filter(booking => 
          booking.status === 'confirmed' && 
          new Date(booking.event?.date) >= now
        );
      case 'past':
        return bookings.filter(booking => 
          new Date(booking.event?.date) < now
        );
      case 'cancelled':
        return bookings.filter(booking => booking.status === 'canceled');
      default:
        return bookings;
    }
  };

  const filteredBookings = getFilteredBookings();
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(b => b.status === 'confirmed').length;
  const upcomingEvents = bookings.filter(b => 
    b.status === 'confirmed' && new Date(b.event?.date) >= new Date()
  ).length;

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">My Bookings</h1>
        <p className="page-subtitle">Manage your event tickets and bookings</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{totalBookings}</div>
          <div className="stat-label">Total Bookings</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{activeBookings}</div>
          <div className="stat-label">Active Bookings</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{upcomingEvents}</div>
          <div className="stat-label">Upcoming Events</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('all')}
            >
              📋 All Bookings
            </button>
            <button
              className={`btn ${filter === 'upcoming' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('upcoming')}
            >
              📅 Upcoming
            </button>
            <button
              className={`btn ${filter === 'past' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('past')}
            >
              🕒 Past Events
            </button>
            <button
              className={`btn ${filter === 'cancelled' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('cancelled')}
            >
              ❌ Cancelled
            </button>
          </div>
        </div>

        <div className="card-body">
          {filteredBookings.length === 0 ? (
            <div className="text-center" style={{ padding: '3rem' }}>
              {filter === 'all' ? (
                <>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎫</div>
                  <h3 style={{ marginBottom: '1rem', color: 'var(--medium-gray)' }}>
                    No bookings found
                  </h3>
                  <p style={{ marginBottom: '2rem', color: 'var(--medium-gray)' }}>
                    You haven't booked any events yet. Start exploring amazing events!
                  </p>
                  <a href="/events" className="btn btn-primary">
                    📍 Browse Events
                  </a>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                  <h3 style={{ marginBottom: '1rem', color: 'var(--medium-gray)' }}>
                    No {filter} bookings found
                  </h3>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setFilter('all')}
                  >
                    View All Bookings
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="events-grid">
              {filteredBookings.map(booking => {
                const eventDate = new Date(booking.event?.date);
                const isUpcoming = eventDate >= new Date();
                const isPast = eventDate < new Date();

                return (
                  <div key={booking._id} className="event-card">
                    <div className="event-card-image">
                      {isUpcoming ? '🎉' : isPast ? '📅' : '🎫'}
                    </div>
                    
                    <div className="event-card-content">
                      <h3 className="event-title">
                        {booking.event?.title || 'Event Not Found'}
                      </h3>
                      
                      <div className="event-details">
                        <div className="event-detail">
                          <span>📍</span>
                          <span>{booking.event?.location || 'Location not available'}</span>
                        </div>
                        <div className="event-detail">
                          <span>📅</span>
                          <span>
                            {booking.event?.date 
                              ? eventDate.toLocaleDateString() + ' at ' + eventDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                              : 'Date not available'
                            }
                          </span>
                        </div>
                        <div className="event-detail">
                          <span>🎫</span>
                          <span>{booking.numberOfTickets} tickets</span>
                        </div>
                        <div className="event-detail">
                          <span>💰</span>
                          <span>${booking.totalPrice?.toFixed(2) || '0.00'} total</span>
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
                        <span className={`status-badge status-${booking.status}`}>
                          {booking.status}
                        </span>
                        
                        {booking.status === 'confirmed' && isUpcoming && (
                          <button 
                            onClick={() => cancelBooking(booking._id)}
                            className="btn btn-danger"
                            style={{ fontSize: '0.75rem', padding: '0.5rem 1rem' }}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {filteredBookings.length > 0 && (
          <div className="card-footer">
            <div className="text-center" style={{ color: 'var(--medium-gray)' }}>
              <p>
                Showing {filteredBookings.length} of {totalBookings} bookings
                {filter !== 'all' && ` in ${filter} category`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBookings;