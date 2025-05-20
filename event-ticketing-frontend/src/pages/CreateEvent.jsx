import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../services/api';
import EventForm from '../components/EventForm';
import { toast } from 'react-toastify';

const CreateEvent = () => {
  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    try {
      await axios.post('/events', formData); // Corrected path here
      toast.success('Event created successfully!');
      navigate('/my-events'); // Redirect to organizer’s events list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create event');
    }
  };

  return (
    <div>
      <h2>Create New Event</h2>
      <EventForm onSubmit={handleCreate} />
    </div>
  );
};

export default CreateEvent;
