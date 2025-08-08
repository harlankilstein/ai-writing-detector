import React, { useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';

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
      // Simple mock analysis for now
      setTimeout(() => {
        setAnalysis({
          score: 0.3,
          level: 'Unlikely AI',
          metrics: { words: 150, sentences: 12, paragraphs: 3 }
        });
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
              <p className="text-xs text-gray-500">TXT, DOC, DOCX, RTF files</p>
            </div>
            <input type="file" className="hidden" onChange={handleFileRead} />
          </label>

          {selectedFile && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-800">{selectedFile.name}</p>
                  <p className="text-xs text-blue-600">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {loading && (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Analyzing writing patterns...</p>
          </div>
        )}

        {analysis && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Analysis Result</h2>
            <div className="mb-4">
              <p className="text-xl font-semibold text-green-700 mb-2">{analysis.level}</p>
              <p className="text-gray-600">Confidence Score: {(analysis.score * 100).toFixed(1)}%</p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded">
                <p className="text-2xl font-bold">{analysis.metrics.words}</p>
                <p className="text-sm text-gray-600">Words</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <p className="text-2xl font-bold">{analysis.metrics.sentences}</p>
                <p className="text-sm text-gray-600">Sentences</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <p className="text-2xl font-bold">{analysis.metrics.paragraphs}</p>
                <p className="text-sm text-gray-600">Paragraphs</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-800">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIWritingDetector;
