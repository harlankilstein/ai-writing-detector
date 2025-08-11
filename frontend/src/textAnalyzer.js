// Advanced AI Writing Pattern Analysis Engine
// Fixed version with proper scoring

const patterns = {
  structural: {
    uniformParagraphLength: { weight: 0.15, description: "Paragraphs are suspiciously uniform in length" },
    transitionOveruse: { weight: 0.22, description: "Excessive use of transition words between sentences" },
    consistentSentenceLength: { weight: 0.12, description: "Sentences are too consistent in length" },
    repetitiveSentenceStarters: { weight: 0.18, description: "Repetitive sentence opening patterns" },
    uniformListStructure: { weight: 0.12, description: "Lists consistently have same number of items" },
    noRhetoricalQuestions: { weight: 0.08, description: "Complete absence of rhetorical questions" },
    perfectGrammar: { weight: 0.10, description: "Unnaturally perfect grammar with no contractions" }
  },
  
  content: {
    technicalClustering: { weight: 0.25, description: "High concentration of technical jargon" },
    buzzwordClustering: { weight: 0.22, description: "AI buzzwords appear in clusters" },
    overExplaining: { weight: 0.16, description: "Unnecessary over-explanation and context" },
    artificialNeutrality: { weight: 0.15, description: "Artificially balanced viewpoints on all topics" },
    lackPersonalVoice: { weight: 0.18, description: "No personal anecdotes, opinions, or voice" },
    platitudeOveruse: { weight: 0.10, description: "Overuse of platitudes and generic statements" },
    pseudoInsightOveruse: { weight: 0.16, description: "Overuse of pseudo-insightful phrases" }
  },
  
  language: {
    modernHedging: { weight: 0.12, description: "Excessive modern hedging language patterns" },
    formalityInconsistency: { weight: 0.12, description: "Inappropriately formal tone for context" },
    repetitiveStructure: { weight: 0.15, description: "Repetitive sentence and paragraph structures" },
    lackIdioms: { weight: 0.10, description: "Complete absence of idioms or colloquialisms" },
    palpableOveruse: { weight: 0.14, description: "Overuse of overly descriptive words" },
    comprehensiveLanguage: { weight: 0.12, description: "Overly comprehensive and helpful tone" }
  }
};

const wordLists = {
  // Buzzwords and Pretentious Verbs
  buzzwordVerbs: [
    'delve', 'unpack', 'explore', 'embark', 'navigate', 'unearth', 'illuminate', 'catalyze', 
    'facilitate', 'shed light on', 'champion', 'unravel', 'transcend', 'cultivate', 'foster', 
    'harness', 'empower', 'leverage', 'bridge the gap', 'transform', 'pioneer', 'redefine', 
    'revolutionize', 'orchestrate', 'streamline', 'optimize', 'synthesize', 'spearhead',
    'galvanize', 'curate', 'distill'
  ],
  
  // Generic Abstract Nouns
  abstractNouns: [
    'journey', 'tapestry', 'narrative', 'paradigm', 'landscape', 'sphere', 'realm', 'facet',
    'framework', 'construct', 'lens', 'dynamic', 'trajectory', 'blueprint', 'milestone',
    'touchpoint', 'silhouette', 'backdrop', 'vanguard', 'ecosystem', 'architecture'
  ],
  
  // 2025 AI/ML Technical Terms
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
  
  // Common AI-favored Adjectives
  commonAdjectives: [
    'nuanced', 'intricate', 'complex', 'multifaceted', 'dynamic', 'diverse', 'holistic',
    'comprehensive', 'robust', 'strategic', 'transformative', 'insightful', 'innovative',
    'revolutionary', 'groundbreaking', 'pivotal', 'critical', 'essential', 'fundamental',
    'significant', 'notable', 'compelling', 'seamless', 'sophisticated', 'cutting-edge'
  ],
  
  // Common transitions
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

// Safe math operations to prevent NaN - FIXED VERSION
const safeNumber = (value, defaultValue = 0) => {
  if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
    return defaultValue;
  }
  return Math.max(0, value); // Ensure non-negative
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
  
  return { count, foundWords };
};

