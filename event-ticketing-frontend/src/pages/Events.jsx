import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import EventCard from '../components/EventCard';
import Loader from '../components/Loader';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await axios.get('/events?status=approved');
        setEvents(res.data.events);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  // Filter events by search term, category, and location
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? event.category === categoryFilter : true;
    const matchesLocation = locationFilter ? event.location.toLowerCase().includes(locationFilter.toLowerCase()) : true;
    return matchesSearch && matchesCategory && matchesLocation;
  });

  // Get unique categories and locations for filter options
  const categories = [...new Set(events.map(event => event.category))];
  const locations = [...new Set(events.map(event => event.location))];

  if (loading) return <Loader />;

  return (
    <div className="page">
      <h2>Browse Events</h2>

      {/* Search and Filter Section */}
      <div className="search-filters">
        <input
          type="text"
          placeholder="Search events by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Filter by location..."
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        />

        {(searchTerm || categoryFilter || locationFilter) && (
          <button 
            className="btn btn-secondary"
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('');
              setLocationFilter('');
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Results Summary */}
      <p style={{ marginBottom: '20px', color: '#666' }}>
        Showing {filteredEvents.length} of {events.length} events
      </p>

      {/* Events List */}
      <div className="events-list">
        {filteredEvents.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
            <p>No events found matching your criteria.</p>
            {(searchTerm || categoryFilter || locationFilter) && (
              <button 
                className="btn btn-primary"
                style={{ marginTop: '10px' }}
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('');
                  setLocationFilter('');
                }}
              >
                View All Events
              </button>
            )}
          </div>
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