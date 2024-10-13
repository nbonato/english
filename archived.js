// Fetch all words attempted from the localStorage
let attempts = JSON.parse(localStorage.getItem('attempts'));

let sentencesContainer = document.querySelector('#sentences-container');
let revealAllWords = document.querySelector('#reveal-all-words')

// This section to be replaced with a proper caching of the phrases
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
    
    populateSentencesContainer()
  })
  .catch(error => {
    console.error('Error fetching the JSON file:', error);
  });




function populateSentencesContainer() {
    // Check if there are any attempts in local storage
    if (attempts) {
        for (word of Object.keys(attempts)) {
            let sentenceListElement = document.createElement('li');
            sentenceListElement.innerHTML = formatSentence(findSentence(word))
            sentencesContainer.appendChild(sentenceListElement)
        }
    } else {
        sentencesContainer.textContent = `No sentences to show, start working on some and they 
                                        will show up here!`
    }
}  

/**
 * Search in the sentences object for the sentence displayed for a specific word
 * 
 * @param {string} word - The word to look for in the sentences object
 * @returns {string}    - The sentence with the word in square brackets                    
 */
function findSentence(word) {
    let initialArray = sentences[word[0].toUpperCase()]; 
    return initialArray.find(obj => obj.word === word)['phrase'];

}

/**
 * 
 * @param {string} sentence - The sentence used in an exercise, with the word to guess in 
 *                            square brackets
 * @returns {string}        - The HTML code for the sentence with a system to reveal the word
 */
function formatSentence(sentence) {
    // Find the word solution inside the text (between square brackets)
    let match = sentence.match(/\[(.*?)\]/);
    wordSolution = match ? match[1] : null; // Extract the first captured group or null if not found

    let revealWordHTML = `<span class='blurred-solution' title='Reveal word' style='cursor: pointer' onClick='this.style.filter="none"'>${wordSolution}</span>`
    // Replace the matched word in the sentence
    sentence = sentence.replace(`[${wordSolution}]`, revealWordHTML);

    // Remove the blur by setting filter to none
    return sentence
}



// On click, reveal all words
revealAllWords.addEventListener('click', function() {
    // Add event listener to each element
    document.querySelectorAll('.blurred-solution').forEach(element => {
        element.style.filter = 'none';
    });
})

