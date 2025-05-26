import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  // Enhanced category icons and colors
  const getCategoryInfo = (category) => {
    const categoryMap = {
      'Music': { icon: '🎵', color: '#9c27b0', bgColor: '#f3e5f5' },
      'Sports': { icon: '⚽', color: '#4caf50', bgColor: '#e8f5e8' },
      'Art': { icon: '🎨', color: '#ff9800', bgColor: '#fff3e0' },
      'Technology': { icon: '💻', color: '#2196f3', bgColor: '#e3f2fd' },
      'Business': { icon: '💼', color: '#607d8b', bgColor: '#eceff1' },
      'Education': { icon: '📚', color: '#795548', bgColor: '#efebe9' },
      'Entertainment': { icon: '🎬', color: '#e91e63', bgColor: '#fce4ec' },
      'Food & Drink': { icon: '🍕', color: '#ff5722', bgColor: '#fbe9e7' },
      'Health & Wellness': { icon: '🏃‍♂️', color: '#4caf50', bgColor: '#e8f5e8' },
      'Other': { icon: '🎉', color: '#9e9e9e', bgColor: '#f5f5f5' }
    };
    
    return categoryMap[category] || categoryMap['Other'];
  };

  // Special event type detection
  const getSpecialIcon = (title, category) => {
    const titleLower = title.toLowerCase();
    
    // Sports specific
    if (category === 'Sports' || titleLower.includes('world cup') || titleLower.includes('cup')) {
      if (titleLower.includes('world cup') || titleLower.includes('football') || titleLower.includes('soccer')) return '⚽';
      if (titleLower.includes('basketball')) return '🏀';
      if (titleLower.includes('tennis')) return '🎾';
      if (titleLower.includes('swimming')) return '🏊‍♂️';
      if (titleLower.includes('running') || titleLower.includes('marathon')) return '🏃‍♂️';
      if (titleLower.includes('boxing')) return '🥊';
      if (titleLower.includes('golf')) return '⛳';
      return '🏆'; // General sports trophy
    }
    
    // Food specific
    if (category === 'Food & Drink' || titleLower.includes('food')) {
      if (titleLower.includes('pizza')) return '🍕';
      if (titleLower.includes('coffee')) return '☕';
      if (titleLower.includes('wine') || titleLower.includes('tasting')) return '🍷';
      if (titleLower.includes('burger')) return '🍔';
      if (titleLower.includes('festival') || titleLower.includes('market')) return '🍽️';
      return '🍕'; // Default food
    }
    
    // Music specific
    if (category === 'Music') {
      if (titleLower.includes('concert')) return '🎤';
      if (titleLower.includes('jazz')) return '🎷';
      if (titleLower.includes('rock')) return '🎸';
      if (titleLower.includes('classical')) return '🎼';
      if (titleLower.includes('festival')) return '🎪';
      return '🎵';
    }
    
    // Entertainment specific
    if (category === 'Entertainment') {
      if (titleLower.includes('movie') || titleLower.includes('film')) return '🎬';
      if (titleLower.includes('theater') || titleLower.includes('play')) return '🎭';
      if (titleLower.includes('comedy')) return '😂';
      if (titleLower.includes('magic')) return '🎩';
      return '🎬';
    }
    
    // Business specific
    if (category === 'Business') {
      if (titleLower.includes('conference')) return '🏢';
      if (titleLower.includes('networking')) return '🤝';
      if (titleLower.includes('startup')) return '🚀';
      if (titleLower.includes('workshop')) return '⚡';
      return '💼';
    }
    
    // Technology specific
    if (category === 'Technology') {
      if (titleLower.includes('ai') || titleLower.includes('artificial')) return '🤖';
      if (titleLower.includes('web') || titleLower.includes('coding')) return '💻';
      if (titleLower.includes('mobile') || titleLower.includes('app')) return '📱';
      if (titleLower.includes('blockchain')) return '⛓️';
      if (titleLower.includes('startup')) return '🚀';
      return '💻';
    }
    
    // Art specific
    if (category === 'Art') {
      if (titleLower.includes('painting')) return '🖼️';
      if (titleLower.includes('sculpture')) return '🗿';
      if (titleLower.includes('gallery')) return '🏛️';
      if (titleLower.includes('craft')) return '✂️';
      return '🎨';
    }
    
    // Education specific
    if (category === 'Education') {
      if (titleLower.includes('workshop')) return '🔧';
      if (titleLower.includes('seminar')) return '👨‍🏫';
      if (titleLower.includes('course')) return '📖';
      if (titleLower.includes('training')) return '💪';
      return '📚';
    }
    
    // Health & Wellness specific
    if (category === 'Health & Wellness') {
      if (titleLower.includes('yoga')) return '🧘‍♀️';
      if (titleLower.includes('fitness') || titleLower.includes('gym')) return '💪';
      if (titleLower.includes('meditation')) return '🕯️';
      if (titleLower.includes('nutrition')) return '🥗';
      return '🏃‍♂️';
    }
    
    // Special occasions
    if (titleLower.includes('gala')) return '✨';
    if (titleLower.includes('party')) return '🎉';
    if (titleLower.includes('celebration')) return '🎊';
    if (titleLower.includes('festival')) return '🎪';
    
    return getCategoryInfo(category).icon;
  };

  const categoryInfo = getCategoryInfo(event.category);
  const eventIcon = getSpecialIcon(event.title, event.category);
  
  // Format date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
  };

  // Get ticket availability status
  const getAvailabilityStatus = () => {
    if (event.remainingTickets === 0) {
      return { text: 'Sold Out', color: '#f44336', bgColor: '#ffebee' };
    } else if (event.remainingTickets <= 5) {
      return { text: 'Almost Sold Out!', color: '#ff9800', bgColor: '#fff3e0' };
    } else if (event.remainingTickets <= 20) {
      return { text: 'Limited Seats', color: '#ff9800', bgColor: '#fff8e1' };
    } else {
      return { text: 'Available', color: '#4caf50', bgColor: '#e8f5e8' };
    }
  };

  const availability = getAvailabilityStatus();

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      border: '1px solid #f0f0f0',
      position: 'relative'
    }}>
      {/* Category Badge */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        background: categoryInfo.bgColor,
        color: categoryInfo.color,
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        zIndex: 2,
        border: `1px solid ${categoryInfo.color}20`
      }}>
        {categoryInfo.icon} {event.category}
      </div>

      {/* Availability Badge */}
      {event.remainingTickets <= 5 && (
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          background: availability.bgColor,
          color: availability.color,
          padding: '4px 10px',
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: 'bold',
          zIndex: 2,
          border: `1px solid ${availability.color}`,
          animation: event.remainingTickets === 0 ? 'none' : 'pulse 2s infinite'
        }}>
          {availability.text}
        </div>
      )}

      {/* Event Icon/Image Area */}
      <div style={{
        height: '180px',
        background: `linear-gradient(135deg, ${categoryInfo.bgColor}, ${categoryInfo.color}15)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderBottom: `3px solid ${categoryInfo.color}20`
      }}>
        <div style={{
          fontSize: '4rem',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
        }}>
          {eventIcon}
        </div>
        
        {/* Background pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${categoryInfo.color.slice(1)}' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.3
        }} />
      </div>

      {/* Event Content */}
      <div style={{ padding: '20px' }}>
        {/* Event Title */}
        <h3 style={{
          fontSize: '1.4rem',
          fontWeight: '700',
          color: '#2c3e50',
          marginBottom: '12px',
          lineHeight: '1.3',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {event.title}
        </h3>

        {/* Event Details */}
        <div style={{ marginBottom: '16px' }}>
          {/* Date */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '8px',
            color: '#546e7a'
          }}>
            <span style={{ marginRight: '8px', fontSize: '1.1rem' }}>📅</span>
            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>
              {formatDate(event.date)}
            </span>
          </div>

          {/* Location */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '8px',
            color: '#546e7a'
          }}>
            <span style={{ marginRight: '8px', fontSize: '1.1rem' }}>📍</span>
            <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>
              {event.location}
            </span>
          </div>

          {/* Tickets */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            color: '#546e7a'
          }}>
            <span style={{ marginRight: '8px', fontSize: '1.1rem' }}>🎫</span>
            <span style={{ 
              fontSize: '0.9rem', 
              fontWeight: '500',
              color: event.remainingTickets === 0 ? '#f44336' : '#546e7a'
            }}>
              {event.remainingTickets > 0 
                ? `${event.remainingTickets} tickets left`
                : 'Sold Out'
              }
            </span>
          </div>
        </div>

        {/* Price and Action */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '16px',
          borderTop: '1px solid #ecf0f1'
        }}>
          <div style={{
            fontSize: '1.6rem',
            fontWeight: '800',
            color: categoryInfo.color,
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '1rem', marginRight: '2px' }}>$</span>
            {event.ticketPrice}
          </div>

          <Link 
            to={`/events/${event._id}`}
            style={{
              background: `linear-gradient(135deg, ${categoryInfo.color}, ${categoryInfo.color}dd)`,
              color: 'white',
              padding: '10px 20px',
              borderRadius: '25px',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              boxShadow: `0 4px 15px ${categoryInfo.color}40`,
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = `0 6px 20px ${categoryInfo.color}50`;
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = `0 4px 15px ${categoryInfo.color}40`;
            }}
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;