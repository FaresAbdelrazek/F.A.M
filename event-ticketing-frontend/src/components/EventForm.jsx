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

  useEffect(() => {
    // If editing, fill form with initialData
    if (initialData) setFormData(prev => ({ ...prev, ...initialData }));
  }, [initialData]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="event-form">
      <label>Title:</label>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <label>Date:</label>
      <input
        type="datetime-local"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />

      <label>Location:</label>
      <input
        type="text"
        name="location"
        value={formData.location}
        onChange={handleChange}
        required
      />

      <label>Total Tickets:</label>
      <input
        type="number"
        name="totalTickets"
        min="1"
        value={formData.totalTickets}
        onChange={handleChange}
        required
      />

      <label>Ticket Price ($):</label>
      <input
        type="number"
        name="ticketPrice"
        min="0"
        step="0.01"
        value={formData.ticketPrice}
        onChange={handleChange}
        required
      />

      <label>Category:</label>
      <input
        type="text"
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
      />

      <label>Description:</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        required
      />

      <button type="submit">Save Event</button>
    </form>
  );
};

export default EventForm;
