import React, { useState, useEffect, useContext } from 'react';
import axios from '../services/api';
import { useParams, Link } from 'react-router-dom';
import Loader from '../components/Loader';
import { AuthContext } from '../context/AuthContext';
import BookTicketForm from '../components/BookTicketForm';

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEvent() {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/events/${id}`);
        setEvent(res.data.event);
      } catch (error) {
        setError('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [id]);

  if (loading) return <Loader />;

  if (error) return <p>{error}</p>;

  if (!event) return <p>Event not found.</p>;

  // Check if user is a Standard User (only Standard Users can book tickets)
  const canBookTickets = user && user.role === 'Standard User';

  return (
    <div className="event-details-page">
      <h2>{event.title}</h2>
      <p>Date: {new Date(event.date).toLocaleString()}</p>
      <p>Location: {event.location}</p>
      <p>Description: {event.description}</p>
      <p>Price: ${event.ticketPrice.toFixed(2)}</p>
      <p>
        Tickets Available:{' '}
        {event.remainingTickets > 0 ? event.remainingTickets : 'Sold Out'}
      </p>

      {/* Booking section - only for Standard Users */}
      {canBookTickets ? (
        event.remainingTickets > 0 ? (
          <BookTicketForm
            eventId={id}
            maxTickets={event.remainingTickets}
            price={event.ticketPrice}
          />
        ) : (
          <p>Sold Out</p>
        )
      ) : user && (user.role === 'Organizer' || user.role === 'Admin') ? (
        // Show different message for Organizers and Admins
        <div style={{ 
          background: '#f8f9fa', 
          padding: '20px', 
          borderRadius: '8px', 
          margin: '20px 0',
          border: '1px solid #ddd',
          textAlign: 'center'
        }}>
          <p style={{ color: '#666', margin: 0 }}>
            {user.role === 'Organizer' 
              ? 'As an organizer, you cannot book tickets for events.' 
              : 'As an admin, you cannot book tickets for events.'
            }
          </p>
        </div>
      ) : (
        // Show login prompt for non-authenticated users
        <p>
          Please <Link to="/login">login</Link> as a Standard User to book tickets.
        </p>
      )}
    </div>
  );
};

export default EventDetails;