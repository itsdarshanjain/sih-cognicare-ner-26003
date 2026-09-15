export function analyzeSpeech(allUtterances, callDurationSec) {
  const text = allUtterances.join(' ');
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  
  // Filler detection (works for Hindi + English)
  const FILLERS = ['um','uh','ah','hmm','matlab','wo','kya','haan','arre','acha'];
  const fillerCount = words.filter(w => FILLERS.includes(w.toLowerCase())).length;
  
  // Type-Token Ratio (vocabulary diversity — lower = more repetitive speech)
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  const typeTokenRatio = wordCount > 0 ? uniqueWords.size / wordCount : 0;
  
  // Repetition detection (bigram repetition)
  const bigrams = [];
  for (let i = 0; i < words.length - 1; i++) bigrams.push(words[i] + ' ' + words[i+1]);
  const bigramSet = new Set(bigrams);
  const repetitionCount = bigrams.length - bigramSet.size;
  
  // Avg words per utterance
  const avgWordsPerUtterance = allUtterances.length > 0 
    ? wordCount / allUtterances.length : 0;
  
  // Composite fluency score (higher is better)
  const fillerPenalty = Math.min(fillerCount / Math.max(wordCount, 1), 0.3) * 100;
  const diversityScore = typeTokenRatio * 100;
  const brevityPenalty = avgWordsPerUtterance < 3 ? 20 : 0;
  
  const fluencyScore = Math.max(0, Math.min(100, 
    Math.round(diversityScore * 0.5 + (100 - fillerPenalty * 2) * 0.3 + (100 - brevityPenalty) * 0.2)
  ));
  
  return {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    duration: callDurationSec,
    wordCount, 
    fillerCount,
    fillerRatio: +(fillerCount / Math.max(wordCount, 1)).toFixed(3),
    typeTokenRatio: +typeTokenRatio.toFixed(3),
    avgWordsPerUtterance: +avgWordsPerUtterance.toFixed(1),
    repetitionCount,
    fluencyScore
  };
}
