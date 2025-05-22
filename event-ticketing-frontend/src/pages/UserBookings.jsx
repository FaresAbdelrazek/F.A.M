import React, { useEffect, useState, useContext } from 'react';
import axios from '../services/api';
import Loader from '../components/Loader';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const UserBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        // Using the correct endpoint based on your backend routes
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
        <p>Please login to view your bookings.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>My Bookings</h2>
      
      {bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>You have no bookings yet.</p>
          <a href="/events" className="btn btn-primary" style={{ marginTop: '15px' }}>
            Browse Events
          </a>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Date</th>
                <th>Tickets</th>
                <th>Price per Ticket</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking._id}>
                  <td>
                    <strong>{booking.event?.title || 'Event Not Found'}</strong>
                    <br />
                    <small style={{ color: '#666' }}>
                      {booking.event?.location || 'Location not available'}
                    </small>
                  </td>
                  <td>
                    {booking.event?.date 
                      ? new Date(booking.event.date).toLocaleDateString() + ' ' + 
                        new Date(booking.event.date).toLocaleTimeString()
                      : 'Date not available'
                    }
                  </td>
                  <td>{booking.numberOfTickets}</td>
                  <td>${booking.event?.ticketPrice?.toFixed(2) || '0.00'}</td>
                  <td>${booking.totalPrice?.toFixed(2) || '0.00'}</td>
                  <td>
                    <span className={`status-badge status-${booking.status}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    {booking.status === 'confirmed' ? (
                      <button 
                        onClick={() => cancelBooking(booking._id)}
                        className="btn btn-danger"
                        style={{ fontSize: '12px' }}
                      >
                        Cancel
                      </button>
                    ) : (
                      <span style={{ color: '#666' }}>N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {bookings.length > 0 && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ color: '#666' }}>
            Total Bookings: {bookings.length} | 
            Active: {bookings.filter(b => b.status === 'confirmed').length} | 
            Canceled: {bookings.filter(b => b.status === 'canceled').length}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserBookings;