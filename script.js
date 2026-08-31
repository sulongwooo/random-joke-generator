const jokeDisplay = document.getElementById('jokeDisplay');
const getJokeBtn = document.getElementById('getJokeBtn');
const shareBtn = document.getElementById('shareBtn');
const loading = document.getElementById('loading');
const languageBtn = document.getElementById('languageBtn');

let currentJoke = '';

// Fetch a random joke from the Joke API
async function getRandomJoke() {
    // Using Joke API v2 - free and reliable
    const apiUrl = 'https://v2.jokeapi.dev/joke/Any?type=single';
    
    showLoading(true);
    
    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Parse the joke from the API response
        if (data.error) {
            currentJoke = t('noJoke');
        } else {
            currentJoke = data.joke || data.setup + ' ' + data.punchline;
        }
        
        displayJoke();
    } catch (error) {
        console.error('Error fetching joke:', error);
        currentJoke = t('error');
        displayJoke();
    } finally {
        showLoading(false);
    }
}

// Display the joke with animation
function displayJoke() {
    jokeDisplay.innerHTML = `<p>${currentJoke}</p>`;
}

// Show/hide loading indicator
function showLoading(show) {
    if (show) {
        loading.classList.add('show');
        jokeDisplay.innerHTML = '';
    } else {
        loading.classList.remove('show');
    }
}

// Share the joke via clipboard
function shareJoke() {
    if (!currentJoke || currentJoke.includes(t('noJoke'))) {
        alert(t('getJokeFirst'));
        return;
    }
    
    // Try modern Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(currentJoke).then(() => {
            showShareFeedback();
        }).catch(err => {
            console.error('Clipboard API failed:', err);
            fallbackCopy();
        });
    } else {
        // Fallback for older browsers
        fallbackCopy();
    }
}

// Fallback copy function for older browsers
function fallbackCopy() {
    const textArea = document.createElement('textarea');
    textArea.value = currentJoke;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        showShareFeedback();
    } catch (err) {
        alert(t('failedCopy'));
    }
    
    document.body.removeChild(textArea);
}

// Show share feedback
function showShareFeedback() {
    const originalText = shareBtn.textContent;
    shareBtn.textContent = t('copied');
    setTimeout(() => {
        shareBtn.textContent = t('shareBtn');
    }, 2000);
}

// Event listeners
getJokeBtn.addEventListener('click', getRandomJoke);
shareBtn.addEventListener('click', shareJoke);

// Language switcher
languageBtn.addEventListener('click', () => {
    toggleLanguage();
});

// Load a joke on page load
window.addEventListener('load', getRandomJoke);
