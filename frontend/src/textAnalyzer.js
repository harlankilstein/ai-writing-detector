// Advanced AI Writing Pattern Analysis Engine - Enhanced with Turnitin Insights
// Shows all possibilities with appropriate confidence levels and NaN protection

const patterns = {
  structural: {
    uniformParagraphLength: { weight: 0.12, description: "Paragraphs are suspiciously uniform in length" },
    transitionOveruse: { weight: 0.18, description: "Excessive use of transition words between sentences" },
    consistentSentenceLength: { weight: 0.08, description: "Sentences are too consistent in length" },
    repetitiveSentenceStarters: { weight: 0.15, description: "Repetitive sentence opening patterns" },
    uniformListStructure: { weight: 0.10, description: "Lists consistently have same number of items" },
    noRhetoricalQuestions: { weight: 0.06, description: "Complete absence of rhetorical questions" },
    perfectGrammar: { weight: 0.08, description: "Unnaturally perfect grammar with no contractions" },
    predictableFlow: { weight: 0.14, description: "Predictable information architecture" }
  },
  
  content: {
    technicalClustering: { weight: 0.22, description: "High concentration of technical jargon" },
    buzzwordClustering: { weight: 0.18, description: "AI buzzwords appear in clusters" },
    overExplaining: { weight: 0.16, description: "Unnecessary over-explanation and context" },
    artificialNeutrality: { weight: 0.14, description: "Artificially balanced viewpoints on all topics" },
    lackPersonalVoice: { weight: 0.15, description: "No personal anecdotes, opinions, or voice" },
    platitudeOveruse: { weight: 0.08, description: "Overuse of platitudes and generic statements" },
    pseudoInsightOveruse: { weight: 0.12, description: "Overuse of pseudo-insightful phrases" }
  },
  
  language: {
    modernHedging: { weight: 0.13, description: "Excessive modern hedging language patterns" },
    formalityInconsistency: { weight: 0.10, description: "Inappropriately formal tone for context" },
    repetitiveStructure: { weight: 0.12, description: "Repetitive sentence and paragraph structures" },
    lackIdioms: { weight: 0.08, description: "Complete absence of idioms or colloquialisms" },
    palpableOveruse: { weight: 0.11, description: "Overuse of overly descriptive words" },
    comprehensiveLanguage: { weight: 0.12, description: "Overly comprehensive and helpful tone" }
  }
};

const wordLists = {
  buzzwordVerbs: [
    'delve', 'unpack', 'explore', 'embark', 'navigate', 'unearth', 'illuminate', 'catalyze', 
    'facilitate', 'shed light on', 'champion', 'unravel', 'transcend', 'cultivate', 'foster', 
    'harness', 'empower', 'leverage', 'bridge the gap', 'transform', 'pioneer', 'redefine', 
    'revolutionize', 'orchestrate', 'streamline', 'optimize', 'synthesize', 'spearhead',
    'galvanize', 'curate', 'distill'
  ],
  
  abstractNouns: [
    'journey', 'tapestry', 'narrative', 'paradigm', 'landscape', 'sphere', 'realm', 'facet',
    'framework', 'construct', 'lens', 'dynamic', 'trajectory', 'blueprint', 'milestone',
    'touchpoint', 'silhouette', 'backdrop', 'vanguard', 'ecosystem', 'architecture'
  ],
  
  aiTechnicalTerms: [
    'transformer-based', 'reinforcement learning', 'RLHF', 'embeddings alignment', 
    'retrieval-augmented generation', 'RAG', 'epistemic grounding', 'meta-loss functions',
    'chain-of-thought', 'CoT', 'few-shot inference', 'zero-shot', 'multimodal fusion',
    'vector databases', 'approximate nearest neighbor', 'ANN', 'foundation models',
    'large language models', 'LLMs', 'cognitive architecture', 'agentic interoperability',
    'agentic orchestration', 'cross-attention mechanisms', 'semantic retrieval',
    'contextual augmentation', 'hallucination risk', 'policy-based decision trees',
    'emergent behaviors', 'self-reflective gradient descent', 'model quantization',
    'low-rank adaptation', 'LoRA', 'federated learning', 'differential privacy',
    'secure multiparty computation', 'SMPC', 'neuro-symbolic integration',
    'gradient-based learning', 'synthetic data generation', 'generative adversarial networks',
    'GANs', 'diffusion models', 'adversarial robustness', 'model inversion',
    'knowledge distillation', 'sparse attention mechanisms', 'digital twin environments',
    'autonomous cognitive ecosystems', 'artificial general intelligence', 'AGI',
    'post-transformer epoch', 'perplexity metrics', 'epistemic', 'probabilistic consistency',
    'stateful sessions', 'edge deployment', 'federated learning paradigms'
  ],
  
  commonAdjectives: [
    'nuanced', 'intricate', 'complex', 'multifaceted', 'dynamic', 'diverse', 'holistic',
    'comprehensive', 'robust', 'strategic', 'transformative', 'insightful', 'innovative',
    'revolutionary', 'groundbreaking', 'pivotal', 'critical', 'essential', 'fundamental',
    'significant', 'notable', 'compelling', 'seamless', 'sophisticated', 'cutting-edge'
  ],
  
  modernHedging: [
    "it's worth noting that", "it's important to consider", "it's crucial to understand",
    "one might argue", "it could be argued", "it's essential to recognize",
    "it's interesting to note", "worth mentioning", "it's valuable to explore",
    "particularly noteworthy", "especially relevant", "notably significant"
  ],
  
  overExplanationPhrases: [
    "let me break this down", "to put this in perspective", "here's what this means",
    "to elaborate further", "in other words", "to clarify", "more specifically",
    "essentially what this means", "the key thing to understand", "put simply"
  ],
  
  predictableOpeners: [
    "in today's fast-paced world", "in the current landscape", "as we navigate",
    "in an era where", "given the complexity of", "when we consider",
    "as we explore", "in the context of", "it's clear that", "there's no doubt that"
  ],
  
  transitions: [
    'furthermore', 'moreover', 'additionally', 'however', 'nevertheless', 
    'consequently', 'therefore', 'thus', 'hence', 'accordingly', 'similarly',
    'likewise', 'conversely', 'on the other hand', 'in contrast', 'alternatively',
    'meanwhile', 'subsequently', 'concurrently', 'simultaneously'
  ]
};

