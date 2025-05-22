import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../services/api';
import EventForm from '../components/EventForm';
import { toast } from 'react-toastify';

const CreateEvent = () => {
  const navigate = useNavigate();

  const handleCreate = async (formData) => {
    try {
      console.log('Creating event with data:', formData);
      
      const response = await axios.post('/events', formData);
      
      console.log('Event creation response:', response.data);
      toast.success('Event created successfully and is pending approval!');
      navigate('/my-events');
    } catch (error) {
      console.error('Event creation error:', error);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.msg) {
        toast.error(error.response.data.msg);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Failed to create event. Please try again.');
      }
      
      // Don't navigate away on error, let user try again
      throw error;
    }
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Create New Event</h2>
      <EventForm onSubmit={handleCreate} />
    </div>
  );
};

export default CreateEvent;