export const analyzeText = (text) => {
  // Input validation
  if (!text || typeof text !== 'string') {
    return {
      score: 0,
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
      details: ['Text too short for reliable analysis (minimum 50 words required)'],
      metrics: { words: words.length, sentences: sentences.length, paragraphs: paragraphs.length }
    };
  }

  let scores = {};
  let details = [];
  let totalScore = 0;

  // Technical term clustering analysis - MUCH MORE AGGRESSIVE
  const technicalTerms = [...wordLists.aiTechnicalTerms, ...wordLists.buzzwordVerbs, ...wordLists.abstractNouns];
  let clusterScore = 0;
  let foundTerms = [];
  
  sentences.forEach(sentence => {
    if (!sentence) return;
    const sentenceTerms = technicalTerms.filter(term => 
      term && sentence.toLowerCase().includes(term.toLowerCase())
    );
    
    if (sentenceTerms.length > 0) { // Even 1 term contributes
      clusterScore += sentenceTerms.length * 0.5; // Increased multiplier
      foundTerms.push(...sentenceTerms);
    }
  });
  
  if (clusterScore > 0.2) { // Lowered threshold
    const density = clusterScore / Math.max(sentences.length, 1);
    scores.technicalClustering = Math.min(density * 2, 1.0); // More aggressive
    const uniqueTerms = [...new Set(foundTerms)];
    details.push(`Technical jargon detected: ${uniqueTerms.slice(0, 3).join(', ')}`);
  }

  // Buzzword analysis - MORE AGGRESSIVE
  const buzzwordResult = countWords(text, wordLists.buzzwordVerbs);
  const abstractNounResult = countWords(text, wordLists.abstractNouns);
  const adjectiveResult = countWords(text, wordLists.commonAdjectives);
  
  let buzzwordScore = buzzwordResult.count * 0.5 + abstractNounResult.count * 0.4 + adjectiveResult.count * 0.3;
  
  if (buzzwordScore > 0.5) { // Lowered threshold
    const buzzwordDensity = (buzzwordScore / Math.max(words.length, 1)) * 1000;
    scores.buzzwordClustering = Math.min(buzzwordDensity / 5, 1); // More aggressive
    details.push(`AI-style buzzwords found (${buzzwordScore.toFixed(1)} total)`);
  }

  // Personal voice analysis - ALWAYS CHECK
  const personalResult = countWords(text, personalIndicators);
  if (personalResult.count === 0 && words.length > 100) {
    scores.lackPersonalVoice = 0.8; // Higher penalty
    details.push("No personal voice indicators detected");
  }

  // Perfect grammar analysis
  const contractionCount = (text.match(/\b\w+'\w+\b/g) || []).length;
  if (contractionCount === 0 && words.length > 150) {
    scores.perfectGrammar = 0.7; // Higher penalty
    details.push("No contractions - unnaturally formal");
  }

  // Transition word analysis - MORE AGGRESSIVE
  const transitionResult = countWords(text, wordLists.transitions);
  if (transitionResult.count > 0) {
    const transitionDensity = transitionResult.count / Math.max(sentences.length, 1);
    if (transitionDensity > 0.15) { // Lowered threshold
      scores.transitionOveruse = Math.min(transitionDensity * 3, 1); // More aggressive
      details.push(`High transition density: ${(transitionDensity * 100).toFixed(1)}% of sentences`);
    }
  }

  // Sentence structure analysis
  if (sentences.length > 5) {
    const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length).filter(len => !isNaN(len));
    if (sentenceLengths.length > 0) {
      const sentenceVariance = calculateVariance(sentenceLengths);
      const avgSentenceLength = sentenceLengths.reduce((sum, len) => sum + len, 0) / sentenceLengths.length;
      
      if (sentenceVariance < 30 && avgSentenceLength > 10) { // More lenient
        scores.consistentSentenceLength = Math.min((40 - sentenceVariance) / 40, 0.8);
        details.push(`Consistent sentence lengths (variance: ${sentenceVariance.toFixed(1)})`);
      }
    }
  }

  // Paragraph uniformity
  if (paragraphs.length > 2) {
    const paragraphSentenceCounts = paragraphs.map(p => 
      p.split(/[.!?]+/).filter(s => s.trim().length > 10).length
    );
    const paragraphVariance = calculateVariance(paragraphSentenceCounts);
    
    if (paragraphVariance < 2.5 && paragraphs.length > 3) {
      scores.uniformParagraphLength = Math.min((4 - paragraphVariance) / 4, 0.8);
      details.push(`Uniform paragraph structure (variance: ${paragraphVariance.toFixed(2)})`);
    }
  }

  // Calculate weighted total score - FIXED CALCULATION
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

  // Ensure totalScore is never NaN but don't make it too conservative
  totalScore = safeNumber(Math.min(totalScore, 1.0));

  // Apply pattern multiplier for flagrant cases
  const activePatterns = Object.keys(scores).length;
  const strongPatterns = Object.values(scores).filter(score => score > 0.5).length;
  
  if (activePatterns >= 5 && strongPatterns >= 3) {
    totalScore *= 1.4; // 40% boost for obvious AI content
  } else if (activePatterns >= 3 && strongPatterns >= 2) {
    totalScore *= 1.2; // 20% boost for likely AI content
  }
  
  totalScore = Math.min(totalScore, 1.0);

  // Enhanced metrics
  const avgParagraphLength = paragraphs.length > 0 ? 
    (sentences.length / paragraphs.length).toFixed(1) : '0';
  const avgSentenceLength = sentences.length > 0 ? 
    (words.length / sentences.length).toFixed(1) : '0';
  const buzzwordDensity = words.length > 0 ? 
    ((buzzwordResult.count + abstractNounResult.count) / words.length * 1000).toFixed(2) : '0';

  return {
    score: totalScore, // Should now return proper scores
    details: details.length > 0 ? details : ['No significant AI patterns detected'],
    metrics: {
      words: words.length,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      avgParagraphLength,
      avgSentenceLength,
      buzzwordDensity,
      personalVoice: personalResult.count > 0,
      contractions: contractionCount
    }
  };
};
