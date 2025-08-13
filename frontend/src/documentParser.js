import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// Set PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

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
    else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return await parsePdfFile(file);
    }
    else if (fileName.endsWith('.rtf')) {
      return await parseRtfFile(file);
    }
    else {
      throw new Error(`Unsupported file type: ${fileType || 'unknown'}. Please use TXT, DOC, DOCX, PDF, or RTF files.`);
    }
  } catch (error) {
    console.error('Document parsing error:', error);
    throw new Error(`Failed to parse document: ${error.message}`);
  }
};

const parseTextFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      if (!text || text.trim().length === 0) {
        reject(new Error('The file appears to be empty'));
        return;
      }
      resolve(text);
    };
    reader.onerror = () => reject(new Error('Failed to read text file'));
    reader.readAsText(file);
  });
};

const parseDocxFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target.result;
        const result = await mammoth.extractRawText({ arrayBuffer });
        if (!result.value || result.value.trim().length === 0) {
          reject(new Error('No text found in the document'));
          return;
        }
        resolve(result.value);
      } catch (error) {
        reject(new Error(`Failed to parse DOCX: ${error.message}`));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read DOCX file'));
    reader.readAsArrayBuffer(file);
  });
};

const parseDocFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target.result;
        const result = await mammoth.extractRawText({ arrayBuffer });
        if (!result.value || result.value.trim().length === 0) {
          reject(new Error('No text found in the document'));
          return;
        }
        resolve(result.value);
      } catch (error) {
        reject(new Error(`Failed to parse DOC: ${error.message}`));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read DOC file'));
    reader.readAsArrayBuffer(file);
  });
};

const parsePdfFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const typedArray = new Uint8Array(event.target.result);
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
        
        let fullText = '';
        
        // Extract text from each page
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += pageText + '\n';
        }
        
        if (!fullText || fullText.trim().length === 0) {
          reject(new Error('No text content found in PDF. The PDF might contain only images.'));
          return;
        }
        
        resolve(fullText.trim());
      } catch (error) {
        reject(new Error(`Failed to parse PDF: ${error.message}`));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read PDF file'));
    reader.readAsArrayBuffer(file);
  });
};

const parseRtfFile = async (file) => {
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
          return;
        }
        
        resolve(text);
      } catch (error) {
        reject(new Error('Failed to parse RTF file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read RTF file'));
    reader.readAsText(file);
  });
};
