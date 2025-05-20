import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import EventCard from '../components/EventCard';
import Loader from '../components/Loader';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await axios.get('/events?status=approved');
        setEvents(res.data.events);
      } catch (error) {
        // Handle error appropriately
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  // Filter events by search term and category
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? event.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <Loader />;

  return (
    <div className="events-page">
      <h2>Approved Events</h2>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search events..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Category filter (example categories) */}
      <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
        <option value="">All Categories</option>
        <option value="Music">Music</option>
        <option value="Art">Art</option>
        <option value="Sports">Sports</option>
        {/* Add more categories as needed */}
      </select>

      <div className="events-list">
        {filteredEvents.length === 0 ? (
          <p>No events found.</p>
        ) : (
          filteredEvents.map(event => (
            <EventCard key={event._id} event={event} />
          ))
        )}
      </div>
    </div>
  );
};

export default Events;
