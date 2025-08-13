// AI Writing Pattern Analysis Engine

const patterns = {
  structural: {
    uniformParagraphLength: { weight: 0.15, description: "Paragraphs are suspiciously uniform in length" },
    transitionOveruse: { weight: 0.20, description: "Excessive use of transition words between sentences" },
    consistentSentenceLength: { weight: 0.10, description: "Sentences are too consistent in length" },
    repetitiveSentenceStarters: { weight: 0.18, description: "Repetitive sentence opening patterns" },
    uniformListStructure: { weight: 0.12, description: "Lists consistently have same number of items" },
    noRhetoricalQuestions: { weight: 0.08, description: "Complete absence of rhetorical questions" },
    perfectGrammar: { weight: 0.10, description: "Unnaturally perfect grammar with no contractions" }
  },
  
  content: {
    technicalClustering: { weight: 0.25, description: "High concentration of technical jargon" },
    buzzwordClustering: { weight: 0.22, description: "AI buzzwords appear in clusters" },
    genericExamples: { weight: 0.12, description: "Uses only generic, textbook-style examples" },
    balancedViewpoints: { weight: 0.15, description: "Artificially balanced viewpoints on all topics" },
    lackPersonalVoice: { weight: 0.18, description: "No personal anecdotes, opinions, or voice" },
    platitudeOveruse: { weight: 0.10, description: "Overuse of platitudes and generic statements" },
    pseudoInsightOveruse: { weight: 0.16, description: "Overuse of pseudo-insightful phrases" }
  },
  
  language: {
    formalityInconsistency: { weight: 0.12, description: "Inappropriately formal tone for casual topics" },
    repetitiveStructure: { weight: 0.15, description: "Repetitive sentence and paragraph structures" },
    lackIdioms: { weight: 0.10, description: "Complete absence of idioms or colloquialisms" },
    hedgingLanguage: { weight: 0.12, description: "Excessive use of hedging/qualifying language" },
    palpableOveruse: { weight: 0.14, description: "Overuse of overly descriptive 'palpable' type words" }
  }
};

const wordLists = {
  // Enhanced 2025 AI/ML Terms
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
    'post-transformer epoch', 'perplexity metrics', 'probabilistic consistency',
    'stateful sessions', 'edge deployment', 'federated learning paradigms'
  ],
  
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
  
  commonAdjectives: [
    'nuanced', 'intricate', 'complex', 'multifaceted', 'dynamic', 'diverse', 'holistic',
    'comprehensive', 'robust', 'strategic', 'transformative', 'insightful', 'innovative',
    'revolutionary', 'groundbreaking', 'pivotal', 'critical', 'essential', 'fundamental',
    'significant', 'notable', 'compelling', 'seamless', 'sophisticated', 'cutting-edge'
  ],
  
  predictableOpeners: [
    "in today's fast-paced world", "since the dawn of time", "it goes without saying",
    "let's delve into the intricacies", "as we explore the nuances", "it's important to understand",
    "without a doubt", "in conclusion", "to sum up", "this article will explore", "in essence",
    "at the end of the day", "a deeper understanding of", "in the current epoch",
    "the proliferation of", "ushering in an era", "underpinned by", "at the core of",
    "concurrently", "emerging as", "on the horizon", "finally", "as we advance"
  ],
  
  pseudoInsightPhrases: [
    "this begs the question", "it's not just about", "the implications are far-reaching",
    "this opens up new possibilities", "what does this mean for the future",
    "we must ask ourselves", "let's take a moment to consider", "the answer may surprise you",
    "in many ways, this reflects a larger trend", "striking a balance between"
  ],
  
  transitions: [
    'furthermore', 'moreover', 'additionally', 'however', 'nevertheless', 
    'consequently', 'therefore', 'thus', 'hence', 'accordingly', 'similarly',
    'likewise', 'conversely', 'on the other hand', 'in contrast', 'alternatively',
    'meanwhile', 'subsequently', 'concurrently', 'simultaneously'
  ],
  
  hedgingLanguage: [
    'arguably', 'presumably', 'potentially', 'possibly', 'likely', 'tend to',
    'appears to', 'seems to', 'suggests that', 'indicates that', 'may be',
    'might be', 'could be', 'would suggest', 'it is possible that',
    'one might argue', 'it could be argued', 'to some extent'
  ]
};

