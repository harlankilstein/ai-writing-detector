// AI Writing Pattern Detection Engine
// Analyzes text for patterns commonly found in AI-generated content

export const analyzeText = (text) => {
  if (!text || typeof text !== 'string') {
    return { score: 0, details: [], metrics: {} };
  }

  const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);

  let score = 0;
  const details = [];
  const metrics = {
    words: words.length,
    sentences: sentences.length,
    paragraphs: paragraphs.length,
    avgSentenceLength: Math.round(words.length / sentences.length) || 0,
    avgParagraphLength: Math.round(sentences.length / paragraphs.length) || 0
  };

  // AI-common transition words and phrases
  const aiTransitions = [
    'furthermore', 'moreover', 'additionally', 'consequently', 'nevertheless',
    'nonetheless', 'therefore', 'thus', 'hence', 'accordingly', 'subsequently',
    'in conclusion', 'to summarize', 'in summary', 'ultimately', 'essentially'
  ];

  // AI-common buzzwords
  const aiBuzzwords = [
    'leverage', 'optimize', 'streamline', 'enhance', 'facilitate', 'utilize',
    'comprehensive', 'robust', 'innovative', 'cutting-edge', 'state-of-the-art',
    'paradigm', 'synergy', 'holistic', 'scalable', 'seamless'
  ];

  // Formal/academic phrases common in AI writing
  const formalPhrases = [
    'it is important to note', 'it should be mentioned', 'it is worth noting',
    'one must consider', 'it is essential to', 'it is crucial to understand',
    'in order to', 'with regard to', 'in terms of', 'by means of'
  ];

  // Check for excessive transition word usage
  let transitionCount = 0;
  aiTransitions.forEach(transition => {
    const regex = new RegExp(`\\b${transition}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) transitionCount += matches.length;
  });

  const transitionDensity = (transitionCount / words.length) * 100;
  metrics.transitionDensity = Math.round(transitionDensity * 10) / 10;

  if (transitionDensity > 2) {
    score += 0.15;
    details.push(`High density of transition words (${transitionDensity.toFixed(1)}%) suggests formulaic structure`);
  }

  // Check for buzzword density
  let buzzwordCount = 0;
  aiBuzzwords.forEach(buzzword => {
    const regex = new RegExp(`\\b${buzzword}\\b`, 'gi');
    const matches = text.match(regex);
    if (matches) buzzwordCount += matches.length;
  });

  const buzzwordDensity = (buzzwordCount / words.length) * 100;
  metrics.buzzwordDensity = Math.round(buzzwordDensity * 10) / 10;

  if (buzzwordDensity > 1.5) {
    score += 0.12;
    details.push(`High concentration of business buzzwords suggests AI generation`);
  }

  // Check for formal phrase patterns
  let formalCount = 0;
  formalPhrases.forEach(phrase => {
    const regex = new RegExp(phrase.replace(/\s+/g, '\\s+'), 'gi');
    if (regex.test(text)) formalCount++;
  });

  if (formalCount > 2) {
    score += 0.1;
    details.push(`Multiple formal academic phrases indicate AI writing patterns`);
  }

  // Check paragraph uniformity (AI tends to write uniform paragraphs)
  if (paragraphs.length > 2) {
    const paragraphLengths = paragraphs.map(p => p.split(/[.!?]+/).length);
    const avgLength = paragraphLengths.reduce((a, b) => a + b, 0) / paragraphLengths.length;
    const variance = paragraphLengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / paragraphLengths.length;
    
    if (variance < 2 && avgLength > 3) {
      score += 0.08;
      details.push('Unusually uniform paragraph structure throughout document');
    }
  }

  // Check for personal voice indicators
  const personalIndicators = ['i think', 'i believe', 'in my opinion', 'personally', 'i feel', 'my experience'];
  const hasPersonalVoice = personalIndicators.some(indicator => 
    text.toLowerCase().includes(indicator)
  );
  metrics.personalVoice = hasPersonalVoice;

  if (!hasPersonalVoice && words.length > 100) {
    score += 0.05;
    details.push('Lack of personal voice or subjective language');
  }

  // Check for contractions (AI often avoids them)
  const contractions = text.match(/\b\w+[''](?:t|re|ve|ll|d|s)\b/g) || [];
  metrics.contractions = contractions.length;

  if (contractions.length === 0 && words.length > 100) {
    score += 0.05;
    details.push('Complete absence of contractions suggests formal AI writing');
  }

  // Check sentence length variance
  const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);
  if (sentenceLengths.length > 0) {
    const avgSentenceLength = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
    const sentenceVariance = sentenceLengths.reduce((sum, len) => sum + Math.pow(len - avgSentenceLength, 2), 0) / sentenceLengths.length;
    
    if (sentenceVariance < 10 && avgSentenceLength > 15) {
      score += 0.1;
      details.push('Consistently similar sentence lengths indicate AI generation');
    }
  }

  // Check for rhetorical questions
  const questions = text.match(/\?/g) || [];
  metrics.questions = questions.length;

  // Normalize score to 0-1 range
  score = Math.min(score, 1);

  return {
    score: Math.round(score * 100) / 100,
    details,
    metrics
  };
};
