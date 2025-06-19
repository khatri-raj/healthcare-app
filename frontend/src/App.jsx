import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorBlogList from './pages/DoctorBlogList';
import DoctorBlogCreate from './pages/DoctorBlogCreate';
import PatientBlogList from './pages/PatientBlogList';
import PatientBlogDetail from './pages/PatientBlogDetail';
import DoctorList from './pages/DoctorList';
import BookAppointment from './pages/BookAppointment';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh', 
          background: 'linear-gradient(135deg, #d0e7ff 0%, #f0f7ff 100%)' 
        }}>
          <Navbar />
          <div style={{ flex: 1, padding: '20px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/patient/dashboard" element={<PatientDashboard />} />
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              <Route path="/doctor/blogs" element={<DoctorBlogList />} />
              <Route path="/doctor/blogs/create" element={<DoctorBlogCreate />} />
              <Route path="/patient/blogs" element={<PatientBlogList />} />
              <Route path="/patient/blogs/:blog_id" element={<PatientBlogDetail />} />
              <Route path="/patient/doctors" element={<DoctorList />} />
              <Route path="/patient/book_appointment/:doctor_id" element={<BookAppointment />} />
            </Routes>
          </div>
          <footer style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '15px 0', 
            textAlign: 'center', 
            color: '#555', 
            fontSize: '0.9rem' 
          }}>
            © 2025 Healthcare App. All rights reserved.
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;