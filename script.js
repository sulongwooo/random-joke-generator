const jokeDisplay = document.getElementById('jokeDisplay');
const getJokeBtn = document.getElementById('getJokeBtn');
const shareBtn = document.getElementById('shareBtn');
const loading = document.getElementById('loading');

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
            currentJoke = "No joke available. Try again!";
        } else {
            currentJoke = data.joke || data.setup + ' ' + data.punchline;
        }
        
        displayJoke();
    } catch (error) {
        console.error('Error fetching joke:', error);
        currentJoke = "Oops! Failed to fetch a joke. Please check your internet connection and try again.";
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
    if (!currentJoke || currentJoke.includes('Try again')) {
        alert('Get a joke first!');
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
        alert('Failed to copy. Please try again.');
    }
    
    document.body.removeChild(textArea);
}

// Show share feedback
function showShareFeedback() {
    const originalText = shareBtn.textContent;
    shareBtn.textContent = '✅ Copied!';
    setTimeout(() => {
        shareBtn.textContent = originalText;
    }, 2000);
}

// Event listeners
getJokeBtn.addEventListener('click', getRandomJoke);
shareBtn.addEventListener('click', shareJoke);

// Load a joke on page load
window.addEventListener('load', getRandomJoke);