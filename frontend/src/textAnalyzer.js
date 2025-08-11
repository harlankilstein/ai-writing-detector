// Advanced AI Writing Pattern Analysis Engine
// Shows all possibilities with appropriate confidence levels

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
  // From your CSV - Buzzwords and Pretentious Verbs
  buzzwordVerbs: [
    'delve', 'unpack', 'explore', 'embark', 'navigate', 'unearth', 'illuminate', 'catalyze', 
    'facilitate', 'shed light on', 'champion', 'unravel', 'transcend', 'cultivate', 'foster', 
    'harness', 'empower', 'leverage', 'bridge the gap', 'transform', 'pioneer', 'redefine', 
    'revolutionize', 'orchestrate', 'streamline', 'optimize', 'synthesize', 'spearhead',
    'galvanize', 'curate', 'distill'
  ],
  
  // From your CSV - Generic Abstract Nouns
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
  
  // From your CSV - Common Adjectives (AI favorites)
  commonAdjectives: [
    'nuanced', 'intricate', 'complex', 'multifaceted', 'dynamic', 'diverse', 'holistic',
    'comprehensive', 'robust', 'strategic', 'transformative', 'insightful', 'innovative',
    'revolutionary', 'groundbreaking', 'pivotal', 'critical', 'essential', 'fundamental',
    'significant', 'notable', 'compelling', 'seamless', 'sophisticated', 'cutting-edge'
  ],
  
  // Modern AI Hedging (2025 patterns)
  modernHedging: [
    "it's worth noting that", "it's important to consider", "it's crucial to understand",
    "one might argue", "it could be argued", "it's essential to recognize",
    "it's interesting to note", "worth mentioning", "it's valuable to explore",
    "particularly noteworthy", "especially relevant", "notably significant"
  ],
  
  // Over-explanation patterns (ChatGPT/Claude style)
  overExplanationPhrases: [
    "let me break this down", "to put this in perspective", "here's what this means",
    "to elaborate further", "in other words", "to clarify", "more specifically",
    "essentially what this means", "the key thing to understand", "put simply"
  ],
  
  // Predictable openers that AI loves
  predictableOpeners: [
    "in today's fast-paced world", "in the current landscape", "as we navigate",
    "in an era where", "given the complexity of", "when we consider",
    "as we explore", "in the context of", "it's clear that", "there's no doubt that"
  ],
  
  // AI's favorite transitions
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

