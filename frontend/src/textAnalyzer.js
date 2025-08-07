```javascript
// AI Writing Pattern Analysis Engine

const patterns = {
  structural: {
    uniformParagraphLength: { weight: 0.15, description: "Paragraphs are suspiciously uniform in length" },
    transitionOveruse: { weight: 0.20, description: "Excessive use of transition words between sentences" },
    consistentSentenceLength: { weight: 0.10, description: "Sentences are too consistent in length" },
    noRhetoricalQuestions: { weight: 0.05, description: "Complete absence of rhetorical questions" },
    perfectGrammar: { weight: 0.10, description: "Unnaturally perfect grammar with no contractions" }
  },
  
  content: {
    genericExamples: { weight: 0.15, description: "Uses only generic, textbook-style examples" },
    balancedViewpoints: { weight: 0.10, description: "Artificially balanced viewpoints on all topics" },
    lackPersonalVoice: { weight: 0.15, description: "No personal anecdotes, opinions, or voice" },
    platitudeOveruse: { weight: 0.10, description: "Overuse of platitudes and generic statements" }
  },
  
  language: {
    formalityInconsistency: { weight: 0.12, description: "Inappropriately formal tone for casual topics" },
    buzzwordClustering: { weight: 0.18, description: "AI buzzwords appear in clusters" },
    repetitiveStructure: { weight: 0.15, description: "Repetitive sentence and paragraph structures" },
    lackIdioms: { weight: 0.08, description: "Complete absence of idioms or colloquialisms" }
  }
};

const wordLists = {
  highRisk: [
    'delve', 'unpack', 'leverage', 'facilitate', 'optimize', 'streamline', 'harness',
    'orchestrate', 'catalyze', 'synthesize', 'paradigm', 'tapestry', 'landscape',
    'multifaceted', 'comprehensive', 'robust', 'nuanced', 'seamless', 'holistic',
    'spearhead', 'champion', 'cultivate', 'galvanize', 'curate', 'distill'
  ],
  
  mediumRisk: [
    'utilize', 'implement', 'enhance', 'dynamic', 'innovative', 'strategic',
    'diverse', 'significant', 'substantial', 'considerable', 'notable',
    'remarkable', 'exceptional', 'outstanding', 'exemplary', 'stellar'
  ],
  
  transitions: [
    'furthermore', 'moreover', 'additionally', 'however', 'nevertheless', 
    'consequently', 'therefore', 'thus', 'hence', 'accordingly', 'similarly',
    'likewise', 'conversely', 'on the other hand', 'in contrast', 'alternatively'
  ],
  
  phrases: [
    'it is worth noting that', 'it is important to consider', 'in today fast-paced world',
    'at the end of the day', 'this begs the question', 'the implications are far-reaching',
    'striking a balance between', 'it goes without saying', 'since the dawn of time',
    'without a doubt', 'in conclusion', 'to sum up', 'let us delve into',
    'as we explore the nuances', 'what does this mean for the future',
    'we must ask ourselves', 'the answer may surprise you'
  ],
  
  platitudes: [
    'technology is changing', 'education plays a vital role', 'communication is key',
    'every coin has two sides', 'social media has its pros and cons', 'health is important',
    'we all strive for happiness', 'success means different things'
  ]
};

const personalIndicators = [
  'i think', 'i believe', 'in my opinion', 'personally', 'i feel', 'my experience',
  'i have found', 'i remember', 'i noticed', 'from my perspective', 'i would argue',
  'i disagree', 'i agree', 'honestly', 'frankly', 'to be honest'
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
  
  wordList.forEach(word => {
    const escapedWord = word.replace(/'/g, "'");
    const regex = new RegExp(`\\b${escapedWord}\\b`, 'g');
    const matches = textLower.match(regex);
    if (matches) count += matches.length;
  });
  
  return count;
};

const countPhrases = (text, phraseList) => {
  const textLower = text.toLowerCase();
  let count = 0;
  const foundPhrases = [];
  
  phraseList.forEach(phrase => {
    if (textLower.includes(phrase)) {
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

  // Sentence length consistency
  if (sentences.length > 5) {
    const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);
    const sentenceVariance = calculateVariance(sentenceLengths);
    const avgSentenceLength = sentenceLengths.reduce((sum, len) => sum + len, 0) / sentenceLengths.length;
    
    if (sentenceVariance < 20 && avgSentenceLength > 8) {
      scores.consistentSentenceLength = 0.7;
      details.push(`Sentences too consistent in length (variance: ${sentenceVariance.toFixed(1)})`);
    }
  }

  // Transition word analysis
  const transitionCount = countWords(text, wordLists.transitions);
  const transitionDensity = transitionCount / sentences.length;
  
  if (transitionDensity > 0.3) {
    scores.transitionOveruse = Math.min(transitionDensity * 2, 1);
    details.push(`High transition word density: ${(transitionDensity * 100).toFixed(1)}% of sentences`);
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
  const personalCount = countWords(text, personalIndicators);
  const personalDensity = personalCount / words.length;
  
  if (personalDensity === 0 && words.length > 200) {
    scores.lackPersonalVoice = 0.8;
    details.push("No personal voice indicators detected");
  }

  // Platitude detection
  const platitudeResult = countPhrases(text, wordLists.platitudes);
  if (platitudeResult.count > 0) {
    scores.platitudeOveruse = Math.min(platitudeResult.count * 0.3, 1);
    details.push(`Found ${platitudeResult.count} platitude(s): ${platitudeResult.foundPhrases.slice(0, 2).join(', ')}`);
  }

  // Buzzword clustering analysis
  let buzzwordScore = 0;
  
  const highRiskCount = countWords(text, wordLists.highRisk);
  buzzwordScore += highRiskCount * 0.3;
  
  const mediumRiskCount = countWords(text, wordLists.mediumRisk);
  buzzwordScore += mediumRiskCount * 0.15;
  
  const phraseResult = countPhrases(text, wordLists.phrases);
  buzzwordScore += phraseResult.count * 0.4;
  
  if (buzzwordScore > 1) {
    const buzzwordDensity = buzzwordScore / words.length * 1000;
    scores.buzzwordClustering = Math.min(buzzwordDensity / 10, 1);
    details.push(`Buzzword clustering detected (density: ${buzzwordDensity.toFixed(2)})`);
    
    if (phraseResult.foundPhrases.length > 0) {
      details.push(`AI phrases found: ${phraseResult.foundPhrases.slice(0, 3).join(', ')}`);
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

  totalScore = Math.min(totalScore, 1.0);

  const avgParagraphLength = paragraphs.length > 0 ? 
    (sentences.length / paragraphs.length).toFixed(1) : '0';
  const avgSentenceLength = sentences.length > 0 ? 
    (words.length / sentences.length).toFixed(1) : '0';
  const buzzwordDensity = words.length > 0 ? 
    ((highRiskCount + mediumRiskCount) / words.length * 1000).toFixed(2) : '0';

  return {
    score: totalScore,
    details: details.length > 0 ? details : [],
    metrics: {
      words: words.length,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      avgParagraphLength,
      avgSentenceLength,
      transitionDensity: (transitionDensity * 100).toFixed(1),
      personalVoice: personalCount > 0,
      contractions: contractionCount,
      buzzwordDensity,
      questions: questionCount
    }
  };
};
```
