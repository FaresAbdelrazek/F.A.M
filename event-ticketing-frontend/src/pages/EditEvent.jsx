import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../services/api';
import EventForm from '../components/EventForm';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await axios.get(`/events/${id}`); // Corrected path here
        setEventData(res.data.event);
      } catch (error) {
        toast.error('Failed to load event data');
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      await axios.put(`/events/${id}`, formData); // Corrected path here
      toast.success('Event updated successfully!');
      navigate('/my-events');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update event');
    }
  };

  if (loading) return <Loader />;

  if (!eventData) return <p>Event not found.</p>;

  return (
    <div>
      <h2>Edit Event</h2>
      <EventForm initialData={eventData} onSubmit={handleUpdate} />
    </div>
  );
};

export default EditEvent;
