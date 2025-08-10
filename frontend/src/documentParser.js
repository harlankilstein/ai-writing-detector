import mammoth from 'mammoth';

export const parseDocument = async (file) => {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  try {
    // Handle different file types
    if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      return await parseTextFile(file);
    } 
    else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
      return await parseDocxFile(file);
    }
    else if (fileType === 'application/msword' || fileName.endsWith('.doc')) {
      return await parseDocFile(file);
    }
    else if (fileName.endsWith('.rtf')) {
      return await parseRtfFile(file);
    }
    else {
      throw new Error(`Unsupported file type: ${fileType || 'unknown'}. Please use TXT, DOC, DOCX, or RTF files.`);
    }
  } catch (error) {
    console.error('Document parsing error:', error);
    throw new Error(`Failed to parse document: ${error.message}`);
  }
};

const parseTextFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        if (!text || text.trim().length === 0) {
          reject(new Error('The text file appears to be empty.'));
          return;
        }
        resolve(text);
      } catch (error) {
        reject(new Error('Failed to read text file.'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read the file.'));
    };
    
    reader.readAsText(file);
  });
};

const parseDocxFile = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    if (!result.value || result.value.trim().length === 0) {
      throw new Error('The Word document appears to be empty or contains no readable text.');
    }
    
    // Log any warnings from mammoth
    if (result.messages && result.messages.length > 0) {
      console.warn('Document parsing warnings:', result.messages);
    }
    
    return result.value;
  } catch (error) {
    if (error.message.includes('not a valid docx file')) {
      throw new Error('Invalid DOCX file. Please ensure the file is not corrupted.');
    }
    throw new Error(`Failed to parse DOCX file: ${error.message}`);
  }
};

const parseDocFile = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    if (!result.value || result.value.trim().length === 0) {
      throw new Error('The Word document appears to be empty or contains no readable text.');
    }
    
    return result.value;
  } catch (error) {
    throw new Error(`Failed to parse DOC file: ${error.message}. Note: Some older DOC formats may not be fully supported.`);
  }
};

const parseRtfFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const rtfContent = e.target.result;
        
        // Basic RTF text extraction (removes RTF control codes)
        // This is a simplified parser - for production, consider a dedicated RTF library
        let text = rtfContent
          .replace(/\\[a-z0-9-]+\s?/gi, '') // Remove RTF control words
          .replace(/[{}]/g, '') // Remove braces
          .replace(/\\\\/g, '\\') // Unescape backslashes
          .replace(/\\'/g, "'") // Unescape quotes
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim();
        
        if (!text || text.length === 0) {
          reject(new Error('The RTF file appears to be empty or contains no readable text.'));
          return;
        }
        
        resolve(text);
      } catch (error) {
        reject(new Error('Failed to parse RTF file.'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read the RTF file.'));
    };
    
    reader.readAsText(file);
  });
};

// Utility function to validate file size
export const validateFileSize = (file, maxSizeMB = 10) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error(`File size exceeds ${maxSizeMB}MB limit. Please use a smaller file.`);
  }
  return true;
};

// Utility function to validate file type
export const validateFileType = (file) => {
  const allowedTypes = [
    'text/plain',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/rtf'
  ];
  
  const allowedExtensions = ['.txt', '.doc', '.docx', '.rtf'];
  const fileName = file.name.toLowerCase();
  
  const hasValidType = allowedTypes.includes(file.type);
  const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
  
  if (!hasValidType && !hasValidExtension) {
    throw new Error('Unsupported file type. Please use TXT, DOC, DOCX, or RTF files.');
  }
  
  return true;
};