// Context-aware thresholds
const contextualThresholds = {
  academic: {
    technicalJargon: 0.15,
    formalTone: 0.20,
    complexSentences: 0.18,
    buzzwords: 0.12
  },
  business: {
    technicalJargon: 0.10,
    formalTone: 0.15,
    complexSentences: 0.12,
    buzzwords: 0.08
  },
  creative: {
    technicalJargon: 0.05,
    formalTone: 0.08,
    complexSentences: 0.10,
    buzzwords: 0.04
  },
  casual: {
    technicalJargon: 0.03,
    formalTone: 0.05,
    complexSentences: 0.08,
    buzzwords: 0.03
  }
};

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
    const escapedWord = word.replace(/'/g, "'").replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedWord}\\b`, 'gi');
    const matches = textLower.match(regex);
    if (matches) {
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

// Detect content context to adjust thresholds
const detectContentContext = (text, words) => {
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

// Semantic clustering - group related AI indicators
const analyzeSemanticClusters = (text, sentences) => {
  const clusters = [];
  let currentCluster = [];
  
  sentences.forEach((sentence, index) => {
    const indicators = {
      aiWords: countWords(sentence, [...wordLists.buzzwordVerbs, ...wordLists.abstractNouns]).count,
      techTerms: countWords(sentence, wordLists.aiTechnicalTerms).count,
      hedging: countPhrases(sentence, wordLists.modernHedging).count,
      transitions: countWords(sentence, wordLists.transitions).count
    };
    
    const totalIndicators = Object.values(indicators).reduce((sum, count) => sum + count, 0);
    
    if (totalIndicators >= 1) { // Any indicator starts a potential cluster
      currentCluster.push({ 
        sentence: index, 
        indicators: totalIndicators,
        types: Object.keys(indicators).filter(key => indicators[key] > 0)
      });
    } else if (currentCluster.length > 0) {
      if (currentCluster.length >= 1) clusters.push([...currentCluster]); // Even single instances are clusters
      currentCluster = [];
    }
  });
  
  if (currentCluster.length > 0) {
    clusters.push(currentCluster);
  }
  
  return clusters;
};

// Modern AI pattern detection
const analyzeModernAIPatterns = (text, sentences, words) => {
  const patterns = {};
  
  // Over-explanation detection
  const explanationPhrases = countPhrases(text, wordLists.overExplanationPhrases);
  if (explanationPhrases.count > 0) {
    patterns.overExplaining = {
      score: Math.min(explanationPhrases.count * 0.3, 0.8),
      evidence: explanationPhrases.foundPhrases.slice(0, 2)
    };
  }
  
  // Artificial neutrality (lack of strong opinions)
  const strongOpinions = ['definitely', 'absolutely', 'never', 'always', 'terrible', 'amazing', 'love', 'hate'];
  const opinionCount = countWords(text, strongOpinions).count;
  const neutralityRatio = sentences.length / Math.max(opinionCount, 1);
  
  if (neutralityRatio > 10 && sentences.length > 5) {
    patterns.artificialNeutrality = {
      score: Math.min(neutralityRatio / 20, 0.7),
      evidence: `Only ${opinionCount} strong opinions in ${sentences.length} sentences`
    };
  }
  
  // Comprehensive language (AI being overly helpful)
  const comprehensiveWords = ['comprehensive', 'thorough', 'detailed', 'complete', 'extensive', 'in-depth'];
  const comprehensiveCount = countWords(text, comprehensiveWords);
  if (comprehensiveCount.count > 0) {
    patterns.comprehensiveLanguage = {
      score: Math.min(comprehensiveCount.count * 0.25, 0.6),
      evidence: comprehensiveCount.foundWords.slice(0, 3)
    };
  }
  
  return patterns;
};

// Calculate confidence level based on pattern convergence
const calculateConfidenceLevel = (scores, clusters, words, context) => {
  const activePatterns = Object.keys(scores).length;
  const strongPatterns = Object.values(scores).filter(score => score > 0.5).length;
  const clusterCount = clusters.length;
  const totalClusterSize = clusters.reduce((sum, cluster) => sum + cluster.length, 0);
  
  // Adjust for context
  const contextMultiplier = context === 'academic' ? 0.8 : context === 'casual' ? 1.2 : 1.0;
  
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
  
  if (totalClusterSize > 5) {
    reasoning.push('High concentration of AI patterns');
  }
  
  return { 
    level: confidence, 
    certainty, 
    reasoning,
    contextAdjustment: contextMultiplier !== 1.0 ? `Adjusted for ${context} context` : null
  };
};

// Generate actionable insights for users
const generateActionableInsights = (analysis, context) => {
  const insights = {
    primaryConcerns: [],
    suggestions: [],
    contextNote: null
  };
  
  // Identify primary concerns
  const sortedScores = Object.entries(analysis.scores)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);
  
  sortedScores.forEach(([pattern, score]) => {
    if (score > 0.3) {
      const patternInfo = Object.values(patterns).find(group => group[pattern]);
      if (patternInfo) {
        insights.primaryConcerns.push(patternInfo[pattern].description);
      }
    }
  });
  
  // Generate suggestions based on detected patterns
  if (analysis.scores.lackPersonalVoice > 0.3) {
    insights.suggestions.push('Add personal examples, experiences, or opinions');
  }
  if (analysis.scores.technicalClustering > 0.3) {
    insights.suggestions.push('Use simpler, more conversational language');
  }
  if (analysis.scores.perfectGrammar > 0.3) {
    insights.suggestions.push('Include some contractions and informal expressions');
  }
  if (analysis.scores.artificialNeutrality > 0.3) {
    insights.suggestions.push('Take clearer stances on topics and express stronger opinions');
  }
  if (analysis.scores.repetitiveStructure > 0.3) {
    insights.suggestions.push('Vary sentence lengths and paragraph structures');
  }
  
  // Context-specific notes
  if (context === 'casual' && analysis.confidence.level !== 'Minimal') {
    insights.contextNote = 'For casual content, this level of formality and structure is unusual';
  } else if (context === 'academic' && analysis.confidence.level === 'High') {
    insights.contextNote = 'Even for academic writing, this shows unusually consistent AI patterns';
  }
  
  return insights;
};

export const analyzeText = (text) => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  
  if (words.length < 50) {
    return {
      score: 0,
      confidence: { level: 'Insufficient', certainty: 'Text too short for analysis' },
      details: ['Text too short for reliable analysis (minimum 50 words required)'],
      insights: { primaryConcerns: [], suggestions: [], contextNote: 'Need more content to analyze' },
      metrics: { words: words.length, sentences: sentences.length, paragraphs: paragraphs.length }
    };
  }

  // Detect content context
  const context = detectContentContext(text, words);
  const thresholds = contextualThresholds[context];

  let scores = {};
  let details = [];
  let totalScore = 0;

  // Analyze semantic clusters
  const clusters = analyzeSemanticClusters(text, sentences);
  
  // Modern AI pattern analysis
  const modernPatterns = analyzeModernAIPatterns(text, sentences, words);
  Object.assign(scores, modernPatterns);

  // Technical term clustering analysis
  const technicalTerms = [...wordLists.aiTechnicalTerms, ...wordLists.buzzwordVerbs, ...wordLists.abstractNouns];
  let clusterScore = 0;
  let foundTerms = [];
  
  sentences.forEach(sentence => {
    const sentenceTerms = technicalTerms.filter(term => 
      sentence.toLowerCase().includes(term.toLowerCase())
    );
    
    if (sentenceTerms.length > 0) { // Even single terms contribute
      clusterScore += sentenceTerms.length * 0.3;
      foundTerms.push(...sentenceTerms);
    }
  });
  
  if (clusterScore > 0.5) {
    const density = clusterScore / sentences.length;
    scores.technicalClustering = Math.min(density * 1.5, 1.0);
    const uniqueTerms = [...new Set(foundTerms)];
    details.push(`Technical jargon detected: ${uniqueTerms.slice(0, 3).join(', ')}`);
  }

  // Buzzword analysis - show even single instances
  const buzzwordResult = countWords(text, wordLists.buzzwordVerbs);
  const abstractNounResult = countWords(text, wordLists.abstractNouns);
  const adjectiveResult = countWords(text, wordLists.commonAdjectives);
  
  let buzzwordScore = buzzwordResult.count * 0.4 + abstractNounResult.count * 0.3 + adjectiveResult.count * 0.2;
  
  if (buzzwordScore > 0) { // Show even single buzzwords
    const buzzwordDensity = buzzwordScore / words.length * 1000;
    scores.buzzwordClustering = Math.min(buzzwordDensity / 8, 1);
    details.push(`AI-style buzzwords found (${buzzwordScore.toFixed(1)} total)`);
  }

  // Hedging language analysis
  const hedgingResult = countWords(text, wordLists.modernHedging);
  if (hedgingResult.count > 0) {
    const hedgingDensity = hedgingResult.count / sentences.length;
    scores.modernHedging = Math.min(hedgingDensity * 2, 0.8);
    details.push(`Modern AI hedging patterns: ${hedgingResult.foundWords.slice(0, 2).join(', ')}`);
  }

  // Transition word analysis
  const transitionResult = countWords(text, wordLists.transitions);
  if (transitionResult.count > 0) {
    const transitionDensity = transitionResult.count / sentences.length;
    if (transitionDensity > thresholds.complexSentences) {
      scores.transitionOveruse = Math.min(transitionDensity * 2, 1);
      details.push(`High transition density: ${(transitionDensity * 100).toFixed(1)}% of sentences`);
    }
  }

  // Personal voice analysis - always show if missing
  const personalResult = countWords(text, personalIndicators);
  if (personalResult.count === 0 && words.length > 100) {
    scores.lackPersonalVoice = 0.6; // Always flag complete absence
    details.push("No personal voice indicators detected");
  } else if (personalResult.count > 0) {
    details.push(`Personal voice detected: ${personalResult.foundWords.slice(0, 2).join(', ')}`);
  }

  // Perfect grammar analysis
  const contractionCount = (text.match(/\b\w+'\w+\b/g) || []).length;
  if (contractionCount === 0 && words.length > 150) {
    scores.perfectGrammar = 0.5; // Show even for moderate texts
    details.push("No contractions - unnaturally formal");
  }

  // Sentence structure analysis
  if (sentences.length > 5) {
    const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);
    const sentenceVariance = calculateVariance(sentenceLengths);
    const avgSentenceLength = sentenceLengths.reduce((sum, len) => sum + len, 0) / sentenceLengths.length;
    
    if (sentenceVariance < 35 && avgSentenceLength > 12) {
      scores.consistentSentenceLength = Math.min((50 - sentenceVariance) / 50, 0.7);
      details.push(`Consistent sentence lengths (variance: ${sentenceVariance.toFixed(1)})`);
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

  // Calculate weighted total score
  Object.keys(scores).forEach(key => {
    let patternWeight = 0.1;
    
    Object.values(patterns).forEach(patternGroup => {
      if (patternGroup[key]) {
        patternWeight = patternGroup[key].weight;
      }
    });
    
    totalScore += scores[key] * patternWeight;
  });

  // Apply context adjustment
  totalScore *= contextualThresholds[context]?.formalTone || 1.0;
  totalScore = Math.min(totalScore, 1.0);

  // Calculate confidence and generate insights
  const confidence = calculateConfidenceLevel(scores, clusters, words, context);
  const insights = generateActionableInsights({ scores, confidence }, context);

  // Enhanced metrics
  const avgParagraphLength = paragraphs.length > 0 ? 
    (sentences.length / paragraphs.length).toFixed(1) : '0';
  const avgSentenceLength = sentences.length > 0 ? 
    (words.length / sentences.length).toFixed(1) : '0';
  const buzzwordDensity = words.length > 0 ? 
    ((buzzwordResult.count + abstractNounResult.count) / words.length * 1000).toFixed(2) : '0';

  return {
    score: totalScore,
    confidence,
    details: details.length > 0 ? details : ['No significant AI patterns detected'],
    insights,
    clusters: clusters.length,
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
      clustersFound: clusters.length,
      contextType: context
    }
  };
};
