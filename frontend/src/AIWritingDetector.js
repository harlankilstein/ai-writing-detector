```javascript
import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AIWritingDetector = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileRead = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setSelectedFile(file);
    setLoading(true);
    setError(null);
    setAnalysis(null);
    
    try {
      // Simulate analysis for now
      setTimeout(() => {
        setAnalysis({ score: 0.3, metrics: { words: 100, sentences: 10 } });
        setLoading(false);
      }, 2000);
    } catch (err) {
      setError('Failed to process the document.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">AI Writing Pattern Detector</h1>
          <p className="text-lg text-gray-600">Upload a document to analyze writing patterns</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
            </div>
            <input type="file" className="hidden" onChange={handleFileRead} />
          </label>
        </div>

        {loading && (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Analyzing...</p>
          </div>
        )}

        {analysis && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Analysis Complete!</h2>
            <p>Score: {(analysis.score * 100).toFixed(1)}%</p>
            <p>Words: {analysis.metrics.words}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIWritingDetector;
```
