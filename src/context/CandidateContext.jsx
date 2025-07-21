import React, { createContext, useContext, useState, useEffect } from 'react';
import { databaseService } from '../utils/databaseService';
import { toast } from 'react-toastify';

const CandidateContext = createContext();

export const useCandidates = () => {
  const context = useContext(CandidateContext);
  if (!context) {
    throw new Error('useCandidates must be used within a CandidateProvider');
  }
  return context;
};

export const CandidateProvider = ({ children }) => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load candidates from database on mount
  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await databaseService.getCandidates();
      setCandidates(data);
    } catch (err) {
      console.error('Error loading candidates:', err);
      setError(err.message);
      toast.error('Failed to load candidates');
      // Fallback to localStorage if database fails
      const storedCandidates = localStorage.getItem('candidates');
      if (storedCandidates) {
        setCandidates(JSON.parse(storedCandidates));
      }
    } finally {
      setLoading(false);
    }
  };

  const addCandidate = async (candidate) => {
    setLoading(true);
    try {
      const newCandidate = await databaseService.createCandidate({
        ...candidate,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      setCandidates(prev => [newCandidate, ...prev]);
      toast.success('Candidate added successfully');
      return newCandidate;
    } catch (err) {
      console.error('Error adding candidate:', err);
      toast.error('Failed to add candidate');
      
      // Fallback to localStorage
      const fallbackCandidate = {
        ...candidate,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const updatedCandidates = [fallbackCandidate, ...candidates];
      setCandidates(updatedCandidates);
      localStorage.setItem('candidates', JSON.stringify(updatedCandidates));
      return fallbackCandidate;
    } finally {
      setLoading(false);
    }
  };

  const updateCandidate = async (id, updates) => {
    setLoading(true);
    try {
      const updatedCandidate = await databaseService.updateCandidate(id, {
        ...updates,
        updated_at: new Date().toISOString()
      });
      
      setCandidates(prev => prev.map(candidate =>
        candidate.id === id ? updatedCandidate : candidate
      ));
      toast.success('Candidate updated successfully');
      return updatedCandidate;
    } catch (err) {
      console.error('Error updating candidate:', err);
      toast.error('Failed to update candidate');
      
      // Fallback to localStorage
      const updatedCandidates = candidates.map(candidate =>
        candidate.id === id 
          ? { ...candidate, ...updates, updated_at: new Date().toISOString() }
          : candidate
      );
      setCandidates(updatedCandidates);
      localStorage.setItem('candidates', JSON.stringify(updatedCandidates));
    } finally {
      setLoading(false);
    }
  };

  const deleteCandidate = async (id) => {
    setLoading(true);
    try {
      await databaseService.deleteCandidate(id);
      setCandidates(prev => prev.filter(candidate => candidate.id !== id));
      toast.success('Candidate deleted successfully');
    } catch (err) {
      console.error('Error deleting candidate:', err);
      toast.error('Failed to delete candidate');
      
      // Fallback to localStorage
      const updatedCandidates = candidates.filter(candidate => candidate.id !== id);
      setCandidates(updatedCandidates);
      localStorage.setItem('candidates', JSON.stringify(updatedCandidates));
    } finally {
      setLoading(false);
    }
  };

  const getCandidateById = (id) => {
    return candidates.find(candidate => candidate.id === id);
  };

  const uploadDocument = async (file, candidateId) => {
    setLoading(true);
    try {
      const result = await databaseService.uploadDocument(file, candidateId);
      toast.success('Document uploaded successfully');
      return result;
    } catch (err) {
      console.error('Error uploading document:', err);
      toast.error('Failed to upload document');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const saveInterviewSummary = async (candidateId, interviewData) => {
    setLoading(true);
    try {
      const result = await databaseService.saveInterviewSummary(candidateId, interviewData);
      
      // Update local candidate data
      await updateCandidate(candidateId, { interview: interviewData });
      
      toast.success('Interview summary saved successfully');
      return result;
    } catch (err) {
      console.error('Error saving interview summary:', err);
      toast.error('Failed to save interview summary');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const saveBig5Assessment = async (candidateId, assessmentData) => {
    setLoading(true);
    try {
      const result = await databaseService.saveBig5Assessment(candidateId, assessmentData);
      
      // Update local candidate data
      await updateCandidate(candidateId, { big5: assessmentData });
      
      toast.success('Big 5 assessment saved successfully');
      return result;
    } catch (err) {
      console.error('Error saving Big 5 assessment:', err);
      toast.error('Failed to save Big 5 assessment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CandidateContext.Provider
      value={{
        candidates,
        selectedCandidate,
        setSelectedCandidate,
        loading,
        error,
        addCandidate,
        updateCandidate,
        deleteCandidate,
        getCandidateById,
        uploadDocument,
        saveInterviewSummary,
        saveBig5Assessment,
        loadCandidates
      }}
    >
      {children}
    </CandidateContext.Provider>
  );
};