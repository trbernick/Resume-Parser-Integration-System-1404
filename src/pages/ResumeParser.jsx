import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useCandidates } from '../context/CandidateContext';
import { parseResumeText } from '../utils/resumeParser';
import { parseFile, getSupportedFormats } from '../utils/fileParser';

const { FiUpload, FiUser, FiMail, FiPhone, FiMapPin, FiFile, FiCheck, FiX, FiLoader } = FiIcons;

const ResumeParser = () => {
  const [resumeText, setResumeText] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [parseError, setParseError] = useState(null);
  const { addCandidate, uploadDocument, loading } = useCandidates();

  const supportedFormats = getSupportedFormats();

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsLoading(true);
    setParseError(null);
    setUploadedFile(file);

    try {
      const extractedText = await parseFile(file);
      setResumeText(extractedText);
      toast.success(`Successfully parsed ${file.name}`);
    } catch (error) {
      console.error('Error parsing file:', error);
      setParseError(error.message);
      toast.error(`Failed to parse ${file.name}: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB limit
  });

  const handleParseResume = async () => {
    if (!resumeText.trim()) return;

    setIsLoading(true);
    setParseError(null);

    try {
      const parsed = parseResumeText(resumeText);
      setParsedData(parsed);
      toast.success('Resume parsed successfully');
    } catch (error) {
      console.error('Error parsing resume:', error);
      setParseError(error.message);
      toast.error('Failed to parse resume');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCandidate = async () => {
    if (!parsedData) return;

    setIsLoading(true);
    try {
      const candidate = {
        name: parsedData.name,
        email: parsedData.email,
        phone: parsedData.phone,
        location: parsedData.location,
        resume: {
          raw_text: resumeText,
          parsed_data: parsedData,
          uploaded_at: new Date().toISOString()
        }
      };

      const newCandidate = await addCandidate(candidate);

      // Upload the original file if available
      if (uploadedFile && newCandidate.id) {
        try {
          await uploadDocument(uploadedFile, newCandidate.id);
        } catch (uploadError) {
          console.error('Error uploading document:', uploadError);
          toast.warning('Candidate saved but document upload failed');
        }
      }

      // Reset form
      setResumeText('');
      setParsedData(null);
      setUploadedFile(null);
      setParseError(null);
      
      toast.success('Candidate saved successfully');
    } catch (error) {
      console.error('Error saving candidate:', error);
      toast.error('Failed to save candidate');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setResumeText('');
    setParsedData(null);
    setUploadedFile(null);
    setParseError(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Enhanced Resume Parser</h1>
        <p className="text-gray-600">Upload PDF, DOCX, or TXT files to extract candidate information</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Document Upload</h2>
          
          {/* File Upload Area */}
          <div className="space-y-4">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                isDragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              
              {isLoading ? (
                <div className="space-y-4">
                  <SafeIcon icon={FiLoader} className="w-12 h-12 text-blue-500 mx-auto animate-spin" />
                  <p className="text-gray-600">Processing file...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <SafeIcon icon={FiUpload} className="w-12 h-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-gray-600 mb-2">
                      {isDragActive ? 'Drop the file here' : 'Drag & drop a resume file here, or click to select'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Supported formats: PDF, DOCX, TXT (max 10MB)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Uploaded File Info */}
            {uploadedFile && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiFile} className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-800">{uploadedFile.name}</p>
                      <p className="text-sm text-gray-600">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={resetForm}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <SafeIcon icon={FiX} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Supported Formats */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">Supported Formats</h3>
              <div className="grid grid-cols-1 gap-2">
                {supportedFormats.map((format, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">
                      {format.extension} - {format.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Manual Text Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or paste resume text manually
              </label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Paste resume text here..."
              />
            </div>

            {/* Parse Button */}
            <button
              onClick={handleParseResume}
              disabled={!resumeText.trim() || isLoading}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <SafeIcon icon={FiLoader} className="w-5 h-5 animate-spin" />
                  <span>Parsing...</span>
                </>
              ) : (
                <>
                  <SafeIcon icon={FiFile} className="w-5 h-5" />
                  <span>Parse Resume</span>
                </>
              )}
            </button>

            {/* Error Display */}
            {parseError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiX} className="w-5 h-5 text-red-500" />
                  <p className="text-red-700 font-medium">Parse Error</p>
                </div>
                <p className="text-red-600 text-sm mt-1">{parseError}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Parsed Data Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Extracted Information</h2>
          
          {!parsedData ? (
            <div className="text-center py-12">
              <SafeIcon icon={FiUser} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Upload and parse a resume to see extracted information</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Personal Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiUser} className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">{parsedData.name || 'Not found'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiMail} className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">{parsedData.email || 'Not found'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiPhone} className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">{parsedData.phone || 'Not found'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <SafeIcon icon={FiMapPin} className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">{parsedData.location || 'Not found'}</span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {parsedData.skills.length > 0 ? (
                    parsedData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">No skills detected</span>
                  )}
                </div>
              </div>

              {/* Experience */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Experience</h3>
                <div className="space-y-3">
                  {parsedData.experience.length > 0 ? (
                    parsedData.experience.map((exp, index) => (
                      <div key={index} className="border-l-2 border-blue-500 pl-4">
                        <h4 className="font-medium text-gray-800">{exp.title}</h4>
                        <p className="text-sm text-gray-600">{exp.company}</p>
                        <p className="text-xs text-gray-500">{exp.duration}</p>
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">No experience detected</span>
                  )}
                </div>
              </div>

              {/* Education */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Education</h3>
                <div className="space-y-3">
                  {parsedData.education.length > 0 ? (
                    parsedData.education.map((edu, index) => (
                      <div key={index} className="border-l-2 border-green-500 pl-4">
                        <h4 className="font-medium text-gray-800">{edu.degree}</h4>
                        <p className="text-sm text-gray-600">{edu.institution}</p>
                        <p className="text-xs text-gray-500">{edu.year}</p>
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">No education detected</span>
                  )}
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveCandidate}
                disabled={loading}
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <SafeIcon icon={FiLoader} className="w-5 h-5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <SafeIcon icon={FiCheck} className="w-5 h-5" />
                    <span>Save Candidate</span>
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ResumeParser;