// Document parsing utilities for different file types

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

const parseWordDocument = async (file) => {
  try {
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

const parseRTFDocument = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const rtfContent = event.target.result;
        
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

export const validateFile = (file) => {
  const maxSize = 10 * 1024 * 1024;
  const supportedTypes = [
    'text/plain',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/rtf',
    'text/rtf'
  ];
  
  const supportedExtensions = ['.txt', '.doc', '.docx', '.rtf'];
  
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
    throw new Error('Unsupported file type. Please use TXT, DOC, DOCX, or RTF files.');
  }
  
  return true;
};
