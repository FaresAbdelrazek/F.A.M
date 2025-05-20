import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMyEvents() {
      try {
        const res = await axios.get('/events/my-events'); // Corrected path here
        setEvents(res.data.events);
      } catch (error) {
        // Handle error appropriately, maybe toast error here
      } finally {
        setLoading(false);
      }
    }
    fetchMyEvents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await axios.delete(`/events/${id}`); // Corrected path here
      setEvents(prev => prev.filter(e => e._id !== id));
    } catch (error) {
      // Handle error appropriately, maybe toast error here
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h2>My Events</h2>
      <Link to="/create-event">Create New Event</Link>
      {events.length === 0 ? (
        <p>No events created yet.</p>
      ) : (
        <ul>
          {events.map(event => (
            <li key={event._id}>
              <h3>{event.title}</h3>
              <p>Status: {event.status}</p>
              <p>Date: {new Date(event.date).toLocaleString()}</p>
              <button onClick={() => navigate(`/edit-event/${event._id}`)}>Edit</button>
              <button onClick={() => handleDelete(event._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyEvents;
