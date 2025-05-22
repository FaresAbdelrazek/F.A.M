import React, { useState, useEffect } from 'react';

const EventForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    totalTickets: '',
    ticketPrice: '',
    category: '',
    description: '',
    ...initialData,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If editing, fill form with initialData and format date properly
    if (initialData && Object.keys(initialData).length > 0) {
      const formattedData = { ...initialData };
      
      // Format date for datetime-local input
      if (formattedData.date) {
        const date = new Date(formattedData.date);
        formattedData.date = date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
      }
      
      setFormData(prev => ({ ...prev, ...formattedData }));
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    
    if (!formData.totalTickets || isNaN(formData.totalTickets) || parseInt(formData.totalTickets) < 1) {
      newErrors.totalTickets = 'Total tickets must be a positive number';
    }
    
    if (!formData.ticketPrice || isNaN(formData.ticketPrice) || parseFloat(formData.ticketPrice) < 0) {
      newErrors.ticketPrice = 'Ticket price must be a valid positive number';
    }

    // Check if date is in the future
    if (formData.date && new Date(formData.date) <= new Date()) {
      newErrors.date = 'Event date must be in the future';
    }

    return newErrors;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Prepare data for submission
      const submitData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: formData.date,
        location: formData.location.trim(),
        category: formData.category.trim(),
        totalTickets: parseInt(formData.totalTickets),
        ticketPrice: parseFloat(formData.ticketPrice),
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ submit: 'Failed to save event. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <form onSubmit={handleSubmit} className="event-form">
        {errors.submit && (
          <div className="error" style={{ marginBottom: '20px' }}>
            {errors.submit}
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="title">Event Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter event title"
          />
          {errors.title && <div className="error">{errors.title}</div>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Enter event description"
            rows="4"
          />
          {errors.description && <div className="error">{errors.description}</div>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="date">Date & Time:</label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
          {errors.date && <div className="error">{errors.date}</div>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="location">Location:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="Enter event location"
          />
          {errors.location && <div className="error">{errors.location}</div>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            <option value="Music">Music</option>
            <option value="Art">Art</option>
            <option value="Sports">Sports</option>
            <option value="Technology">Technology</option>
            <option value="Business">Business</option>
            <option value="Education">Education</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Food & Drink">Food & Drink</option>
            <option value="Health & Wellness">Health & Wellness</option>
            <option value="Other">Other</option>
          </select>
          {errors.category && <div className="error">{errors.category}</div>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="totalTickets">Total Tickets:</label>
          <input
            type="number"
            id="totalTickets"
            name="totalTickets"
            min="1"
            value={formData.totalTickets}
            onChange={handleChange}
            required
            placeholder="Enter total number of tickets"
          />
          {errors.totalTickets && <div className="error">{errors.totalTickets}</div>}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="ticketPrice">Ticket Price ($):</label>
          <input
            type="number"
            id="ticketPrice"
            name="ticketPrice"
            min="0"
            step="0.01"
            value={formData.ticketPrice}
            onChange={handleChange}
            required
            placeholder="Enter ticket price"
          />
          {errors.ticketPrice && <div className="error">{errors.ticketPrice}</div>}
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn btn-primary"
          style={{ width: '100%' }}
        >
          {loading ? 'Saving Event...' : 'Save Event'}
        </button>
      </form>
    </div>
  );
};

export default EventForm;