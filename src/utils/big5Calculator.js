export const big5Questions = [
  // Openness
  { id: 1, question: "I am original, come up with new ideas", trait: "openness", reverse: false },
  { id: 2, question: "I value artistic, aesthetic experiences", trait: "openness", reverse: false },
  { id: 3, question: "I have an active imagination", trait: "openness", reverse: false },
  { id: 4, question: "I prefer routine over variety", trait: "openness", reverse: true },
  { id: 5, question: "I am curious about many different things", trait: "openness", reverse: false },

  // Conscientiousness
  { id: 6, question: "I do a thorough job", trait: "conscientiousness", reverse: false },
  { id: 7, question: "I am a reliable worker", trait: "conscientiousness", reverse: false },
  { id: 8, question: "I tend to be disorganized", trait: "conscientiousness", reverse: true },
  { id: 9, question: "I make plans and follow through with them", trait: "conscientiousness", reverse: false },
  { id: 10, question: "I am easily distracted", trait: "conscientiousness", reverse: true },

  // Extraversion
  { id: 11, question: "I am talkative", trait: "extraversion", reverse: false },
  { id: 12, question: "I am outgoing, sociable", trait: "extraversion", reverse: false },
  { id: 13, question: "I am reserved", trait: "extraversion", reverse: true },
  { id: 14, question: "I generate a lot of enthusiasm", trait: "extraversion", reverse: false },
  { id: 15, question: "I tend to be quiet", trait: "extraversion", reverse: true },

  // Agreeableness
  { id: 16, question: "I am helpful and unselfish with others", trait: "agreeableness", reverse: false },
  { id: 17, question: "I have a forgiving nature", trait: "agreeableness", reverse: false },
  { id: 18, question: "I tend to find fault with others", trait: "agreeableness", reverse: true },
  { id: 19, question: "I am considerate and kind to almost everyone", trait: "agreeableness", reverse: false },
  { id: 20, question: "I can be cold and aloof", trait: "agreeableness", reverse: true },

  // Neuroticism
  { id: 21, question: "I worry a lot", trait: "neuroticism", reverse: false },
  { id: 22, question: "I get nervous easily", trait: "neuroticism", reverse: false },
  { id: 23, question: "I am relaxed, handle stress well", trait: "neuroticism", reverse: true },
  { id: 24, question: "I remain calm in tense situations", trait: "neuroticism", reverse: true },
  { id: 25, question: "I can be moody", trait: "neuroticism", reverse: false }
];

export const calculateBig5Scores = (answers) => {
  const traits = {
    openness: [],
    conscientiousness: [],
    extraversion: [],
    agreeableness: [],
    neuroticism: []
  };

  // Group answers by trait
  big5Questions.forEach(question => {
    const answer = answers[question.id];
    if (answer) {
      const score = question.reverse ? 6 - answer : answer;
      traits[question.trait].push(score);
    }
  });

  // Calculate average scores and convert to 0-100 scale
  const results = {};
  Object.keys(traits).forEach(trait => {
    const scores = traits[trait];
    const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    results[trait] = Math.round(((average - 1) / 4) * 100);
  });

  return results;
};