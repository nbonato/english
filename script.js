let sentenceParagraph = document.querySelector('#sentence-paragraph')
let definitionParagraph = document.querySelector('#definition')
let newSentenceButton = document.querySelector('#new-sentence')
let answerParagraph = document.querySelector('#answer')

let rightAnswersCounter = document.querySelector('#right-answers')
let wrongAnswersCounter = document.querySelector('#wrong-answers')
let skippedExercisesCounter = document.querySelector('#skipped-exercises')
let showAnswerButton = document.querySelector('#show-answer')
let checkExerciseButton = document.querySelector('#check-answer')

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
let inputBox;

newSentenceButton.addEventListener('click', () => {
  increaseCounter(skippedExercisesCounter);
});

function newSentence() {
  showAnswerButton.style.visibility = 'hidden'
  answerParagraph.style.visibility = 'hidden'
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

  inputBox = document.querySelector('#input-box')
  // Add an event listener to the input box to monitor changes
  inputBox.addEventListener('input', () => {
    // Check if the input box is empty and set the button's disabled property accordingly
    checkExerciseButton.disabled = inputBox.value.trim() === '';
    console.log(inputBox.value.trim())
  });
  inputBox.focus()
}

function showAnswer() {
  answerParagraph.textContent = wordSolution
  answerParagraph.style.visibility = "visible"
  console.log(2)
}


function checkExercise() {
  let attempt = document.querySelector("#input-box").value
  if (attempt.trim().toLowerCase() === wordSolution.trim().toLowerCase()) {
    alert("Great!")
    newSentence()
    increaseCounter(rightAnswersCounter)
  } else {
    alert("Wrong, try again!")
    increaseCounter(wrongAnswersCounter)
    newSentenceButton.disabled = false
    showAnswerButton.style.visibility = 'visible'
    inputBox.value = ''
    inputBox.focus()
  }
  
}


function increaseCounter(counter) {
  counter.textContent = parseInt(counter.textContent) + 1
}



