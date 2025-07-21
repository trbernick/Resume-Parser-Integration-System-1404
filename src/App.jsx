import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import ResumeParser from './pages/ResumeParser';
import InterviewSummary from './pages/InterviewSummary';
import CandidateProfile from './pages/CandidateProfile';
import Big5Assessment from './pages/Big5Assessment';
import { CandidateProvider } from './context/CandidateContext';
import './App.css';

function App() {
  return (
    <CandidateProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <Navigation />
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8"
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/resume-parser" element={<ResumeParser />} />
              <Route path="/interview-summary" element={<InterviewSummary />} />
              <Route path="/big5-assessment" element={<Big5Assessment />} />
              <Route path="/candidate-profile/:id" element={<CandidateProfile />} />
            </Routes>
          </motion.main>
          
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </CandidateProvider>
  );
}

export default App;