import supabase from '../lib/supabase';

export const databaseService = {
  // Candidates table operations
  async createCandidate(candidateData) {
    const { data, error } = await supabase
      .from('candidates_hrm2024')
      .insert([candidateData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getCandidates() {
    const { data, error } = await supabase
      .from('candidates_hrm2024')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getCandidateById(id) {
    const { data, error } = await supabase
      .from('candidates_hrm2024')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateCandidate(id, updates) {
    const { data, error } = await supabase
      .from('candidates_hrm2024')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteCandidate(id) {
    const { error } = await supabase
      .from('candidates_hrm2024')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Documents table operations
  async uploadDocument(file, candidateId) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${candidateId}_${Date.now()}.${fileExt}`;
    const filePath = `resumes/${fileName}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Save document metadata to database
    const { data: docData, error: docError } = await supabase
      .from('documents_hrm2024')
      .insert([{
        candidate_id: candidateId,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        file_type: file.type,
        upload_date: new Date().toISOString()
      }])
      .select()
      .single();

    if (docError) throw docError;

    return {
      document: docData,
      storageData: uploadData
    };
  },

  async getDocumentsByCandidate(candidateId) {
    const { data, error } = await supabase
      .from('documents_hrm2024')
      .select('*')
      .eq('candidate_id', candidateId)
      .order('upload_date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getDocumentUrl(filePath) {
    const { data } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  },

  // Interview summaries operations
  async saveInterviewSummary(candidateId, interviewData) {
    const { data, error } = await supabase
      .from('interview_summaries_hrm2024')
      .insert([{
        candidate_id: candidateId,
        ...interviewData,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getInterviewSummaries(candidateId) {
    const { data, error } = await supabase
      .from('interview_summaries_hrm2024')
      .select('*')
      .eq('candidate_id', candidateId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Big 5 assessments operations
  async saveBig5Assessment(candidateId, assessmentData) {
    const { data, error } = await supabase
      .from('big5_assessments_hrm2024')
      .insert([{
        candidate_id: candidateId,
        ...assessmentData,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getBig5Assessment(candidateId) {
    const { data, error } = await supabase
      .from('big5_assessments_hrm2024')
      .select('*')
      .eq('candidate_id', candidateId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }
};