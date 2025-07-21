import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useCandidates } from '../context/CandidateContext';

const { FiMessageCircle, FiStar, FiUser, FiCheck, FiX } = FiIcons;

const InterviewSummary = () => {
  const { candidates, updateCandidate } = useCandidates();
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [interviewData, setInterviewData] = useState({
    interviewer: '',
    date: '',
    duration: '',
    position: '',
    overallRating: 5,
    technicalSkills: 5,
    communication: 5,
    problemSolving: 5,
    cultureFit: 5,
    strengths: '',
    weaknesses: '',
    notes: '',
    recommendation: 'hire'
  });

  const handleInputChange = (field, value) => {
    setInterviewData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveInterview = () => {
    if (!selectedCandidate) return;
    
    const interview = {
      ...interviewData,
      conductedAt: new Date().toISOString()
    };
    
    updateCandidate(selectedCandidate, { interview });
    
    // Reset form
    setInterviewData({
      interviewer: '',
      date: '',
      duration: '',
      position: '',
      overallRating: 5,
      technicalSkills: 5,
      communication: 5,
      problemSolving: 5,
      cultureFit: 5,
      strengths: '',
      weaknesses: '',
      notes: '',
      recommendation: 'hire'
    });
    setSelectedCandidate('');
  };

  const ratingLabels = {
    1: 'Poor',
    2: 'Below Average',
    3: 'Average',
    4: 'Good',
    5: 'Excellent'
  };

  const RatingInput = ({ label, value, onChange }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center space-x-4">
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => onChange(rating)}
              className={`p-1 rounded ${
                rating <= value ? 'text-yellow-500' : 'text-gray-300'
              }`}
            >
              <SafeIcon icon={FiStar} className="w-5 h-5 fill-current" />
            </button>
          ))}
        </div>
        <span className="text-sm text-gray-600">{ratingLabels[value]}</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Interview Summary</h1>
        <p className="text-gray-600">Record and evaluate candidate interview performance</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Interview Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Candidate Selection */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Candidate
            </label>
            <select
              value={selectedCandidate}
              onChange={(e) => setSelectedCandidate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a candidate...</option>
              {candidates.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.name || 'Unnamed Candidate'}
                </option>
              ))}
            </select>
          </div>

          {/* Basic Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interviewer
            </label>
            <input
              type="text"
              value={interviewData.interviewer}
              onChange={(e) => handleInputChange('interviewer', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interview Date
            </label>
            <input
              type="date"
              value={interviewData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={interviewData.duration}
              onChange={(e) => handleInputChange('duration', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="60"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position
            </label>
            <input
              type="text"
              value={interviewData.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Software Engineer"
            />
          </div>
        </div>

        {/* Ratings */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Ratings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RatingInput
              label="Overall Rating"
              value={interviewData.overallRating}
              onChange={(value) => handleInputChange('overallRating', value)}
            />
            <RatingInput
              label="Technical Skills"
              value={interviewData.technicalSkills}
              onChange={(value) => handleInputChange('technicalSkills', value)}
            />
            <RatingInput
              label="Communication"
              value={interviewData.communication}
              onChange={(value) => handleInputChange('communication', value)}
            />
            <RatingInput
              label="Problem Solving"
              value={interviewData.problemSolving}
              onChange={(value) => handleInputChange('problemSolving', value)}
            />
            <RatingInput
              label="Culture Fit"
              value={interviewData.cultureFit}
              onChange={(value) => handleInputChange('cultureFit', value)}
            />
          </div>
        </div>

        {/* Text Areas */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Strengths
            </label>
            <textarea
              value={interviewData.strengths}
              onChange={(e) => handleInputChange('strengths', e.target.value)}
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Key strengths observed..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Areas for Improvement
            </label>
            <textarea
              value={interviewData.weaknesses}
              onChange={(e) => handleInputChange('weaknesses', e.target.value)}
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Areas that need improvement..."
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            value={interviewData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Additional observations and notes..."
          />
        </div>

        {/* Recommendation */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recommendation
          </label>
          <div className="flex space-x-4">
            <button
              onClick={() => handleInputChange('recommendation', 'hire')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                interviewData.recommendation === 'hire'
                  ? 'bg-green-50 border-green-500 text-green-700'
                  : 'border-gray-300 text-gray-600'
              }`}
            >
              <SafeIcon icon={FiCheck} className="w-4 h-4" />
              <span>Hire</span>
            </button>
            <button
              onClick={() => handleInputChange('recommendation', 'reject')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                interviewData.recommendation === 'reject'
                  ? 'bg-red-50 border-red-500 text-red-700'
                  : 'border-gray-300 text-gray-600'
              }`}
            >
              <SafeIcon icon={FiX} className="w-4 h-4" />
              <span>Reject</span>
            </button>
            <button
              onClick={() => handleInputChange('recommendation', 'maybe')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                interviewData.recommendation === 'maybe'
                  ? 'bg-yellow-50 border-yellow-500 text-yellow-700'
                  : 'border-gray-300 text-gray-600'
              }`}
            >
              <SafeIcon icon={FiMessageCircle} className="w-4 h-4" />
              <span>Maybe</span>
            </button>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSaveInterview}
            disabled={!selectedCandidate}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Interview Summary
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default InterviewSummary;