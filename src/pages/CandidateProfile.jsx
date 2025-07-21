import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { RadarChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useCandidates } from '../context/CandidateContext';
import { format } from 'date-fns';

// Register required ECharts components
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  RadarChart,
  CanvasRenderer
]);

const { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiStar, FiFileText, FiMessageCircle, FiBarChart3 } = FiIcons;

const CandidateProfile = () => {
  const { id } = useParams();
  const { getCandidateById } = useCandidates();
  const candidate = getCandidateById(id);

  const traitDescriptions = {
    openness: 'Openness to Experience - Creativity, curiosity, and openness to new ideas',
    conscientiousness: 'Conscientiousness - Organization, responsibility, and goal-oriented behavior',
    extraversion: 'Extraversion - Social engagement, energy, and assertiveness',
    agreeableness: 'Agreeableness - Cooperation, compassion, and consideration for others',
    neuroticism: 'Emotional Stability - Stress resistance, emotional control, and adaptability'
  };

  const getRadarOption = (scores) => ({
    title: {
      text: 'Big 5 Personality Profile',
      left: 'center',
      top: 20,
      textStyle: {
        color: '#1f2937'
      }
    },
    tooltip: {
      trigger: 'item'
    },
    radar: {
      shape: 'circle',
      indicator: [
        { name: 'Openness', max: 100 },
        { name: 'Conscientiousness', max: 100 },
        { name: 'Extraversion', max: 100 },
        { name: 'Agreeableness', max: 100 },
        { name: 'Emotional Stability', max: 100 }
      ],
      splitArea: {
        areaStyle: {
          color: ['#f9fafb', '#f3f4f6', '#e5e7eb', '#d1d5db', '#9ca3af']
        }
      },
      axisLine: {
        lineStyle: {
          color: '#4b5563'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#6b7280'
        }
      }
    },
    series: [{
      type: 'radar',
      data: [{
        value: [
          scores.openness,
          scores.conscientiousness,
          scores.extraversion,
          scores.agreeableness,
          100 - scores.neuroticism // Invert neuroticism to show as emotional stability
        ],
        name: 'Personality Profile',
        areaStyle: {
          color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
            {
              color: 'rgba(59, 130, 246, 0.8)',
              offset: 0
            },
            {
              color: 'rgba(59, 130, 246, 0.2)',
              offset: 1
            }
          ])
        },
        lineStyle: {
          color: '#3b82f6',
          width: 2
        },
        itemStyle: {
          color: '#3b82f6'
        }
      }]
    }]
  });

  if (!candidate) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <SafeIcon icon={FiUser} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Candidate Not Found</h1>
        <p className="text-gray-600">The requested candidate profile could not be found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <SafeIcon icon={FiUser} className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{candidate.name || 'Unnamed Candidate'}</h1>
            <p className="text-gray-600">
              Added {format(new Date(candidate.createdAt), 'MMM dd, yyyy')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {candidate.email && (
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiMail} className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">{candidate.email}</span>
            </div>
          )}
          {candidate.phone && (
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiPhone} className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">{candidate.phone}</span>
            </div>
          )}
          {candidate.location && (
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiMapPin} className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">{candidate.location}</span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiCalendar} className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700">
              Updated {format(new Date(candidate.updatedAt), 'MMM dd, yyyy')}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Resume Information */}
        {candidate.resume && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center space-x-2 mb-4">
              <SafeIcon icon={FiFileText} className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">Resume Information</h2>
            </div>

            <div className="space-y-4">
              {/* Skills */}
              {candidate.resume.parsedData.skills.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {candidate.resume.parsedData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {candidate.resume.parsedData.experience.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Experience</h3>
                  <div className="space-y-2">
                    {candidate.resume.parsedData.experience.map((exp, index) => (
                      <div key={index} className="border-l-2 border-blue-500 pl-4">
                        <h4 className="font-medium text-gray-800">{exp.title}</h4>
                        <p className="text-sm text-gray-600">{exp.company}</p>
                        <p className="text-xs text-gray-500">{exp.duration}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {candidate.resume.parsedData.education.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Education</h3>
                  <div className="space-y-2">
                    {candidate.resume.parsedData.education.map((edu, index) => (
                      <div key={index} className="border-l-2 border-green-500 pl-4">
                        <h4 className="font-medium text-gray-800">{edu.degree}</h4>
                        <p className="text-sm text-gray-600">{edu.institution}</p>
                        <p className="text-xs text-gray-500">{edu.year}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Interview Summary */}
        {candidate.interview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center space-x-2 mb-4">
              <SafeIcon icon={FiMessageCircle} className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-800">Interview Summary</h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Interviewer:</span>
                  <p className="font-medium">{candidate.interview.interviewer}</p>
                </div>
                <div>
                  <span className="text-gray-600">Position:</span>
                  <p className="font-medium">{candidate.interview.position}</p>
                </div>
                <div>
                  <span className="text-gray-600">Date:</span>
                  <p className="font-medium">{candidate.interview.date}</p>
                </div>
                <div>
                  <span className="text-gray-600">Duration:</span>
                  <p className="font-medium">{candidate.interview.duration} minutes</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Overall', value: candidate.interview.overallRating },
                  { label: 'Technical', value: candidate.interview.technicalSkills },
                  { label: 'Communication', value: candidate.interview.communication },
                  { label: 'Problem Solving', value: candidate.interview.problemSolving },
                  { label: 'Culture Fit', value: candidate.interview.cultureFit }
                ].map((rating, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{rating.label}:</span>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <SafeIcon
                          key={star}
                          icon={FiStar}
                          className={`w-4 h-4 ${
                            star <= rating.value ? 'text-yellow-500 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Strengths:</span>
                  <p className="text-sm">{candidate.interview.strengths}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Areas for Improvement:</span>
                  <p className="text-sm">{candidate.interview.weaknesses}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Recommendation:</span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    candidate.interview.recommendation === 'hire'
                      ? 'bg-green-100 text-green-800'
                      : candidate.interview.recommendation === 'reject'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {candidate.interview.recommendation.toUpperCase()}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Big 5 Personality */}
        {candidate.big5 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2"
          >
            <div className="flex items-center space-x-2 mb-4">
              <SafeIcon icon={FiBarChart3} className="w-5 h-5 text-orange-600" />
              <h2 className="text-xl font-semibold text-gray-800">Personality Profile</h2>
            </div>

            <div className="h-[400px] w-full">
              <ReactEChartsCore
                echarts={echarts}
                option={getRadarOption(candidate.big5.scores)}
                style={{ height: '100%', width: '100%' }}
              />
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(candidate.big5.scores).map(([trait, score]) => (
                <div key={trait} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800 capitalize">
                      {trait === 'neuroticism' ? 'Emotional Stability' : trait}
                    </span>
                    <span className="text-sm text-gray-600">
                      {trait === 'neuroticism' ? (100 - score) : score}/100
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{traitDescriptions[trait]}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CandidateProfile;