export function getRandomLetter() {
    let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWYZ';
    const randomIndex = Math.floor(Math.random() * alphabet.length); // Get a random index
    return alphabet[randomIndex]; // Return the letter at the random index
  }
  
let selectedLetter;
  
export function getRandomExercise(sentences) {
    selectedLetter = getRandomLetter();
    let subsetSentences = sentences[selectedLetter];
    let randomExercise = subsetSentences[Math.floor(Math.random() * subsetSentences.length)];
    return randomExercise
  }