let sentenceParagraph = document.querySelector('#sentence-paragraph')
let definitionParagraph = document.querySelector('#definition')
let newSentenceButton = document.querySelector('#new-sentence')

let rightAnswersCounter = document.querySelector('#right-answers')
let wrongAnswersCounter = document.querySelector('#wrong-answers')
let skippedExercisesCounter = document.querySelector('#skipped-exercises')


let totalSentences = 0
// Variable to store the data
let sentences = [];

// Fetching the JSON file
fetch('phrases.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    sentences = data; // Store the JSON data in the sentences variable
    // Start with the first sentence
    newSentence()
    skippedExercisesCounter.textContent = 0
  })
  .catch(error => {
    console.error('Error fetching the JSON file:', error);
  });


function getRandomLetter() {
  let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  alphabet = 'BCDE';
  const randomIndex = Math.floor(Math.random() * alphabet.length); // Get a random index
  return alphabet[randomIndex]; // Return the letter at the random index
}

let selectedLetter;
function getRandomExcercise(sentences) {
  selectedLetter = getRandomLetter();
  let subsetSentences = sentences[selectedLetter];
  let randomExcercise = subsetSentences[Math.floor(Math.random() * subsetSentences.length)];
  return randomExcercise
}

let wordSolution;

newSentenceButton.addEventListener('click', () => {
  increaseCounter(skippedExercisesCounter);
});

function newSentence() {
  let randomExercise = getRandomExcercise(sentences)
  let exerciseSentence = randomExercise['phrase']
  let inputBoxHTML = '<input id="input-box" type="text" placeholder="..." style="text-align: center">'
  // Replacing text inside square brackets with input box
  let currentSentence = exerciseSentence.replace(/\[.*?\]/, inputBoxHTML);
  // Find the word solution inside the text (between square brackets)
  let match = exerciseSentence.match(/\[(.*?)\]/);
  wordSolution = match ? match[1] : null; // Extract the first captured group or null if not found
  
  sentenceParagraph.innerHTML = currentSentence
  definitionParagraph.textContent = `${randomExercise['description']['simplified']} Starts with ${selectedLetter}`
  newSentenceButton.disabled = true
  totalSentences ++
}


function increaseCounter(counter) {
  counter.textContent = parseInt(counter.textContent) + 1
}

function checkExercise() {
  let attempt = document.querySelector("#input-box").value
  if (attempt.trim().toLowerCase() === wordSolution.trim().toLowerCase()) {
    alert("Great!")
    newSentence()
    increaseCounter(rightAnswersCounter)
    console.log("disable")

  } else {
    alert("Wrong, try again!")
    increaseCounter(wrongAnswersCounter)
    newSentenceButton.disabled = false
  }
}





