import React from 'react';
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

// Register required ECharts components
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  RadarChart,
  CanvasRenderer
]);

const Big5Assessment = () => {
  const { candidates } = useCandidates();

  const traitDescriptions = {
    openness: 'Openness to Experience - Creativity, curiosity, and openness to new ideas',
    conscientiousness: 'Conscientiousness - Organization, responsibility, and goal-oriented behavior',
    extraversion: 'Extraversion - Social engagement, energy, and assertiveness',
    agreeableness: 'Agreeableness - Cooperation, compassion, and consideration for others',
    neuroticism: 'Emotional Stability - Stress resistance, emotional control, and adaptability'
  };

  // Prepare data for radar chart
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

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Personality Profiles Overview
        </h1>
        <p className="text-gray-600">
          Visualizing Big 5 personality traits across candidates
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {candidates
          .filter(candidate => candidate.big5)
          .map(candidate => (
            <motion.div
              key={candidate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiIcons.FiUser} className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {candidate.name || 'Unnamed Candidate'}
                  </h3>
                </div>
              </div>

              <div className="h-[400px] w-full">
                <ReactEChartsCore
                  echarts={echarts}
                  option={getRadarOption(candidate.big5.scores)}
                  style={{ height: '100%', width: '100%' }}
                />
              </div>

              <div className="mt-6 space-y-4">
                <h4 className="font-semibold text-gray-800">Trait Analysis:</h4>
                {Object.entries(candidate.big5.scores).map(([trait, score]) => (
                  <div key={trait} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {trait === 'neuroticism' ? 'Emotional Stability' : trait}
                      </span>
                      <span className="text-sm text-gray-600">
                        {trait === 'neuroticism' ? (100 - score) : score}/100
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {traitDescriptions[trait]}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

        {candidates.filter(c => c.big5).length === 0 && (
          <div className="lg:col-span-2 text-center py-12">
            <SafeIcon
              icon={FiIcons.FiBarChart}
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
            />
            <p className="text-gray-500 text-lg">
              No personality assessments available
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Big5Assessment;