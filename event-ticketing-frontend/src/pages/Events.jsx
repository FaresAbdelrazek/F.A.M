import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import EventCard from '../components/EventCard';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState(''); // ADD THIS LINE - the missing date filter

  useEffect(() => {
    async function fetchEvents() {
      try {
        console.log('Fetching events...');
        const res = await axios.get('/events');
        console.log('Events response:', res.data);
        
        if (res.data && res.data.events) {
          setEvents(res.data.events);
          setError(null);
        } else {
          console.warn('No events found in response:', res.data);
          setEvents([]);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setError(`Failed to load events: ${error.response?.data?.message || error.message}`);
        toast.error('Failed to load events');
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const retryFetch = () => {
    setLoading(true);
    setError(null);
    window.location.reload();
  };

  // UPDATED: Filter events by search term, category, location, AND DATE
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? event.category === categoryFilter : true;
    const matchesLocation = locationFilter ? event.location.toLowerCase().includes(locationFilter.toLowerCase()) : true;
    
    // ADD THIS: Date filter logic
    const matchesDate = dateFilter ? 
      new Date(event.date).toDateString() === new Date(dateFilter).toDateString() : true;
    
    return matchesSearch && matchesCategory && matchesLocation && matchesDate;
  });

  // Get unique categories and locations for filter options
  const categories = [...new Set(events.map(event => event.category))];
  const locations = [...new Set(events.map(event => event.location))];

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="page">
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          color: 'red'
        }}>
          <h2>Error Loading Events</h2>
          <p>{error}</p>
          <button 
            onClick={retryFetch}
            className="btn btn-primary"
            style={{ marginTop: '15px' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px',
        borderBottom: '2px solid #007bff',
        paddingBottom: '15px'
      }}>
        <h2 style={{ margin: 0, color: '#333' }}>Browse Events</h2>
        <div style={{ 
          background: 'linear-gradient(135deg, #007bff, #0056b3)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          {filteredEvents.length} Events Available
        </div>
      </div>

      {/* Enhanced Search and Filter Section */}
      <div style={{
        background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        marginBottom: '30px',
        border: '1px solid #dee2e6'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '15px',
          alignItems: 'end'
        }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#495057'
            }}>
              🔍 Search Events
            </label>
            <input
              type="text"
              placeholder="Search by event name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #dee2e6',
                borderRadius: '8px',
                fontSize: '14px',
                transition: 'border-color 0.3s ease',
                backgroundColor: 'white'
              }}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#dee2e6'}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#495057'
            }}>
              📂 Category
            </label>
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #dee2e6',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#495057'
            }}>
              📍 Location
            </label>
            <input
              type="text"
              placeholder="Filter by location..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #dee2e6',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white'
              }}
              onFocus={(e) => e.target.style.borderColor = '#007bff'}
              onBlur={(e) => e.target.style.borderColor = '#dee2e6'}
            />
          </div>

          {/* ADD THIS: Date Filter Input */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600',
              color: '#495057'
            }}>
              📅 Date
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #dee2e6',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
            />
          </div>

          {/* UPDATED: Include dateFilter in clear conditions */}
          {(searchTerm || categoryFilter || locationFilter || dateFilter) && (
            <div>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('');
                  setLocationFilter('');
                  setDateFilter(''); // ADD THIS LINE
                }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'linear-gradient(135deg, #6c757d, #495057)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                ✨ Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '25px',
        padding: '15px 20px',
        background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
        borderRadius: '10px',
        border: '1px solid #2196f3'
      }}>
        <p style={{ 
          margin: 0, 
          color: '#1565c0',
          fontWeight: '600',
          fontSize: '16px'
        }}>
          📊 Showing {filteredEvents.length} of {events.length} events
        </p>
        
        {filteredEvents.length > 0 && (
          <p style={{ 
            margin: 0, 
            color: '#1565c0',
            fontSize: '14px'
          }}>
            {categories.length} categories • {locations.length} locations
          </p>
        )}
      </div>

      {/* Events Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '25px',
        marginTop: '20px'
      }}>
        {filteredEvents.length === 0 && events.length === 0 ? (
          <div style={{ 
            gridColumn: '1 / -1', 
            textAlign: 'center', 
            padding: '60px 20px',
            background: 'linear-gradient(135deg, #fff3e0, #ffe0b2)',
            borderRadius: '15px',
            border: '2px dashed #ff9800'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎭</div>
            <h3 style={{ color: '#e65100', marginBottom: '10px' }}>No Events Available</h3>
            <p style={{ color: '#ef6c00', marginBottom: '20px' }}>
              No events are currently available. Events need to be approved by an admin before they appear here.
            </p>
            <div style={{ 
              background: 'rgba(255, 152, 0, 0.1)',
              padding: '15px',
              borderRadius: '8px',
              color: '#e65100'
            }}>
              💡 Tip: Check back later or contact an organizer to create new events!
            </div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div style={{ 
            gridColumn: '1 / -1', 
            textAlign: 'center', 
            padding: '40px 20px',
            background: 'linear-gradient(135deg, #fce4ec, #f8bbd9)',
            borderRadius: '15px',
            border: '2px solid #e91e63'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔍</div>
            <h3 style={{ color: '#ad1457', marginBottom: '15px' }}>No Events Match Your Search</h3>
            <p style={{ color: '#c2185b', marginBottom: '20px' }}>
              Try adjusting your search criteria or browse all events.
            </p>
            {(searchTerm || categoryFilter || locationFilter || dateFilter) && (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('');
                  setLocationFilter('');
                  setDateFilter(''); // ADD THIS LINE
                }}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #e91e63, #ad1457)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                🎯 View All Events
              </button>
            )}
          </div>
        ) : (
          filteredEvents.map(event => (
            <div key={event._id} style={{
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <EventCard event={event} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Events;