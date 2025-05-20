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

      {user ? (
        event.remainingTickets > 0 ? (
          <BookTicketForm
            eventId={id}
            maxTickets={event.remainingTickets}
            price={event.ticketPrice}
          />
        ) : (
          <p>Sold Out</p>
        )
      ) : (
        <p>
          Please <Link to="/login">login</Link> to book tickets.
        </p>
      )}
    </div>
  );
};

export default EventDetails;
