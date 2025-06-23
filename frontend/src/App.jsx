import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorBlogList from './pages/DoctorBlogList';
import DoctorBlogCreate from './pages/DoctorBlogCreate';
import DoctorBlogEdit from './pages/DoctorBlogEdit';
import PatientBlogList from './pages/PatientBlogList';
import PatientBlogDetail from './pages/PatientBlogDetail';
import DoctorList from './pages/DoctorList';
import BookAppointment from './pages/BookAppointment';
import Navbar from './components/Navbar';
import AppointmentConfirmed from './pages/AppointmentConfirmed';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh', 
          background: 'linear-gradient(135deg, #e0f2fe 0%, #f5faff 100%)',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        }}>
          <Navbar />
          <main style={{ 
            flex: 1, 
            padding: '40px 20px', 
            maxWidth: '1400px', 
            margin: '0 auto', 
            width: '100%' 
          }}>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <Home />
                  </motion.div>
                } />
                <Route path="/signup" element={
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <Signup />
                  </motion.div>
                } />
                <Route path="/login" element={
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <Login />
                  </motion.div>
                } />
                <Route path="/patient/dashboard" element={
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <PatientDashboard />
                  </motion.div>
                } />
                <Route path="/doctor/dashboard" element={
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <DoctorDashboard />
                  </motion.div>
                } />
                <Route path="/doctor/blogs" element={
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <DoctorBlogList />
                  </motion.div>
                } />
                <Route path="/doctor/blogs/create" element={
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <DoctorBlogCreate />
                  </motion.div>
                } />
                <Route path="/doctor/blogs/edit/:blog_id" element={
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <DoctorBlogEdit />
                  </motion.div>
                } />
                <Route path="/patient/blogs" element={
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <PatientBlogList />
                  </motion.div>
                } />
                <Route path="/patient/blogs/:blog_id" element={
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <PatientBlogDetail />
                  </motion.div>
                } />
                <Route path="/patient/doctors" element={
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <DoctorList />
                  </motion.div>
                } />
                <Route path="/patient/book_appointment/:doctor_id" element={
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <BookAppointment />
                  </motion.div>
                } />
                <Route path="/patient/appointment_confirmed/:appointment_id" element={
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <AppointmentConfirmed />
                  </motion.div>
                } />
              </Routes>
            </AnimatePresence>
          </main>
          <footer style={{ 
            backgroundColor: '#1e3a8a', 
            color: '#fff', 
            padding: '20px', 
            textAlign: 'center', 
            fontSize: '0.875rem',
            boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)',
          }}>
            © 2025 Healthcare App. All rights reserved.
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;