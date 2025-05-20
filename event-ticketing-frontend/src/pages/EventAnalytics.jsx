import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import Loader from '../components/Loader';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const EventAnalytics = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await axios.get('/events/analytics'); // Your backend endpoint
        // Expected data format: [{ name: 'Event 1', booked: 50, total: 100 }, ...]
        const chartData = res.data.map(event => ({
          name: event.title,
          value: (event.booked / event.totalTickets) * 100,
        }));
        setData(chartData);
      } catch (error) {
        // Handle error
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h2>Ticket Booking Analytics</h2>
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default EventAnalytics;