const personalIndicators = [
  'i think', 'i believe', 'in my opinion', 'personally', 'i feel', 'my experience',
  'i have found', 'i remember', 'i noticed', 'from my perspective', 'i would argue',
  'i disagree', 'i agree', 'honestly', 'frankly', 'to be honest', 'my take is',
  'i\'ve seen', 'i\'ve learned', 'in my view', 'i hate', 'i love', 'i\'m not sure'
];

const contextualThresholds = {
  academic: { technicalJargon: 0.15, formalTone: 0.20, complexSentences: 0.18, buzzwords: 0.12 },
  business: { technicalJargon: 0.10, formalTone: 0.15, complexSentences: 0.12, buzzwords: 0.08 },
  creative: { technicalJargon: 0.05, formalTone: 0.08, complexSentences: 0.10, buzzwords: 0.04 },
  casual: { technicalJargon: 0.03, formalTone: 0.05, complexSentences: 0.08, buzzwords: 0.03 }
};

const safeNumber = (value, defaultValue = 0) => {
  return isNaN(value) || !isFinite(value) ? defaultValue : value;
};

const safeDivision = (numerator, denominator, defaultValue = 0) => {
  if (denominator === 0 || isNaN(numerator) || isNaN(denominator)) {
    return defaultValue;
  }
  const result = numerator / denominator;
  return isNaN(result) || !isFinite(result) ? defaultValue : result;
};

const calculateVariance = (numbers) => {
  if (!numbers || numbers.length === 0) return 0;
  const validNumbers = numbers.filter(n => !isNaN(n) && isFinite(n));
  if (validNumbers.length === 0) return 0;
  
  const mean = validNumbers.reduce((sum, num) => sum + num, 0) / validNumbers.length;
  const squaredDiffs = validNumbers.map(num => Math.pow(num - mean, 2));
  return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / validNumbers.length;
};

