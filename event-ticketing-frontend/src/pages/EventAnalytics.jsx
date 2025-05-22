import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const EventAnalytics = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        // Fetch organizer's events
        const res = await axios.get('/users/events');
        const eventsData = res.data.events;
        
        // Calculate analytics data
        const analyticsData = eventsData.map(event => ({
          title: event.title,
          totalTickets: event.totalTickets,
          remainingTickets: event.remainingTickets,
          bookedTickets: event.totalTickets - event.remainingTickets,
          bookedPercentage: ((event.totalTickets - event.remainingTickets) / event.totalTickets * 100).toFixed(1),
          revenue: (event.totalTickets - event.remainingTickets) * event.ticketPrice,
          status: event.status,
          ticketPrice: event.ticketPrice,
          date: event.date
        }));
        
        setEvents(analyticsData);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        toast.error('Failed to fetch analytics data');
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) return <Loader />;

  if (events.length === 0) {
    return (
      <div className="page">
        <h2>Event Analytics</h2>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>No events found. Create your first event to see analytics.</p>
          <a href="/create-event" className="btn btn-primary" style={{ marginTop: '15px' }}>
            Create Event
          </a>
        </div>
      </div>
    );
  }

  // Prepare data for charts
  const pieData = events.map(event => ({
    name: event.title,
    value: parseFloat(event.bookedPercentage),
    bookedTickets: event.bookedTickets,
    totalTickets: event.totalTickets
  }));

  const barData = events.map(event => ({
    name: event.title.length > 15 ? event.title.substring(0, 15) + '...' : event.title,
    booked: event.bookedTickets,
    remaining: event.remainingTickets,
    revenue: event.revenue
  }));

  const totalRevenue = events.reduce((sum, event) => sum + event.revenue, 0);
  const totalTicketsSold = events.reduce((sum, event) => sum + event.bookedTickets, 0);
  const averageBookingRate = events.length > 0 
    ? (events.reduce((sum, event) => sum + parseFloat(event.bookedPercentage), 0) / events.length).toFixed(1)
    : 0;

  return (
    <div className="page">
      <h2>Event Analytics Dashboard</h2>
      
      {/* Summary Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        <div style={{ 
          background: '#007bff', 
          color: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          textAlign: 'center' 
        }}>
          <h3>Total Events</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0' }}>{events.length}</p>
        </div>
        
        <div style={{ 
          background: '#28a745', 
          color: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          textAlign: 'center' 
        }}>
          <h3>Tickets Sold</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0' }}>{totalTicketsSold}</p>
        </div>
        
        <div style={{ 
          background: '#17a2b8', 
          color: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          textAlign: 'center' 
        }}>
          <h3>Total Revenue</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0' }}>${totalRevenue.toFixed(2)}</p>
        </div>
        
        <div style={{ 
          background: '#ffc107', 
          color: 'black', 
          padding: '20px', 
          borderRadius: '8px', 
          textAlign: 'center' 
        }}>
          <h3>Avg. Booking Rate</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0' }}>{averageBookingRate}%</p>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
        
        {/* Pie Chart - Booking Percentages */}
        <div className="analytics-container">
          <h3 style={{ marginBottom: '20px' }}>Booking Percentages by Event</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props) => [
                `${value}%`, 
                `${props.payload.bookedTickets}/${props.payload.totalTickets} tickets`
              ]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Tickets Sold vs Remaining */}
        <div className="analytics-container">
          <h3 style={{ marginBottom: '20px' }}>Tickets: Sold vs Remaining</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="booked" fill="#28a745" name="Booked" />
              <Bar dataKey="remaining" fill="#dc3545" name="Remaining" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Table */}
      <div style={{ marginTop: '30px' }}>
        <h3 style={{ marginBottom: '20px' }}>Detailed Event Performance</h3>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Status</th>
                <th>Date</th>
                <th>Total Tickets</th>
                <th>Sold</th>
                <th>Remaining</th>
                <th>Booking Rate</th>
                <th>Price</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr key={index}>
                  <td><strong>{event.title}</strong></td>
                  <td>
                    <span className={`status-badge status-${event.status}`}>
                      {event.status}
                    </span>
                  </td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>{event.totalTickets}</td>
                  <td style={{ color: '#28a745', fontWeight: 'bold' }}>{event.bookedTickets}</td>
                  <td style={{ color: '#dc3545' }}>{event.remainingTickets}</td>
                  <td>
                    <div style={{ 
                      background: '#f8f9fa', 
                      borderRadius: '10px', 
                      padding: '5px 10px',
                      display: 'inline-block'
                    }}>
                      {event.bookedPercentage}%
                    </div>
                  </td>
                  <td>${event.ticketPrice.toFixed(2)}</td>
                  <td style={{ fontWeight: 'bold', color: '#007bff' }}>
                    ${event.revenue.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EventAnalytics;