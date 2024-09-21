// Function to fetch the sentences from the text file
async function fetchSentences() {
    const response = await fetch('sentences.txt');
    const text = await response.text();
    let sentences = text.split('\n').filter(sentence => sentence.trim() !== '');
    return sentences
}

// Function to save translations to localStorage
function saveTranslation(index, translation) {
    let translations = JSON.parse(localStorage.getItem('translations')) || {};
    translations[index] = translation;
    localStorage.setItem('translations', JSON.stringify(translations));
}

// Function to load translations from localStorage
function loadTranslations() {
    return JSON.parse(localStorage.getItem('translations')) || {};
}

// Function to create the HTML elements for each sentence
function displaySentences(sentences) {
    const container = document.getElementById('sentences-container');
    const savedTranslations = loadTranslations();
    
    sentences.forEach((sentence, index) => {
        const sentenceContainer = document.createElement('div');
        sentenceContainer.classList.add('sentence-container');

        const sentenceText = document.createElement('p');
        sentenceText.textContent = sentence;

        const input = document.createElement('input');
        input.type = 'text';
        input.size = 120
        input.placeholder = 'Translate to English';
        input.id = `translation-${index}`;
        if (savedTranslations[index]) {
            input.value = savedTranslations[index];
        }

        input.addEventListener('input', () => {
            saveTranslation(index, input.value);
        });

        sentenceContainer.appendChild(sentenceText);
        sentenceContainer.appendChild(input);
        container.appendChild(sentenceContainer);
    });
}

// Fetch and display the sentences when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    const sentences = await fetchSentences();
    displaySentences(sentences);
});