const countWords = (text, wordList) => {
  if (!text || !wordList) return { count: 0, foundWords: [] };
  
  const textLower = text.toLowerCase();
  let count = 0;
  let foundWords = [];
  
  wordList.forEach(word => {
    if (!word) return;
    try {
      const escapedWord = word.replace(/'/g, "'").replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedWord}\\b`, 'gi');
      const matches = textLower.match(regex);
      if (matches) {
        count += matches.length;
        foundWords.push(word);
      }
    } catch (e) {
      // Skip invalid regex patterns
    }
  });
  
  return { count: safeNumber(count), foundWords };
};

const countPhrases = (text, phraseList) => {
  if (!text || !phraseList) return { count: 0, foundPhrases: [] };
  
  const textLower = text.toLowerCase();
  let count = 0;
  const foundPhrases = [];
  
  phraseList.forEach(phrase => {
    if (!phrase) return;
    if (textLower.includes(phrase.toLowerCase())) {
      count++;
      foundPhrases.push(phrase);
    }
  });
  
  return { count: safeNumber(count), foundPhrases };
};

const detectContentContext = (text, words) => {
  if (!text || !words) return 'casual';
  
  const academicIndicators = ['research', 'study', 'analysis', 'methodology', 'findings', 'conclusion'];
  const businessIndicators = ['strategy', 'growth', 'market', 'revenue', 'stakeholder', 'ROI'];
  const creativeIndicators = ['story', 'character', 'scene', 'narrative', 'plot', 'imagination'];
  
  const academicCount = academicIndicators.filter(word => text.toLowerCase().includes(word)).length;
  const businessCount = businessIndicators.filter(word => text.toLowerCase().includes(word)).length;
  const creativeCount = creativeIndicators.filter(word => text.toLowerCase().includes(word)).length;
  
  if (academicCount >= 2) return 'academic';
  if (businessCount >= 2) return 'business';
  if (creativeCount >= 2) return 'creative';
  return 'casual';
};

const calculateConfidenceLevel = (scores, clusters, words, context) => {
  const activePatterns = Object.keys(scores).length;
  const strongPatterns = Object.values(scores).filter(score => safeNumber(score) > 0.5).length;
  const clusterCount = Array.isArray(clusters) ? clusters.length : 0;
  
  let confidence = 'Minimal';
  let certainty = 'Some isolated indicators detected';
  let reasoning = [];
  
  if (activePatterns === 1 && strongPatterns === 0) {
    confidence = 'Low';
    certainty = 'Single AI pattern detected - could be coincidental';
    reasoning.push('Only one type of AI indicator found');
  } else if (activePatterns >= 2 && strongPatterns >= 1) {
    confidence = 'Medium';
    certainty = 'Multiple AI patterns detected - likely AI assistance';
    reasoning.push(`${activePatterns} different pattern types detected`);
  } else if (activePatterns >= 4 && strongPatterns >= 2) {
    confidence = 'High';
    certainty = 'Strong AI patterns detected - very likely AI-generated';
    reasoning.push(`${activePatterns} patterns with ${strongPatterns} strong indicators`);
  } else if (activePatterns >= 6 && strongPatterns >= 3) {
    confidence = 'Very High';
    certainty = 'Extensive AI patterns detected - almost certainly AI-generated';
    reasoning.push(`${activePatterns} patterns with ${strongPatterns} strong indicators`);
  }
  
  if (clusterCount > 0) {
    reasoning.push(`${clusterCount} clusters of AI indicators found`);
  }
  
  return { 
    level: confidence, 
    certainty, 
    reasoning,
    contextAdjustment: context !== 'casual' ? `Adjusted for ${context} context` : null
  };
};

export const analyzeText = (text) => {
  if (!text || typeof text !== 'string') {
    return {
      score: 0,
      confidence: { level: 'Insufficient', certainty: 'No text provided' },
      details: ['No text provided for analysis'],
      metrics: { words: 0, sentences: 0, paragraphs: 0 }
    };
  }

  const sentences = text.split(/[.!?]+/).filter(s => s && s.trim().length > 10);
  const paragraphs = text.split(/\n\s*\n/).filter(p => p && p.trim().length > 0);
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  
  if (words.length < 50) {
    return {
      score: 0,
      confidence: { level: 'Insufficient', certainty: 'Text too short for analysis' },
      details: ['Text too short for reliable analysis (minimum 50 words required)'],
      metrics: { words: words.length, sentences: sentences.length, paragraphs: paragraphs.length }
    };
  }

  const context = detectContentContext(text, words);
  const thresholds = contextualThresholds[context] || contextualThresholds.casual;

  let scores = {};
  let details = [];
  let totalScore = 0;

  const technicalTerms = [...wordLists.aiTechnicalTerms, ...wordLists.buzzwordVerbs, ...wordLists.abstractNouns];
  let clusterScore = 0;
  let foundTerms = [];
  
  sentences.forEach(sentence => {
    if (!sentence) return;
    const sentenceTerms = technicalTerms.filter(term => 
      term && sentence.toLowerCase().includes(term.toLowerCase())
    );
    
    if (sentenceTerms.length > 0) {
      clusterScore += sentenceTerms.length * 0.3;
      foundTerms.push(...sentenceTerms);
    }
  });
  
  if (clusterScore > 0.5) {
    const density = safeDivision(clusterScore, sentences.length);
    scores.technicalClustering = Math.min(density * 1.5, 1.0);
    const uniqueTerms = [...new Set(foundTerms)];
    details.push(`Technical jargon detected: ${uniqueTerms.slice(0, 3).join(', ')}`);
  }

  const buzzwordResult = countWords(text, wordLists.buzzwordVerbs);
  const abstractNounResult = countWords(text, wordLists.abstractNouns);
  const adjectiveResult = countWords(text, wordLists.commonAdjectives);
  
  let buzzwordScore = safeNumber(buzzwordResult.count * 0.4 + abstractNounResult.count * 0.3 + adjectiveResult.count * 0.2);
  
  if (buzzwordScore > 0) {
    const buzzwordDensity = safeDivision(buzzwordScore, words.length) * 1000;
    scores.buzzwordClustering = Math.min(safeDivision(buzzwordDensity, 8), 1);
    details.push(`AI-style buzzwords found (${buzzwordScore.toFixed(1)} total)`);
  }

  const personalResult = countWords(text, personalIndicators);
  if (personalResult.count === 0 && words.length > 100) {
    scores.lackPersonalVoice = 0.6;
    details.push("No personal voice indicators detected");
  }

  const contractionCount = (text.match(/\b\w+'\w+\b/g) || []).length;
  if (contractionCount === 0 && words.length > 150) {
    scores.perfectGrammar = 0.5;
    details.push("No contractions - unnaturally formal");
  }

  const transitionResult = countWords(text, wordLists.transitions);
  if (transitionResult.count > 0) {
    const transitionDensity = safeDivision(transitionResult.count, sentences.length);
    if (transitionDensity > thresholds.complexSentences) {
      scores.transitionOveruse = Math.min(transitionDensity * 2, 1);
      details.push(`High transition density: ${(transitionDensity * 100).toFixed(1)}% of sentences`);
    }
  }

  if (sentences.length > 5) {
    const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length).filter(len => !isNaN(len));
    const sentenceVariance = calculateVariance(sentenceLengths);
    const avgSentenceLength = sentenceLengths.length > 0 ? 
      sentenceLengths.reduce((sum, len) => sum + len, 0) / sentenceLengths.length : 0;
    
    if (sentenceVariance < 35 && avgSentenceLength > 12) {
      scores.consistentSentenceLength = Math.min(safeDivision(50 - sentenceVariance, 50), 0.7);
      details.push(`Consistent sentence lengths (variance: ${sentenceVariance.toFixed(1)})`);
    }
  }

  Object.keys(scores).forEach(key => {
    let patternWeight = 0.1;
    
    Object.values(patterns).forEach(patternGroup => {
      if (patternGroup[key]) {
        patternWeight = patternGroup[key].weight;
      }
    });
    
    const scoreValue = safeNumber(scores[key]);
    totalScore += scoreValue * patternWeight;
  });

  totalScore *= safeNumber(thresholds.formalTone, 1.0);
  totalScore = safeNumber(Math.min(totalScore, 1.0));
  
  if (isNaN(totalScore) || totalScore < 0) {
    totalScore = 0;
  }

  const confidence = calculateConfidenceLevel(scores, [], words, context);

  const avgParagraphLength = paragraphs.length > 0 ? 
    safeDivision(sentences.length, paragraphs.length).toFixed(1) : '0';
  const avgSentenceLength = sentences.length > 0 ? 
    safeDivision(words.length, sentences.length).toFixed(1) : '0';
  const buzzwordDensity = words.length > 0 ? 
    safeDivision((buzzwordResult.count + abstractNounResult.count), words.length * 1000).toFixed(2) : '0';

  return {
    score: totalScore,
    confidence,
    details: details.length > 0 ? details : ['No significant AI patterns detected'],
    context,
    metrics: {
      words: words.length,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      avgParagraphLength,
      avgSentenceLength,
      buzzwordDensity,
      personalVoice: personalResult.count > 0,
      contractions: contractionCount,
      contextType: context
    }
  };
};
