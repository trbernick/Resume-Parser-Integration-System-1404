import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useCandidates } from '../context/CandidateContext';
import CandidateCard from '../components/CandidateCard';

const { FiUsers, FiFileText, FiMessageCircle, FiBarChart3, FiPlus } = FiIcons;

const Dashboard = () => {
  const { candidates } = useCandidates();

  const stats = [
    {
      label: 'Total Candidates',
      value: candidates.length,
      icon: FiUsers,
      color: 'bg-blue-500'
    },
    {
      label: 'Resumes Parsed',
      value: candidates.filter(c => c.resume).length,
      icon: FiFileText,
      color: 'bg-green-500'
    },
    {
      label: 'Interviews Completed',
      value: candidates.filter(c => c.interview).length,
      icon: FiMessageCircle,
      color: 'bg-purple-500'
    },
    {
      label: 'Big 5 Assessments',
      value: candidates.filter(c => c.big5).length,
      icon: FiBarChart3,
      color: 'bg-orange-500'
    }
  ];

  const quickActions = [
    {
      title: 'Parse Resume',
      description: 'Upload and parse candidate resumes',
      icon: FiFileText,
      link: '/resume-parser',
      color: 'bg-blue-500'
    },
    {
      title: 'Interview Summary',
      description: 'Add interview notes and summary',
      icon: FiMessageCircle,
      link: '/interview-summary',
      color: 'bg-purple-500'
    },
    {
      title: 'Big 5 Assessment',
      description: 'Conduct personality assessment',
      icon: FiBarChart3,
      link: '/big5-assessment',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Candidate Management Dashboard
        </h1>
        <p className="text-gray-600 text-lg">
          Comprehensive candidate profiling with resume parsing and personality assessment
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`${stat.color} rounded-lg p-3`}>
                <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <Link
              to={action.link}
              className="block bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className={`${action.color} rounded-lg p-3`}>
                  <SafeIcon icon={action.icon} className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{action.title}</h3>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Candidates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100"
      >
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Recent Candidates</h2>
        </div>
        <div className="p-6">
          {candidates.length === 0 ? (
            <div className="text-center py-12">
              <SafeIcon icon={FiUsers} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-4">No candidates yet</p>
              <Link
                to="/resume-parser"
                className="inline-flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <SafeIcon icon={FiPlus} className="w-5 h-5" />
                <span>Add First Candidate</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {candidates.slice(0, 6).map((candidate) => (
                <CandidateCard key={candidate.id} candidate={candidate} />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;