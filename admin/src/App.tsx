import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Posts from './pages/Posts';
import Requests from './pages/Requests';
import Subscriptions from './pages/Subscriptions';
import Settings from './pages/Settings';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import { ThemeProvider } from './context/ThemeContext';
import VerifyOtp from './pages/auth/verifyOtp';
import Profile from './pages/auth/Profile';
import AdminDetails from './pages/auth/AdminDetails';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/" element={<AdminLayout />} >
            <Route path='/profile' element={<Profile />} />
            <Route path='/admin-details/:id' element={<AdminDetails />} />
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="posts" element={<Posts />} />
            <Route path="requests" element={<Requests />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;