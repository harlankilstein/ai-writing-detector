import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, BarChart3, FileX, Globe, LogOut } from 'lucide-react';
import { analyzeText } from './textAnalyzer';
import { parseDocument, validateFile } from './documentParser';
import { useAuth } from './AuthContext';
import AuthModal from './AuthModal';
import TrialStatus from './TrialStatus';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AIWritingDetector = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [googleDocUrl, setGoogleDocUrl] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisSource, setAnalysisSource] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signup');

  const { user, token, logout, isAuthenticated, loading: authLoading, isTrialExpired } = useAuth();

  const getLikertRating = (score) => {
    if (score < 0.2) return { 
      level: "Very Unlikely AI", 
      color: "text-green-700", 
      bgColor: "bg-green-50 border-green-200",
      barColor: "bg-green-500"
    };
    if (score < 0.4) return { 
      level: "Unlikely AI", 
      color: "text-green-600", 
      bgColor: "bg-green-25 border-green-100",
      barColor: "bg-green-400"
    };
    if (score < 0.6) return { 
      level: "Possibly AI", 
      color: "text-yellow-700", 
      bgColor: "bg-yellow-50 border-yellow-200",
      barColor: "bg-yellow-500"
    };
    if (score < 0.8) return { 
      level: "Likely AI", 
      color: "text-orange-700", 
      bgColor: "bg-orange-50 border-orange-200",
      barColor: "bg-orange-500"
    };
    return { 
      level: "Very Likely AI", 
      color: "text-red-700", 
      bgColor: "bg-red-50 border-red-200",
      barColor: "bg-red-500"
    };
  };

  const handleFileRead = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!isAuthenticated) {
      setAuthMode('signup');
      setShowAuthModal(true);
      return;
    }

    if (isTrialExpired()) {
      setError('Your trial has expired. Please upgrade to continue using the service.');
      return;
    }
    
    setSelectedFile(file);
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setAnalysisSource('file');
    
    try {
      // Validate file before parsing
      validateFile(file);
      
      const text = await parseDocument(file);
      
      if (!text || text.trim().length < 50) {
        throw new Error('Document appears to be empty or too short to analyze (minimum 50 characters required).');
      }

      const analysisResult = analyzeText(text);
      setAnalysis(analysisResult);
    } catch (err) {
      console.error('Error processing file:', err);
      setError(err.message || 'Failed to process the document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleDocAnalysis = async () => {
    if (!googleDocUrl.trim()) return;
    
    if (!isAuthenticated) {
      setAuthMode('signup');
      setShowAuthModal(true);
      return;
    }

    if (isTrialExpired()) {
      setError('Your trial has expired. Please upgrade to continue using the service.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setAnalysis(null);
    setAnalysisSource('google-doc');
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/analyze-google-doc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          doc_url: googleDocUrl.trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 402) {
          setError(errorData.detail);
          return;
        }
        throw new Error(errorData.detail || 'Failed to fetch Google Doc');
      }

      const result = await response.json();
      
      if (!result.success || !result.content) {
        throw new Error(result.error || 'Failed to extract content from Google Doc');
      }

      if (result.content.trim().length < 50) {
        throw new Error('Google Doc appears to be empty or too short to analyze (minimum 50 characters required).');
      }

      const analysisResult = analyzeText(result.content);
      setAnalysis(analysisResult);
      
    } catch (err) {
      console.error('Error processing Google Doc:', err);
      setError(err.message || 'Failed to process the Google Doc. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setGoogleDocUrl('');
    setAnalysis(null);
    setError(null);
    setAnalysisSource('');
  };

  const rating = analysis ? getLikertRating(analysis.score) : null;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-start mb-8">
          <div className="text-center flex-grow">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">AI Writing Pattern Detector</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Upload a document to analyze writing patterns, structure, and characteristics that may indicate AI generation.
              This tool focuses on patterns rather than individual word flags.
            </p>
            <p className="text-sm text-blue-600 font-medium mt-2">
              The analysis is very quick. Scroll down for results.
            </p>
          </div>

          <div className="flex items-center space-x-4 ml-6">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">{user.email}</p>
                  <p className="text-xs text-gray-500">
                    {user.subscription_status === 'trial' ? 'Free Trial' : user.subscription_status}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setAuthMode('signup'); setShowAuthModal(true); }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Free Trial
                </button>
              </div>
            )}
          </div>
        </div>

        {isAuthenticated && <TrialStatus />}

        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
          mode={authMode}
        />

        <div className="analysis-card mb-6">
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">Supports: TXT, DOC, DOCX, RTF files (Max 10MB)</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".txt,.doc,.docx,.rtf"
              onChange={handleFileRead}
            />
          </label>
        </div>

        <div className="flex items-center mb-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <div className="mx-4 text-gray-500 font-medium">OR</div>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="analysis-card mb-6">
          <div className="flex items-center mb-4">
            <Globe className="w-6 h-6 mr-3 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Analyze Google Doc</h3>
          </div>
          
          <div className="space-y-3">
            <input
              type="url"
              placeholder="Paste your Google Docs link here..."
              value={googleDocUrl}
              onChange={(e) => setGoogleDocUrl(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-4 h-4 mt-1 mr-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-1"></div>
              </div>
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> The Google Doc must be shared with "Anyone with the link can view" permissions to be analyzed.
              </p>
            </div>
            
            <button
              onClick={handleGoogleDocAnalysis}
              disabled={!googleDocUrl.trim() || loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Analyzing Google Doc...' : 'Analyze Google Doc'}
            </button>
            
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>How it works:</strong></p>
                <p>• We extract text content directly from your Google Doc</p>
                <p>• Advanced AI pattern analysis identifies writing characteristics</p>
                <p>• Get detailed confidence scores and explanations</p>
                <p>• Same accuracy as file uploads - now with improved extraction</p>
              </div>
            </div>
            
            <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-xs text-gray-700 space-y-2">
                <p><strong>⚠️ Important Disclaimer:</strong></p>
                <p>AI and detection tools are constantly changing. Many AI tools give out false positives when something is 100% human content. Use all AI detection tools with caution.</p>
                
                <div className="pt-2 border-t border-yellow-200 mt-3">
                  <p><strong>🔒 Privacy Policy:</strong></p>
                  <p>We will never sell or spam your email address. It's not cool.</p>
                </div>
              </div>
            </div>
          </div>

          {googleDocUrl && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Google Doc Ready</p>
                    <p className="text-xs text-green-600">
                      {googleDocUrl.length > 60 ? googleDocUrl.substring(0, 60) + '...' : googleDocUrl}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClear}
                  className="p-1 text-green-600 hover:text-green-800 transition-colors"
                  title="Clear URL"
                >
                  <FileX className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {loading && (
          <div className="analysis-card text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">
              {analysisSource === 'google-doc' ? 'Fetching and analyzing Google Doc...' : 'Analyzing writing patterns...'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {analysisSource === 'google-doc' 
                ? 'Please wait while we access your Google Doc and analyze its content'
                : 'This may take a few moments for large documents'
              }
            </p>
          </div>
        )}

        {error && (
          <div className="analysis-card bg-red-50 border-red-200 mb-6">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-800 mb-1">Error Processing Document</h3>
                <p className="text-red-700">{error}</p>
                <button
                  onClick={handleClear}
                  className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                  Try Another File
                </button>
              </div>
            </div>
          </div>
        )}

        {analysis && (
          <div className="space-y-6">
            <div className={`analysis-card ${rating.bgColor} border-2`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Analysis Result</h2>
                {analysis.score < 0.4 ? (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-orange-600" />
                )}
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className={`text-2xl font-bold ${rating.color} mb-2`}>{rating.level}</p>
                  <p className="text-gray-600 mb-4">
                    Confidence Score: <span className="font-semibold">{(analysis.score * 100).toFixed(1)}%</span>
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>AI Likelihood</span>
                      <span className="font-medium">{(analysis.score * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${rating.barColor}`}
                        style={{ width: `${analysis.score * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="metric-card">
                    <p className="text-2xl font-bold text-gray-800">{analysis.metrics.words}</p>
                    <p className="text-sm text-gray-600">Words</p>
                  </div>
                  <div className="metric-card">
                    <p className="text-2xl font-bold text-gray-800">{analysis.metrics.sentences}</p>
                    <p className="text-sm text-gray-600">Sentences</p>
                  </div>
                  <div className="metric-card">
                    <p className="text-2xl font-bold text-gray-800">{analysis.metrics.paragraphs}</p>
                    <p className="text-sm text-gray-600">Paragraphs</p>
                  </div>
                  <div className="metric-card">
                    <p className="text-2xl font-bold text-gray-800">{analysis.metrics.avgSentenceLength}</p>
                    <p className="text-sm text-gray-600">Avg Length</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="analysis-card">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <BarChart3 className="w-6 h-6 mr-2 text-blue-600" />
                Pattern Analysis Details
              </h3>
              
              {analysis.details && analysis.details.length > 0 ? (
                <div className="space-y-3">
                  {analysis.details.map((detail, index) => (
                    <div key={index} className="flex items-start p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <AlertCircle className="w-5 h-5 mr-3 mt-0.5 text-yellow-600 flex-shrink-0" />
                      <span className="text-sm text-gray-800">{detail}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                  <p className="text-gray-600">No significant AI patterns detected in the writing structure.</p>
                </div>
              )}
            </div>

            <div className="analysis-card">
              <h3 className="text-xl font-bold mb-4">Writing Characteristics</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">Personal Voice:</span>
                  <span className={`font-semibold ${analysis.metrics.personalVoice ? 'text-green-600' : 'text-red-600'}`}>
                    {analysis.metrics.personalVoice ? 'Present' : 'Absent'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">Contractions:</span>
                  <span className="font-semibold">{analysis.metrics.contractions}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">Transition Density:</span>
                  <span className="font-semibold">{analysis.metrics.transitionDensity}%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">Buzzword Density:</span>
                  <span className="font-semibold">{analysis.metrics.buzzwordDensity}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">Avg Paragraph:</span>
                  <span className="font-semibold">{analysis.metrics.avgParagraphLength} sentences</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">Rhetorical Questions:</span>
                  <span className="font-semibold">{analysis.metrics.questions || 0}</span>
                </div>
              </div>
            </div>

            <div className="analysis-card bg-blue-50 border-blue-200">
              <h3 className="font-bold text-blue-800 mb-3">How This Analysis Works</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    Analyzes structural patterns like paragraph uniformity
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    Detects overuse of transition words and formal language
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    Checks for absence of personal voice and contractions
                  </li>
                </ul>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    Identifies clustering of AI-associated terms
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    Uses weighted scoring rather than simple word counting
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    Focuses on patterns that indicate formulaic writing
                  </li>
                </ul>
              </div>
            </div>

            <div className="analysis-card bg-red-50 border-red-200">
              <h3 className="font-bold text-red-800 mb-3">⚠️ No Refunds Notice</h3>
              <p className="text-sm text-red-700">
                Please note that all payments are final. We do not offer refunds for subscription purchases. 
                Please ensure you understand the service before purchasing.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIWritingDetector;