const personalIndicators = [
  'i think', 'i believe', 'in my opinion', 'personally', 'i feel', 'my experience',
  'i have found', 'i remember', 'i noticed', 'from my perspective', 'i would argue',
  'i disagree', 'i agree', 'honestly', 'frankly', 'to be honest', 'my take is',
  'i\'ve seen', 'i\'ve learned', 'in my view'
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

export const analyzeText = (text) => {
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

  // Technical term clustering analysis
  const technicalTerms = [...wordLists.aiTechnicalTerms, ...wordLists.buzzwordVerbs, ...wordLists.abstractNouns];
  let clusterScore = 0;
  let foundTerms = [];
  
  sentences.forEach(sentence => {
    const sentenceTerms = technicalTerms.filter(term => 
      sentence.toLowerCase().includes(term.toLowerCase())
    );
    
    if (sentenceTerms.length > 1) {
      clusterScore += sentenceTerms.length * 0.4;
      foundTerms.push(...sentenceTerms);
    }
  });
  
  if (clusterScore > 1) {
    const density = clusterScore / sentences.length;
    scores.technicalClustering = Math.min(density * 1.5, 1.0);
    const uniqueTerms = [...new Set(foundTerms)];
    details.push(`High technical jargon clustering: ${uniqueTerms.slice(0, 5).join(', ')}`);
  }

  // Enhanced buzzword analysis
  let buzzwordScore = 0;
  const buzzwordResult = countWords(text, wordLists.buzzwordVerbs);
  buzzwordScore += buzzwordResult.count * 0.5;
  
  const abstractNounResult = countWords(text, wordLists.abstractNouns);
  buzzwordScore += abstractNounResult.count * 0.4;
  
  const adjectiveResult = countWords(text, wordLists.commonAdjectives);
  buzzwordScore += adjectiveResult.count * 0.3;
  
  if (buzzwordScore > 2) {
    const buzzwordDensity = buzzwordScore / words.length * 1000;
    scores.buzzwordClustering = Math.min(buzzwordDensity / 6, 1);
    details.push(`Buzzword clustering detected (score: ${buzzwordScore.toFixed(1)})`);
  }

  // Predictable opener analysis
  const openerResult = countPhrases(text, wordLists.predictableOpeners);
  if (openerResult.count > 0) {
    scores.predictableOpeners = Math.min(openerResult.count * 0.6, 1);
    details.push(`Predictable openers found: ${openerResult.foundPhrases.slice(0, 2).join(', ')}`);
  }

  // Pseudo-insight phrase analysis
  const pseudoInsightResult = countPhrases(text, wordLists.pseudoInsightPhrases);
  if (pseudoInsightResult.count > 0) {
    scores.pseudoInsightOveruse = Math.min(pseudoInsightResult.count * 0.7, 1);
    details.push(`Pseudo-insight phrases: ${pseudoInsightResult.foundPhrases.slice(0, 2).join(', ')}`);
  }

  // Hedging language analysis
  const hedgingResult = countWords(text, wordLists.hedgingLanguage);
  const hedgingDensity = hedgingResult.count / sentences.length;
  if (hedgingDensity > 0.2) {
    scores.hedgingLanguage = Math.min(hedgingDensity * 3, 1);
    details.push(`Excessive hedging language (${(hedgingDensity * 100).toFixed(1)}% of sentences)`);
  }

  // Transition word analysis
  const transitionResult = countWords(text, wordLists.transitions);
  const transitionDensity = transitionResult.count / sentences.length;
  
  if (transitionDensity > 0.2) {
    scores.transitionOveruse = Math.min(transitionDensity * 3, 1);
    details.push(`High transition word density: ${(transitionDensity * 100).toFixed(1)}% of sentences`);
  }

  // Personal voice analysis
  const personalResult = countWords(text, personalIndicators);
  if (personalResult.count === 0 && words.length > 150) {
    scores.lackPersonalVoice = 0.9;
    details.push("No personal voice indicators detected");
  }

  // Contraction analysis
  const contractionCount = (text.match(/\b\w+'\w+\b/g) || []).length;
  if (contractionCount === 0 && words.length > 150) {
    scores.perfectGrammar = 0.8;
    details.push("No contractions found - unnaturally formal");
  }

  // Sentence length consistency
  if (sentences.length > 5) {
    const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);
    const sentenceVariance = calculateVariance(sentenceLengths);
    const avgSentenceLength = sentenceLengths.reduce((sum, len) => sum + len, 0) / sentenceLengths.length;
    
    if (sentenceVariance < 30 && avgSentenceLength > 10) {
      scores.consistentSentenceLength = Math.min((50 - sentenceVariance) / 50, 0.8);
      details.push(`Sentences too consistent in length (variance: ${sentenceVariance.toFixed(1)})`);
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

  // Pattern multiplier for flagrant cases
  const activePatterns = Object.keys(scores).length;
  const strongPatterns = Object.values(scores).filter(score => score > 0.6).length;
  
  if (activePatterns >= 5 && strongPatterns >= 3) {
    totalScore *= 1.4;
    details.unshift("Multiple AI patterns detected - confidence boost applied (1.4x)");
  } else if (activePatterns >= 4 && strongPatterns >= 2) {
    totalScore *= 1.2;
    details.unshift("Multiple AI patterns detected - confidence boost applied (1.2x)");
  }
  
  totalScore = Math.min(totalScore, 1.0);

  return {
    score: totalScore,
    details: details.length > 0 ? details : ['No significant AI patterns detected'],
    metrics: {
      words: words.length,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      personalVoice: personalResult.count > 0,
      contractions: contractionCount,
      technicalTerms: foundTerms.length,
      transitionDensity: (transitionDensity * 100).toFixed(1) + '%'
    }
  };
};
