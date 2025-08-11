// Advanced AI Writing Pattern Analysis Engine - 2025 Edition

const patterns = {
  structural: {
    uniformParagraphLength: { weight: 0.12, description: "Paragraphs are suspiciously uniform in length" },
    transitionOveruse: { weight: 0.18, description: "Excessive use of transition words between sentences" },
    consistentSentenceLength: { weight: 0.08, description: "Sentences are too consistent in length" },
    repetitiveSentenceStarters: { weight: 0.15, description: "Repetitive sentence opening patterns" },
    uniformListStructure: { weight: 0.10, description: "Lists consistently have same number of items" },
    noRhetoricalQuestions: { weight: 0.06, description: "Complete absence of rhetorical questions" },
    perfectGrammar: { weight: 0.08, description: "Unnaturally perfect grammar with no contractions" }
  },
  
  content: {
    technicalClustering: { weight: 0.20, description: "High concentration of technical jargon" },
    buzzwordClustering: { weight: 0.18, description: "AI buzzwords appear in clusters" },
    genericExamples: { weight: 0.10, description: "Uses only generic, textbook-style examples" },
    balancedViewpoints: { weight: 0.12, description: "Artificially balanced viewpoints on all topics" },
    lackPersonalVoice: { weight: 0.12, description: "No personal anecdotes, opinions, or voice" },
    platitudeOveruse: { weight: 0.08, description: "Overuse of platitudes and generic statements" },
    pseudoInsightOveruse: { weight: 0.14, description: "Overuse of pseudo-insightful phrases" }
  },
  
  language: {
    formalityInconsistency: { weight: 0.10, description: "Inappropriately formal tone for casual topics" },
    repetitiveStructure: { weight: 0.12, description: "Repetitive sentence and paragraph structures" },
    lackIdioms: { weight: 0.08, description: "Complete absence of idioms or colloquialisms" },
    hedgingLanguage: { weight: 0.10, description: "Excessive use of hedging/qualifying language" },
    palpableOveruse: { weight: 0.12, description: "Overuse of overly descriptive 'palpable' type words" }
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
  
  // 2025 AI/ML Technical Terms (Missing from current algorithm)
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
  
  // From your CSV - Common Adjectives
  commonAdjectives: [
    'nuanced', 'intricate', 'complex', 'multifaceted', 'dynamic', 'diverse', 'holistic',
    'comprehensive', 'robust', 'strategic', 'transformative', 'insightful', 'innovative',
    'revolutionary', 'groundbreaking', 'pivotal', 'critical', 'essential', 'fundamental',
    'significant', 'notable', 'compelling', 'seamless', 'sophisticated', 'cutting-edge',
    'state-of-the-art', 'next-generation', 'scalable', 'adaptive', 'intelligent'
  ],
  
  // From your CSV - Common Adverbs
  commonAdverbs: [
    'literally', 'basically', 'truly', 'actually', 'essentially', 'simply', 'clearly',
    'obviously', 'undoubtedly', 'notably', 'importantly', 'significantly', 'remarkably',
    'especially', 'increasingly', 'largely', 'relatively', 'inherently', 'ideally',
    'accordingly', 'systematically', 'methodically', 'substantially', 'fundamentally'
  ],
  
  // From your CSV - Palpable-Type Words
  palpableWords: [
    'palpable', 'tangible', 'visceral', 'profound', 'profound sense of', 'a veil of',
    'the fabric of', 'the depths of', 'the weight of', 'a dance between', 'echoes of',
    'suspended in time', 'etched into memory', 'soul-stirring', 'haunting', 'ethereal',
    'spine-tingling', 'bone-chilling', 'earth-shattering', 'mind-numbing', 'breathtaking'
  ],
  
  // From your CSV - Predictable Openers & Closers
  predictableOpeners: [
    "in today's fast-paced world", "since the dawn of time", "it goes without saying",
    "let's delve into the intricacies", "as we explore the nuances", "it's important to understand",
    "without a doubt", "in conclusion", "to sum up", "this article will explore", "in essence",
    "at the end of the day", "a deeper understanding of", "in the current epoch",
    "the proliferation of", "ushering in an era", "underpinned by", "at the core of",
    "concurrently", "emerging as", "on the horizon", "finally", "as we advance"
  ],
  
  // From your CSV - Pseudo-Insight Phrases
  pseudoInsightPhrases: [
    "this begs the question", "it's not just about", "the implications are far-reaching",
    "this opens up new possibilities", "what does this mean for the future",
    "we must ask ourselves", "let's take a moment to consider", "the answer may surprise you",
    "in many ways, this reflects a larger trend", "striking a balance between"
  ],
  
  // From your CSV - Platitude Statements
  platitudes: [
    "technology is changing the way we live and work", "education plays a vital role in society",
    "social media has its pros and cons", "health is one of the most important aspects of life",
    "we all strive for happiness and success", "communication is the key to any successful relationship",
    "every coin has two sides"
  ],
  
  // Standard transition words
  transitions: [
    'furthermore', 'moreover', 'additionally', 'however', 'nevertheless', 
    'consequently', 'therefore', 'thus', 'hence', 'accordingly', 'similarly',
    'likewise', 'conversely', 'on the other hand', 'in contrast', 'alternatively',
    'meanwhile', 'subsequently', 'concurrently', 'simultaneously'
  ],
  
  // Hedging language
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

const analyzeSentenceStarters = (sentences) => {
  if (sentences.length < 5) return { repetitive: false, details: [] };
  
  const starters = sentences.map(sentence => {
    const trimmed = sentence.trim();
    const words = trimmed.split(/\s+/);
    return words.slice(0, 3).join(' ').toLowerCase();
  });
  
  const starterCounts = {};
  starters.forEach(starter => {
    starterCounts[starter] = (starterCounts[starter] || 0) + 1;
  });
  
  const repeatedStarters = Object.entries(starterCounts).filter(([_, count]) => count > 2);
  const repetitiveScore = repeatedStarters.length / sentences.length;
  
  return {
    repetitive: repetitiveScore > 0.2,
    score: repetitiveScore,
    details: repeatedStarters.map(([starter, count]) => `"${starter}..." (${count} times)`)
  };
};

const analyzeListStructure = (text) => {
  const listPattern = /(?:^\s*[-•*]\s+.+$)|(?:^\s*\d+\.\s+.+$)/gm;
  const lists = [];
  const lines = text.split('\n');
  let currentList = [];
  
  lines.forEach(line => {
    if (listPattern.test(line)) {
      currentList.push(line.trim());
    } else if (currentList.length > 0) {
      lists.push(currentList);
      currentList = [];
    }
  });
  
  if (currentList.length > 0) {
    lists.push(currentList);
  }
  
  if (lists.length < 2) return { uniform: false, score: 0 };
  
  const listLengths = lists.map(list => list.length);
  const avgLength = listLengths.reduce((sum, len) => sum + len, 0) / listLengths.length;
  const variance = calculateVariance(listLengths);
  
  // Check for exactly 3-item lists (very common in AI writing)
  const threeItemLists = listLengths.filter(len => len === 3).length;
  const threeItemRatio = threeItemLists / lists.length;
  
  return {
    uniform: variance < 0.5 || threeItemRatio > 0.6,
    score: threeItemRatio > 0.6 ? 0.8 : Math.max(0, 1 - variance),
    details: [`${lists.length} lists found`, `${threeItemLists} with exactly 3 items`]
  };
};

const analyzeTechnicalClustering = (text, words) => {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const technicalTerms = [...wordLists.aiTechnicalTerms, ...wordLists.buzzwordVerbs, ...wordLists.abstractNouns];
  
  let clusterScore = 0;
  let totalClusters = 0;
  let foundTerms = [];
  
  sentences.forEach(sentence => {
    const sentenceTerms = technicalTerms.filter(term => 
      sentence.toLowerCase().includes(term.toLowerCase())
    );
    
    if (sentenceTerms.length > 2) {
      clusterScore += sentenceTerms.length * 0.3;
      totalClusters++;
      foundTerms.push(...sentenceTerms);
    }
  });
  
  const density = clusterScore / sentences.length;
  const uniqueTerms = [...new Set(foundTerms)];
  
  return {
    clustered: density > 0.1,
    score: Math.min(density, 1.0),
    details: [`${totalClusters} high-tech clusters`, `${uniqueTerms.length} unique terms`],
    foundTerms: uniqueTerms.slice(0, 10)
  };
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

  // Paragraph length analysis
  if (paragraphs.length > 2) {
    const paragraphSentenceCounts = paragraphs.map(p => 
      p.split(/[.!?]+/).filter(s => s.trim().length > 10).length
    );
    const paragraphVariance = calculateVariance(paragraphSentenceCounts);
    const avgParagraphLength = paragraphSentenceCounts.reduce((sum, count) => sum + count, 0) / paragraphSentenceCounts.length;
    
    if (paragraphVariance < 1.5 && avgParagraphLength > 2 && paragraphs.length > 3) {
      scores.uniformParagraphLength = 0.8;
      details.push(`Suspiciously uniform paragraph lengths (variance: ${paragraphVariance.toFixed(2)})`);
    }
  }

  // Sentence starter repetition analysis
  const starterAnalysis = analyzeSentenceStarters(sentences);
  if (starterAnalysis.repetitive) {
    scores.repetitiveSentenceStarters = Math.min(starterAnalysis.score * 2, 1);
    details.push(`Repetitive sentence starters: ${starterAnalysis.details.join(', ')}`);
  }

  // List structure analysis
  const listAnalysis = analyzeListStructure(text);
  if (listAnalysis.uniform) {
    scores.uniformListStructure = listAnalysis.score;
    details.push(`Uniform list structure detected: ${listAnalysis.details.join(', ')}`);
  }

  // Technical term clustering analysis
  const techAnalysis = analyzeTechnicalClustering(text, words);
  if (techAnalysis.clustered) {
    scores.technicalClustering = techAnalysis.score;
    details.push(`High technical jargon clustering: ${techAnalysis.details.join(', ')}`);
    if (techAnalysis.foundTerms.length > 0) {
      details.push(`Key terms: ${techAnalysis.foundTerms.slice(0, 5).join(', ')}`);
    }
  }

  // Enhanced buzzword analysis
  let buzzwordScore = 0;
  const buzzwordResult = countWords(text, wordLists.buzzwordVerbs);
  buzzwordScore += buzzwordResult.count * 0.4;
  
  const abstractNounResult = countWords(text, wordLists.abstractNouns);
  buzzwordScore += abstractNounResult.count * 0.3;
  
  const adjectiveResult = countWords(text, wordLists.commonAdjectives);
  buzzwordScore += adjectiveResult.count * 0.2;
  
  if (buzzwordScore > 2) {
    const buzzwordDensity = buzzwordScore / words.length * 1000;
    scores.buzzwordClustering = Math.min(buzzwordDensity / 8, 1);
    details.push(`Buzzword clustering detected (score: ${buzzwordScore.toFixed(1)})`);
  }

  // Predictable opener analysis
  const openerResult = countPhrases(text, wordLists.predictableOpeners);
  if (openerResult.count > 0) {
    scores.predictableOpeners = Math.min(openerResult.count * 0.4, 1);
    details.push(`Predictable openers found: ${openerResult.foundPhrases.slice(0, 2).join(', ')}`);
  }

  // Pseudo-insight phrase analysis
  const pseudoInsightResult = countPhrases(text, wordLists.pseudoInsightPhrases);
  if (pseudoInsightResult.count > 0) {
    scores.pseudoInsightOveruse = Math.min(pseudoInsightResult.count * 0.5, 1);
    details.push(`Pseudo-insight phrases: ${pseudoInsightResult.foundPhrases.slice(0, 2).join(', ')}`);
  }

  // Palpable words analysis
  const palpableResult = countWords(text, wordLists.palpableWords);
  if (palpableResult.count > 1) {
    scores.palpableOveruse = Math.min(palpableResult.count * 0.3, 1);
    details.push(`Overuse of descriptive "palpable-type" words: ${palpableResult.foundWords.slice(0, 3).join(', ')}`);
  }

  // Hedging language analysis
  const hedgingResult = countWords(text, wordLists.hedgingLanguage);
  const hedgingDensity = hedgingResult.count / sentences.length;
  if (hedgingDensity > 0.3) {
    scores.hedgingLanguage = Math.min(hedgingDensity * 2, 1);
    details.push(`Excessive hedging language (${(hedgingDensity * 100).toFixed(1)}% of sentences)`);
  }

  // Transition word analysis
  const transitionResult = countWords(text, wordLists.transitions);
  const transitionDensity = transitionResult.count / sentences.length;
  
  if (transitionDensity > 0.25) {
    scores.transitionOveruse = Math.min(transitionDensity * 2.5, 1);
    details.push(`High transition word density: ${(transitionDensity * 100).toFixed(1)}% of sentences`);
  }

  // Sentence length consistency
  if (sentences.length > 5) {
    const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);
    const sentenceVariance = calculateVariance(sentenceLengths);
    const avgSentenceLength = sentenceLengths.reduce((sum, len) => sum + len, 0) / sentenceLengths.length;
    
    if (sentenceVariance < 25 && avgSentenceLength > 12) {
      scores.consistentSentenceLength = 0.7;
      details.push(`Sentences too consistent in length (variance: ${sentenceVariance.toFixed(1)})`);
    }
  }

  // Rhetorical questions
  const questionCount = sentences.filter(s => s.trim().includes('?')).length;
  if (questionCount === 0 && sentences.length > 10) {
    scores.noRhetoricalQuestions = 0.6;
    details.push("No rhetorical questions found in substantial text");
  }

  // Contraction analysis
  const contractionCount = (text.match(/\b\w+'\w+\b/g) || []).length;
  if (contractionCount === 0 && words.length > 200) {
    scores.perfectGrammar = 0.7;
    details.push("No contractions found - unnaturally formal");
  }

  // Personal voice analysis
  const personalResult = countWords(text, personalIndicators);
  if (personalResult.count === 0 && words.length > 200) {
    scores.lackPersonalVoice = 0.8;
    details.push("No personal voice indicators detected");
  }

  // Platitude detection
  const platitudeResult = countPhrases(text, wordLists.platitudes);
  if (platitudeResult.count > 0) {
    scores.platitudeOveruse = Math.min(platitudeResult.count * 0.4, 1);
    details.push(`Platitudes found: ${platitudeResult.foundPhrases.slice(0, 2).join(', ')}`);
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

  totalScore = Math.min(totalScore, 1.0);

  // Enhanced metrics
  const avgParagraphLength = paragraphs.length > 0 ? 
    (sentences.length / paragraphs.length).toFixed(1) : '0';
  const avgSentenceLength = sentences.length > 0 ? 
    (words.length / sentences.length).toFixed(1) : '0';
  const buzzwordDensity = words.length > 0 ? 
    ((buzzwordResult.count + abstractNounResult.count) / words.length * 1000).toFixed(2) : '0';
  const technicalTermDensity = words.length > 0 ?
    (techAnalysis.foundTerms.length / words.length * 1000).toFixed(2) : '0';

  return {
    score: totalScore,
    details: details.length > 0 ? details : ['No significant AI patterns detected'],
    metrics: {
      words: words.length,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      avgParagraphLength,
      avgSentenceLength,
      transitionDensity: (transitionDensity * 100).toFixed(1),
      personalVoice: personalResult.count > 0,
      contractions: contractionCount,
      buzzwordDensity,
      technicalTermDensity,
      questions: questionCount,
      listsFound: listAnalysis.details ? listAnalysis.details[0] : '0 lists found'
    }
  };
};
