import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BookTicketForm = ({ eventId, maxTickets, price }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = (e) => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 1) val = 1;
    if (val > maxTickets) val = maxTickets;
    setQuantity(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/v1/bookings', { eventId, quantity });
      toast.success('Tickets booked successfully!');
      // Optionally trigger a parent refresh or redirect
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="book-ticket-form">
      <label>
        Number of Tickets (max {maxTickets}):
        <input
          type="number"
          min="1"
          max={maxTickets}
          value={quantity}
          onChange={handleQuantityChange}
          required
        />
      </label>
      <p>Total Price: ${(quantity * price).toFixed(2)}</p>
      <button type="submit" disabled={loading}>
        {loading ? 'Booking...' : 'Book Tickets'}
      </button>
    </form>
  );
};

export default BookTicketForm;
