export const parseResumeText = (text) => {
  const lines = text.split('\n').filter(line => line.trim());
  
  const result = {
    name: '',
    email: '',
    phone: '',
    location: '',
    skills: [],
    experience: [],
    education: []
  };

  // Extract email
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emailMatch = text.match(emailRegex);
  if (emailMatch) {
    result.email = emailMatch[0];
  }

  // Extract phone
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const phoneMatch = text.match(phoneRegex);
  if (phoneMatch) {
    result.phone = phoneMatch[0];
  }

  // Extract name (usually first line or line before email)
  const nameRegex = /^[A-Z][a-z]+\s+[A-Z][a-z]+/;
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    if (nameRegex.test(lines[i]) && !lines[i].includes('@')) {
      result.name = lines[i].trim();
      break;
    }
  }

  // Extract location
  const locationKeywords = ['Address', 'Location', 'City', 'State'];
  const locationRegex = /\b[A-Z][a-z]+,\s*[A-Z]{2}\b/;
  for (const line of lines) {
    if (locationKeywords.some(keyword => line.includes(keyword)) || locationRegex.test(line)) {
      result.location = line.replace(/^(Address|Location|City|State):\s*/i, '').trim();
      break;
    }
  }

  // Extract skills
  const skillsKeywords = ['Skills', 'Technical Skills', 'Technologies', 'Programming Languages'];
  let skillsSection = false;
  const commonSkills = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'HTML', 'CSS', 'SQL',
    'Git', 'Docker', 'AWS', 'MongoDB', 'PostgreSQL', 'TypeScript', 'Vue.js',
    'Angular', 'Express', 'Django', 'Flask', 'Spring', 'Kubernetes', 'Jenkins'
  ];

  for (const line of lines) {
    if (skillsKeywords.some(keyword => line.toLowerCase().includes(keyword.toLowerCase()))) {
      skillsSection = true;
      continue;
    }
    
    if (skillsSection) {
      if (['Experience', 'Education', 'Work', 'Employment'].some(keyword => 
        line.toLowerCase().includes(keyword.toLowerCase()))) {
        skillsSection = false;
        continue;
      }
      
      const lineSkills = commonSkills.filter(skill => 
        line.toLowerCase().includes(skill.toLowerCase())
      );
      result.skills.push(...lineSkills);
    }
  }

  // Also search for skills throughout the document
  for (const skill of commonSkills) {
    if (text.toLowerCase().includes(skill.toLowerCase()) && !result.skills.includes(skill)) {
      result.skills.push(skill);
    }
  }

  // Extract experience
  const experienceKeywords = ['Experience', 'Work Experience', 'Employment', 'Professional Experience'];
  let experienceSection = false;
  let currentExperience = null;

  for (const line of lines) {
    if (experienceKeywords.some(keyword => line.toLowerCase().includes(keyword.toLowerCase()))) {
      experienceSection = true;
      continue;
    }
    
    if (experienceSection) {
      if (['Education', 'Skills', 'Projects'].some(keyword => 
        line.toLowerCase().includes(keyword.toLowerCase()))) {
        if (currentExperience) {
          result.experience.push(currentExperience);
        }
        experienceSection = false;
        continue;
      }
      
      // Check if line looks like a job title
      if (line.match(/^[A-Z][a-zA-Z\s]+(?:Engineer|Developer|Manager|Analyst|Specialist|Coordinator)/)) {
        if (currentExperience) {
          result.experience.push(currentExperience);
        }
        currentExperience = {
          title: line.trim(),
          company: '',
          duration: ''
        };
      } else if (currentExperience && line.includes('at ') || line.includes('|') || line.includes('-')) {
        const parts = line.split(/\s+at\s+|\s+\|\s+|\s+-\s+/);
        if (parts.length >= 2) {
          currentExperience.company = parts[0].trim();
          currentExperience.duration = parts[1].trim();
        }
      }
    }
  }

  if (currentExperience) {
    result.experience.push(currentExperience);
  }

  // Extract education
  const educationKeywords = ['Education', 'Academic Background', 'Qualifications'];
  let educationSection = false;
  const degreeKeywords = ['Bachelor', 'Master', 'PhD', 'Degree', 'B.S.', 'M.S.', 'B.A.', 'M.A.'];

  for (const line of lines) {
    if (educationKeywords.some(keyword => line.toLowerCase().includes(keyword.toLowerCase()))) {
      educationSection = true;
      continue;
    }
    
    if (educationSection) {
      if (['Experience', 'Skills', 'Projects'].some(keyword => 
        line.toLowerCase().includes(keyword.toLowerCase()))) {
        educationSection = false;
        continue;
      }
      
      if (degreeKeywords.some(keyword => line.includes(keyword))) {
        const parts = line.split(/\s+at\s+|\s+from\s+|\s+-\s+/);
        result.education.push({
          degree: parts[0].trim(),
          institution: parts[1] ? parts[1].trim() : '',
          year: parts[2] ? parts[2].trim() : ''
        });
      }
    }
  }

  // Remove duplicates from skills
  result.skills = [...new Set(result.skills)];

  return result;
};