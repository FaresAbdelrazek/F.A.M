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
        const res = await axios.get('/bookings/user');  // Adjust endpoint as per backend
        setBookings(res.data.bookings);
      } catch (error) {
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
      await axios.put(`/bookings/${bookingId}/cancel`); // Adjust endpoint as per backend
      setBookings(bookings.map(b => b._id === bookingId ? { ...b, status: 'Canceled' } : b));
      toast.success('Booking canceled');
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  if (loading) return <Loader />;

  if (!user) return <p>Please login to view your bookings.</p>;

  return (
    <div>
      <h2>My Bookings</h2>
      {bookings.length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Event</th>
              <th>Quantity</th>
              <th>Price per Ticket</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Cancel</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking._id}>
                <td>{booking.eventTitle}</td>
                <td>{booking.quantity}</td>
                <td>${booking.price.toFixed(2)}</td>
                <td>${(booking.price * booking.quantity).toFixed(2)}</td>
                <td>{booking.status}</td>
                <td>
                  {booking.status === 'Confirmed' ? (
                    <button onClick={() => cancelBooking(booking._id)}>Cancel</button>
                  ) : (
                    'N/A'
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

export default UserBookings;
