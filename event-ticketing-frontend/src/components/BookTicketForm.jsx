// src/components/BookTicketForm.jsx
import React, { useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';

const BookTicketForm = ({ eventId, maxTickets, price }) => {
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (numberOfTickets < 1 || numberOfTickets > maxTickets) {
      toast.error(`Please select between 1 and ${maxTickets} tickets`);
      return;
    }

    setLoading(true);
    try {
      console.log('Booking tickets:', { eventId, numberOfTickets });
      
      const response = await api.post('/bookings', {
        eventId,
        numberOfTickets: parseInt(numberOfTickets)
      });

      console.log('Booking response:', response.data);
      toast.success('Booking successful!');
      
      // Optionally redirect or refresh the page
      window.location.reload();
      
    } catch (error) {
      console.error('Booking error:', error);
      const errorMessage = error.response?.data?.msg || 'Booking failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = numberOfTickets * price;

  return (
    <div className="book-ticket-form">
      <h3>Book Tickets</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="numberOfTickets">Number of Tickets:</label>
          <select
            id="numberOfTickets"
            value={numberOfTickets}
            onChange={(e) => setNumberOfTickets(e.target.value)}
            disabled={loading}
          >
            {Array.from({ length: Math.min(maxTickets, 10) }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <p>Price per ticket: ${price.toFixed(2)}</p>
          <p><strong>Total: ${totalPrice.toFixed(2)}</strong></p>
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Booking...' : 'Book Tickets'}
        </button>
      </form>
    </div>
  );
};

export default BookTicketForm;