import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DemoBanner from './components/DemoBanner';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import EventsList from './pages/EventsList';
import EventDetail from './pages/EventDetail';
import NGODirectory from './pages/NGODirectory';
import SkillsDirectory from './pages/SkillsDirectory';
import Login from './pages/Login';
import Register from './pages/Register';

// Volunteer Pages
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';
import VolunteerAvailability from './pages/volunteer/VolunteerAvailability';
import VolunteerProfile from './pages/volunteer/VolunteerProfile';
import MyApplications from './pages/volunteer/MyApplications';

// NGO Pages
import NGODashboard from './pages/ngo/NGODashboard';
import NGOEvents from './pages/ngo/NGOEvents';
import NGOApplicants from './pages/ngo/NGOApplicants';
import VolunteerDirectory from './pages/ngo/VolunteerDirectory';
import NGOProfile from './pages/ngo/NGOProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
          {/* Quick 1-Click Role Switcher Demo Banner */}
          <DemoBanner />

          {/* Top Navigation */}
          <Navbar />

          {/* Main App Content Area */}
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<EventsList />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/ngos" element={<NGODirectory />} />
              <Route path="/skills" element={<SkillsDirectory />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Volunteer Protected Routes */}
              <Route
                path="/volunteer/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['volunteer', 'admin']}>
                    <VolunteerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/volunteer/availability"
                element={
                  <ProtectedRoute allowedRoles={['volunteer', 'admin']}>
                    <VolunteerAvailability />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/volunteer/profile"
                element={
                  <ProtectedRoute allowedRoles={['volunteer', 'admin']}>
                    <VolunteerProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/volunteer/applications"
                element={
                  <ProtectedRoute allowedRoles={['volunteer', 'admin']}>
                    <MyApplications />
                  </ProtectedRoute>
                }
              />

              {/* NGO Protected Routes */}
              <Route
                path="/ngo/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ngo', 'admin']}>
                    <NGODashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ngo/events"
                element={
                  <ProtectedRoute allowedRoles={['ngo', 'admin']}>
                    <NGOEvents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ngo/applicants"
                element={
                  <ProtectedRoute allowedRoles={['ngo', 'admin']}>
                    <NGOApplicants />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ngo/volunteers"
                element={
                  <ProtectedRoute allowedRoles={['ngo', 'admin']}>
                    <VolunteerDirectory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ngo/profile"
                element={
                  <ProtectedRoute allowedRoles={['ngo', 'admin']}>
                    <NGOProfile />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
