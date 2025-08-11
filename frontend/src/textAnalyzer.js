// Advanced AI Writing Pattern Analysis Engine - Aggressive Detection

const patterns = {
  structural: {
    uniformParagraphLength: { weight: 0.15, description: "Paragraphs are suspiciously uniform in length" },
    transitionOveruse: { weight: 0.25, description: "Excessive use of transition words between sentences" },
    consistentSentenceLength: { weight: 0.12, description: "Sentences are too consistent in length" },
    repetitiveSentenceStarters: { weight: 0.20, description: "Repetitive sentence opening patterns" },
    noRhetoricalQuestions: { weight: 0.10, description: "Complete absence of rhetorical questions" },
    perfectGrammar: { weight: 0.12, description: "Unnaturally perfect grammar with no contractions" }
  },
  
  content: {
    technicalClustering: { weight: 0.30, description: "High concentration of technical jargon" },
    buzzwordClustering: { weight: 0.25, description: "AI buzzwords appear in clusters" },
    artificialNeutrality: { weight: 0.15, description: "Artificially balanced viewpoints on all topics" },
    lackPersonalVoice: { weight: 0.20, description: "No personal anecdotes, opinions, or voice" },
    pseudoInsightOveruse: { weight: 0.18, description: "Overuse of pseudo-insightful phrases" }
  },
  
  language: {
    modernHedging: { weight: 0.15, description: "Excessive modern hedging language patterns" },
    formalityInconsistency: { weight: 0.12, description: "Inappropriately formal tone for context" },
    repetitiveStructure: { weight: 0.18, description: "Repetitive sentence and paragraph structures" },
    lackIdioms: { weight: 0.10, description: "Complete absence of idioms or colloquialisms" }
  }
};

const highRiskWords = [
  // AI Technical Terms - Very High Risk
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
  'stateful sessions', 'edge deployment', 'federated learning paradigms',
  
  // Buzzword Verbs
  'delve', 'unpack', 'explore', 'embark', 'navigate', 'unearth', 'illuminate', 'catalyze', 
  'facilitate', 'shed light on', 'champion', 'unravel', 'transcend', 'cultivate', 'foster', 
  'harness', 'empower', 'leverage', 'bridge the gap', 'transform', 'pioneer', 'redefine', 
  'revolutionize', 'orchestrate', 'streamline', 'optimize', 'synthesize', 'spearhead',
  'galvanize', 'curate', 'distill',
  
  // Abstract Nouns
  'journey', 'tapestry', 'narrative', 'paradigm', 'landscape', 'sphere', 'realm', 'facet',
  'framework', 'construct', 'lens', 'dynamic', 'trajectory', 'blueprint', 'milestone',
  'touchpoint', 'silhouette', 'backdrop', 'vanguard', 'ecosystem', 'architecture',
  
  // AI Adjectives
  'nuanced', 'intricate', 'complex', 'multifaceted', 'dynamic', 'diverse', 'holistic',
  'comprehensive', 'robust', 'strategic', 'transformative', 'insightful', 'innovative',
  'revolutionary', 'groundbreaking', 'pivotal', 'critical', 'essential', 'fundamental',
  'significant', 'notable', 'compelling', 'seamless', 'sophisticated', 'cutting-edge'
];

const transitionWords = [
  'furthermore', 'moreover', 'additionally', 'however', 'nevertheless', 
  'consequently', 'therefore', 'thus', 'hence', 'accordingly', 'similarly',
  'likewise', 'conversely', 'on the other hand', 'in contrast', 'alternatively',
  'meanwhile', 'subsequently', 'concurrently', 'simultaneously'
];

const aiPhrases = [
  'in the current epoch', 'catalyzed a tectonic shift', 'ushering in an era', 
  'this emergent ecosystem', 'at the core of this transformation', 'concurrently',
  'from a deployment standpoint', 'emerging research in', 'in parallel',
  'on the horizon', 'finally, the convergence of', 'as we advance into this',
  'it\'s worth noting', 'it\'s important to consider', 'one might argue',
  'it could be argued', 'particularly noteworthy', 'especially relevant'
];

const personalIndicators = [
  'i think', 'i believe', 'in my opinion', 'personally', 'i feel', 'my experience',
  'i have found', 'i remember', 'i noticed', 'from my perspective', 'i would argue',
  'i disagree', 'i agree', 'honestly', 'frankly', 'to be honest', 'i hate', 'i love'
];

const calculateVariance = (numbers) => {
  if (numbers.length === 0) return 0;
  const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2));
  return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / numbers.length;
};

const countWords = (text, wordList) => {
  const textLower = text.toLowerCase();
  let count = 0;
  let foundWords = [];
  
  wordList.forEach(word => {
    const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matches = textLower.match(regex) || [];
    if (matches.length > 0) {
      count += matches.length;
      foundWords.push(word);
    }
  });
  
  return { count, foundWords };
};

const countPhrases = (text, phraseList) => {
  const textLower = text.toLowerCase();
  let count = 0;
  const foundPhrases = [];
  
  phraseList.forEach(phrase => {
    if (textLower.includes(phrase.toLowerCase())) {
      count++;
      foundPhrases.push(phrase);
    }
  });
  
  return { count, foundPhrases };
};

