let sentenceParagraph = document.querySelector('#sentence-paragraph')
let definitionParagraph = document.querySelector('#definition')
let newSentenceButton = document.querySelector('#new-sentence')
let answerParagraph = document.querySelector('#answer')

let rightAnswersCounter = document.querySelector('#right-answers')
let wrongAnswersCounter = document.querySelector('#wrong-answers')
let skippedExercisesCounter = document.querySelector('#skipped-exercises')
let showAnswerButton = document.querySelector('#show-answer')
let checkExerciseButton = document.querySelector('#check-answer')


let resultDialog = document.querySelector("#result-dialog")

let resultMessage = document.querySelector("#result-message")

let saveSentenceButton = document.querySelector("#save-sentence")
let nextSentenceDialogButton = document.querySelector("#next-sentence")
let closeDialogButton = document.querySelector('#close-dialog')

closeDialogButton.addEventListener('click', () => {
  resultDialog.close()
  // Once the dialog is closed, hide the answer again
  // this is useful if the user gets the answer wrong,
  // shows the right answer and then goes back to input
  // the answer. 
  // In the future, showing the answer should make it so 
  // the user is forced to go to the next sentence.
  answerParagraph.style.visibility = "hidden"
})

nextSentenceDialogButton.style.display = 'none'

saveSentenceButton.addEventListener('click', () => {
  if (!starred.includes(wordSolution)) {
    starred.push(wordSolution)
    // Update the 'starred' array in localStorage.
    localStorage.setItem('starred', JSON.stringify(starred)); 
  }
  saveSentenceButton.disabled = true
});


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
  alphabet = 'ABCDEF';
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
  statistics.skipped ++;
  updateStatisticsDisplay(statistics)
});

function newSentence() {
  showAnswerButton.style.display = 'none'
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
  totalSentences++

  inputBox = document.querySelector('#input-box')
  // Add an event listener to the input box to monitor changes
  inputBox.addEventListener('input', () => {
    // Check if the input box is empty and set the button's disabled property accordingly
    checkExerciseButton.disabled = inputBox.value.trim() === '';
    
  });




/*   This part malfunctions with the dialog
  // Add an event listener to the input to check the exercise on
  // pressing the Enter key.
  // Add an event listener for the keydown event
  inputBox.addEventListener('keydown', function(event) {
    // Check if the key pressed is "Enter" and that the input
    // box is not empty
    if (event.key === 'Enter' && inputBox.value.trim() !== "") {
      // Call the checkExercise function
      checkExercise();
    }
  }); */

  // Reactivate the "Save sentence" button
  saveSentenceButton.disabled = false

  inputBox.focus()
}

function showAnswer() {
  answerParagraph.textContent = wordSolution
  answerParagraph.style.visibility = "visible"
}

// Check if attempts exists in localStorage
let attempts = localStorage.getItem('attempts');

// If it doesn't exist, initialise it as an empty object
if (attempts === null) {
  attempts = {};
} else {
  // If it exists, parse it
  attempts = JSON.parse(attempts);
}

// Check if starred exists in localStorage
let starred = localStorage.getItem('starred');

// If it doesn't exist, initialise it as an empty object
if (starred === null) {
  starred = [];
} else {
  // If it exists, parse it
  starred = JSON.parse(starred);
}


// Check if statistics exists in localStorage
let statistics = localStorage.getItem('statistics');

// If it doesn't exist, initialise it as an empty object
if (statistics === null) {
  statistics = {
    wrong: 0,
    right: 0,
    skipped: 0  
  };
} else {
  // If it exists, parse it and populate the 
  // statistics display
  statistics = JSON.parse(statistics);
  updateStatisticsDisplay(statistics)
}





function checkExercise() {
  let userAnswer = document.querySelector("#input-box").value.trim().toLowerCase()
  wordSolution = wordSolution.trim().toLowerCase()


  let result = userAnswer === wordSolution
  updateAttempts(wordSolution, result, userAnswer)

  if (result) {
    resultMessage.textContent = "Great!"
    statistics.right ++;
    nextSentenceDialogButton.style.display = 'inline'
    closeDialogButton.style.display = 'none'
    showAnswerButton.style.display = 'none'
  } else {
    resultMessage.textContent = "Wrong, try again!"
    nextSentenceDialogButton.style.display = 'hidden'
    statistics.wrong ++;
    newSentenceButton.disabled = false
    showAnswerButton.style.display = 'inline'
    closeDialogButton.style.display = 'inline'
    inputBox.value = ''
    inputBox.focus()
  }

  resultDialog.showModal()

  updateStatisticsDisplay(statistics)

  // Needs to be disabled otherwise you could check multiple times
  // with an empty string
  checkExerciseButton.disabled = true

  // Store the statistics in localStorage
  localStorage.setItem('statistics', JSON.stringify(statistics));   
}



/**
 * Updates the localStorage with the last time an 
 * exercise was attempted, indicating 
 * if successful or not and storing the attempt.
 *
 * @param {string} wordSolution - The solution to the exercise.
 * @param {boolean} result - Indicates whether the exercise was successful or not.
 * @param {string} userAnswer - The user's attempt.
 * @returns {Object} The updated object for the current attempt
 *                   indicating the date and result of it.
 */
function updateAttempts(wordSolution, result, userAnswer) {
  // Get the current dateTime
  let dateTime = new Date().toISOString(); // Example value
  // Check if there's already a record for the current 
  // exercise in the attempts object
  if (wordSolution in attempts) {
    // If it exists, push the new dateTime and result to the existing object
    attempts[wordSolution].push({ date: dateTime, success: result , userAttempt: userAnswer});
  } else {
    // If it doesn't exist, create a new object
    attempts[wordSolution] = [{ date: dateTime, success: result, userAttempt: userAnswer }];
  }

  // Update the 'attempts' object in localStorage.
  localStorage.setItem('attempts', JSON.stringify(attempts)); 
}


/**
 * Update the statistics display with the content from 
 * the "statistics" object.
 * 
 * @param {object} statistics - The object contains wrong, right and
 *                              skipped counters.
 */
function updateStatisticsDisplay(statistics) {
  rightAnswersCounter.textContent = parseInt(statistics.right);
  wrongAnswersCounter.textContent = parseInt(statistics.wrong);
  skippedExercisesCounter.textContent = parseInt(statistics.skipped);  
}




