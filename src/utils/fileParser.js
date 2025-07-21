import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const parseFile = async (file) => {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();
  
  try {
    let text = '';
    
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      text = await parsePDF(file);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
      text = await parseDocx(file);
    } else if (fileType === 'application/msword' || fileName.endsWith('.doc')) {
      throw new Error('DOC files are not supported. Please convert to DOCX or PDF format.');
    } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      text = await parseText(file);
    } else {
      throw new Error(`Unsupported file format: ${fileType || 'unknown'}`);
    }
    
    return text;
  } catch (error) {
    console.error('Error parsing file:', error);
    throw error;
  }
};

const parsePDF = async (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    
    fileReader.onload = async (event) => {
      try {
        const arrayBuffer = event.target.result;
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += pageText + '\n';
        }
        
        resolve(fullText);
      } catch (error) {
        reject(new Error(`Failed to parse PDF: ${error.message}`));
      }
    };
    
    fileReader.onerror = () => reject(new Error('Failed to read PDF file'));
    fileReader.readAsArrayBuffer(file);
  });
};

const parseDocx = async (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    
    fileReader.onload = async (event) => {
      try {
        const arrayBuffer = event.target.result;
        const result = await mammoth.extractRawText({ arrayBuffer });
        resolve(result.value);
      } catch (error) {
        reject(new Error(`Failed to parse DOCX: ${error.message}`));
      }
    };
    
    fileReader.onerror = () => reject(new Error('Failed to read DOCX file'));
    fileReader.readAsArrayBuffer(file);
  });
};

const parseText = async (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    
    fileReader.onload = (event) => {
      resolve(event.target.result);
    };
    
    fileReader.onerror = () => reject(new Error('Failed to read text file'));
    fileReader.readAsText(file);
  });
};

export const getSupportedFormats = () => [
  {
    extension: '.pdf',
    mimeType: 'application/pdf',
    description: 'PDF Document'
  },
  {
    extension: '.docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    description: 'Word Document'
  },
  {
    extension: '.txt',
    mimeType: 'text/plain',
    description: 'Text File'
  }
];