export const analyzeText = (text) => {
  if (!text || typeof text !== 'string') {
    return {
      score: 0,
      details: ['No text provided for analysis'],
      metrics: { words: 0, sentences: 0, paragraphs: 0 }
    };
  }

  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
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

  // HIGH-RISK WORD ANALYSIS - EXTREMELY AGGRESSIVE
  const highRiskResult = countWords(text, highRiskWords);
  if (highRiskResult.count > 0) {
    const density = (highRiskResult.count / words.length) * 1000;
    let riskScore = Math.min(density / 3, 1.0); // Very aggressive
    
    // MASSIVE BONUS for AI technical terms
    const aiTerms = highRiskResult.foundWords.filter(word => 
      ['transformer-based', 'reinforcement learning', 'RLHF', 'epistemic', 'agentic', 'multimodal', 'embeddings', 'RAG'].some(term => word.includes(term))
    );
    
    if (aiTerms.length > 0) {
      riskScore = Math.min(riskScore * 3, 1.0); // Triple score for AI terms
    }
    
    scores.technicalClustering = riskScore;
    details.push(`High-risk AI terms detected: ${highRiskResult.foundWords.slice(0, 5).join(', ')}`);
  }

  // TRANSITION WORD OVERUSE - VERY AGGRESSIVE
  const transitionResult = countWords(text, transitionWords);
  if (transitionResult.count > 0) {
    const transitionDensity = transitionResult.count / sentences.length;
    if (transitionDensity > 0.1) { // Very low threshold
      scores.transitionOveruse = Math.min(transitionDensity * 5, 1.0); // Very aggressive multiplier
      details.push(`Excessive transitions: ${(transitionDensity * 100).toFixed(1)}% of sentences`);
    }
  }

  // AI PHRASE DETECTION - INSTANT HIGH SCORE
  const phraseResult = countPhrases(text, aiPhrases);
  if (phraseResult.count > 0) {
    scores.pseudoInsightOveruse = Math.min(phraseResult.count * 0.4, 1.0);
    details.push(`AI phrases detected: ${phraseResult.foundPhrases.slice(0, 3).join(', ')}`);
  }

  // PERSONAL VOICE - HARSH PENALTY
  const personalResult = countWords(text, personalIndicators);
  if (personalResult.count === 0 && words.length > 100) {
    scores.lackPersonalVoice = 0.9; // Very harsh penalty
    details.push("No personal voice indicators detected");
  }

  // PERFECT GRAMMAR - HARSH PENALTY
  const contractionCount = (text.match(/\b\w+'\w+\b/g) || []).length;
  if (contractionCount === 0 && words.length > 150) {
    scores.perfectGrammar = 0.8;
    details.push("No contractions - unnaturally formal");
  }

  // SENTENCE CONSISTENCY - AGGRESSIVE
  if (sentences.length > 5) {
    const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);
    const sentenceVariance = calculateVariance(sentenceLengths);
    const avgSentenceLength = sentenceLengths.reduce((sum, len) => sum + len, 0) / sentenceLengths.length;
    
    if (sentenceVariance < 40 && avgSentenceLength > 15) { // Detect long, consistent sentences
      scores.consistentSentenceLength = Math.min((60 - sentenceVariance) / 60, 0.9);
      details.push(`Highly consistent sentence structure (variance: ${sentenceVariance.toFixed(1)})`);
    }
  }

  // PARAGRAPH CONSISTENCY - AGGRESSIVE
  if (paragraphs.length > 2) {
    const paragraphSentenceCounts = paragraphs.map(p => 
      p.split(/[.!?]+/).filter(s => s.trim().length > 10).length
    );
    const paragraphVariance = calculateVariance(paragraphSentenceCounts);
    
    if (paragraphVariance < 3.0 && paragraphs.length > 3) {
      scores.uniformParagraphLength = Math.min((5 - paragraphVariance) / 5, 0.8);
      details.push(`Uniform paragraph structure detected`);
    }
  }

  // CALCULATE FINAL SCORE - MUCH MORE AGGRESSIVE
  Object.keys(scores).forEach(key => {
    let patternWeight = 0.15; // Higher base weight
    
    Object.values(patterns).forEach(patternGroup => {
      if (patternGroup[key]) {
        patternWeight = patternGroup[key].weight;
      }
    });
    
    totalScore += scores[key] * patternWeight;
  });

  // FLAGRANT CONTENT MULTIPLIER - VERY AGGRESSIVE
  const activePatterns = Object.keys(scores).length;
  const strongPatterns = Object.values(scores).filter(score => score > 0.4).length;
  
  if (activePatterns >= 4 && strongPatterns >= 2) {
    totalScore *= 1.8; // Massive boost for obvious AI
    details.unshift("Multiple strong AI patterns detected - confidence boost applied");
  } else if (activePatterns >= 3 && strongPatterns >= 1) {
    totalScore *= 1.4; // Big boost for likely AI
  } else if (activePatterns >= 2) {
    totalScore *= 1.2; // Moderate boost
  }

  totalScore = Math.min(totalScore, 1.0);

  // If it's obvious AI content, ensure minimum score
  if (highRiskResult.count > 5 && personalResult.count === 0 && contractionCount === 0) {
    totalScore = Math.max(totalScore, 0.85); // Minimum 85% for obvious AI
  }

  return {
    score: totalScore,
    details: details.length > 0 ? details : ['No significant AI patterns detected'],
    metrics: {
      words: words.length,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      personalVoice: personalResult.count > 0,
      contractions: contractionCount,
      highRiskTerms: highRiskResult.count,
      transitionDensity: transitionResult.count > 0 ? (transitionResult.count / sentences.length * 100).toFixed(1) + '%' : '0%'
    }
  };
};
