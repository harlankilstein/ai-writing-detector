// Document parsing utilities for different file types
import * as pdfjsLib from 'pdfjs-dist';

// Set worker path for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

/**
 * Parse different document types and extract text content
 * @param {File} file - The uploaded file
 * @returns {Promise<string>} - Extracted text content
 */
export const parseDocument = async (file) => {
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();
  
  try {
    // Handle text files
    if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      return await parseTextFile(file);
    }
    
    // Handle Microsoft Word documents
    if (fileType.includes('document') || 
        fileType.includes('wordprocessing') ||
        fileName.endsWith('.doc') || 
        fileName.endsWith('.docx')) {
      return await parseWordDocument(file);
    }
    
    // Handle PDF files
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return await parsePDFDocument(file);
    }
    
    // Handle RTF files
    if (fileType.includes('rtf') || fileName.endsWith('.rtf')) {
      return await parseRTFDocument(file);
    }
    
    // Fallback: try to read as plain text
    return await parseTextFile(file);
    
  } catch (error) {
    throw new Error(`Failed to parse ${file.name}: ${error.message}`);
  }
};

/**
 * Parse plain text files
 */
const parseTextFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        if (!text || text.trim().length === 0) {
          reject(new Error('The file appears to be empty'));
        }
        resolve(text);
      } catch (error) {
        reject(new Error('Failed to read text file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read the file'));
    };
    
    reader.readAsText(file, 'utf-8');
  });
};

/**
 * Parse Microsoft Word documents using mammoth
 */
const parseWordDocument = async (file) => {
  try {
    // Dynamic import for mammoth (only load when needed)
    const mammoth = await import('mammoth');
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target.result;
          const result = await mammoth.extractRawText({ arrayBuffer });
          
          if (!result.value || result.value.trim().length === 0) {
            reject(new Error('No text content found in the Word document'));
          }
          
          // Log any conversion messages for debugging
          if (result.messages && result.messages.length > 0) {
            console.warn('Word document conversion messages:', result.messages);
          }
          
          resolve(result.value);
        } catch (error) {
          reject(new Error(`Failed to extract text from Word document: ${error.message}`));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read Word document file'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  } catch (importError) {
    throw new Error('Word document support not available. Please use a plain text file.');
  }
};

/**
 * Parse PDF documents using pdf.js
 */
const parsePDFDocument = async (file) => {
  try {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target.result;
          const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
          const pdf = await loadingTask.promise;
          
          let fullText = '';
          
          // Extract text from all pages
          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
          }
          
          if (!fullText || fullText.trim().length === 0) {
            reject(new Error('No text content found in the PDF document'));
          }
          
          resolve(fullText.trim());
        } catch (error) {
          reject(new Error(`Failed to extract text from PDF: ${error.message}`));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read PDF file'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  } catch (error) {
    throw new Error(`PDF parsing error: ${error.message}`);
  }
};

/**
 * Parse RTF documents
 */
const parseRTFDocument = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const rtfContent = event.target.result;
        
        // Basic RTF to plain text conversion
        let text = rtfContent
          .replace(/\\[a-z][a-z0-9]*\s?/g, '')
          .replace(/[{}]/g, '')
          .replace(/\s+/g, ' ')
          .trim();
        
        if (!text || text.length === 0) {
          reject(new Error('No readable text found in RTF file'));
        }
        
        resolve(text);
      } catch (error) {
        reject(new Error('Failed to parse RTF file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read RTF file'));
    };
    
    reader.readAsText(file, 'utf-8');
  });
};

/**
 * Validate file before processing
 */
export const validateFile = (file) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const supportedTypes = [
    'text/plain',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/pdf',
    'application/rtf',
    'text/rtf'
  ];
  
  const supportedExtensions = ['.txt', '.doc', '.docx', '.pdf', '.rtf'];
  
  if (!file) {
    throw new Error('No file provided');
  }
  
  if (file.size > maxSize) {
    throw new Error('File size exceeds 10MB limit');
  }
  
  const fileName = file.name.toLowerCase();
  const hasValidExtension = supportedExtensions.some(ext => fileName.endsWith(ext));
  const hasValidType = supportedTypes.includes(file.type);
  
  if (!hasValidExtension && !hasValidType) {
    throw new Error('Unsupported file type. Please use TXT, DOC, DOCX, PDF, or RTF files.');
  }
  
  return true;
};
