// Minimal test version of textAnalyzer
export const analyzeText = (text) => {
  console.log("analyzeText called with:", text ? `${text.length} characters` : 'no text');
  
  if (!text || typeof text !== 'string') {
    return {
      score: 0,
      details: ['No text provided'],
      metrics: { words: 0, sentences: 0, paragraphs: 0 }
    };
  }

  const words = text.split(/\s+/).filter(w => w.length > 0);
  
  return {
    score: 0.3, // Fixed test score
    details: ['TEST: Analysis working - found ' + words.length + ' words'],
    metrics: {
      words: words.length,
      sentences: text.split(/[.!?]+/).length,
      paragraphs: text.split(/\n\s*\n/).length,
      personalVoice: true,
      contractions: 0
    }
  };
};
