import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { format } from 'date-fns';

const { FiUser, FiFileText, FiMessageCircle, FiBarChart3, FiCheck, FiX } = FiIcons;

const CandidateCard = ({ candidate }) => {
  const getCompletionStatus = () => {
    const hasResume = !!candidate.resume;
    const hasInterview = !!candidate.interview;
    const hasBig5 = !!candidate.big5;
    
    return { hasResume, hasInterview, hasBig5 };
  };

  const { hasResume, hasInterview, hasBig5 } = getCompletionStatus();

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <SafeIcon icon={FiUser} className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{candidate.name || 'Unnamed Candidate'}</h3>
          <p className="text-sm text-gray-600">
            Added {format(new Date(candidate.createdAt), 'MMM dd, yyyy')}
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiFileText} className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Resume</span>
          </div>
          <SafeIcon
            icon={hasResume ? FiCheck : FiX}
            className={`w-4 h-4 ${hasResume ? 'text-green-500' : 'text-red-500'}`}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiMessageCircle} className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Interview</span>
          </div>
          <SafeIcon
            icon={hasInterview ? FiCheck : FiX}
            className={`w-4 h-4 ${hasInterview ? 'text-green-500' : 'text-red-500'}`}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiBarChart3} className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Big 5</span>
          </div>
          <SafeIcon
            icon={hasBig5 ? FiCheck : FiX}
            className={`w-4 h-4 ${hasBig5 ? 'text-green-500' : 'text-red-500'}`}
          />
        </div>
      </div>

      <Link
        to={`/candidate-profile/${candidate.id}`}
        className="block w-full text-center bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
      >
        View Profile
      </Link>
    </motion.div>
  );
};

export default CandidateCard;