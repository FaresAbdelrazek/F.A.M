import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  return (
    <div className="event-card" style={{
      border: '1px solid #ccc',
      padding: '16px',
      marginBottom: '12px',
      borderRadius: '8px',
      boxShadow: '2px 2px 8px rgba(0,0,0,0.1)'
    }}>
      <h3>{event.title}</h3>
      <p>Date: {new Date(event.date).toLocaleDateString()}</p>
      <p>Location: {event.location}</p>
      <p>Price: ${event.ticketPrice}</p>
      <Link to={`/events/${event._id}`} style={{ color: 'blue', textDecoration: 'underline' }}>
        View Details
      </Link>
    </div>
  );
};

export default EventCard;
