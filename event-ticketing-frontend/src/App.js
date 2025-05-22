import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Import toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import MyEvents from './pages/MyEvents';
import AdminUsers from './pages/AdminUsers';
import AdminEvents from './pages/AdminEvents';
import UserBookings from './pages/UserBookings';
import EventAnalytics from './pages/EventAnalytics';

// Import components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetails />} />

              {/* Protected Routes - All Authenticated Users */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={['Standard User', 'Organizer', 'Admin']}>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes - Standard Users */}
              <Route
                path="/bookings"
                element={
                  <ProtectedRoute allowedRoles={['Standard User']}>
                    <UserBookings />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes - Organizers */}
              <Route
                path="/create-event"
                element={
                  <ProtectedRoute allowedRoles={['Organizer']}>
                    <CreateEvent />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/edit-event/:id"
                element={
                  <ProtectedRoute allowedRoles={['Organizer']}>
                    <EditEvent />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/my-events"
                element={
                  <ProtectedRoute allowedRoles={['Organizer']}>
                    <MyEvents />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/analytics"
                element={
                  <ProtectedRoute allowedRoles={['Organizer']}>
                    <EventAnalytics />
                  </ProtectedRoute>
                }
              />

              {/* Protected Routes - Admins */}
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/events"
                element={
                  <ProtectedRoute allowedRoles={['Admin']}>
                    <AdminEvents />
                  </ProtectedRoute>
                }
              />

              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/events" />} />
              <Route path="*" element={<Navigate to="/events" />} />
            </Routes>
          </main>
          <Footer />

          {/* Toast notifications container */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;