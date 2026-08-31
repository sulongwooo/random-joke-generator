# Random Joke Generator - Getting Started Guide

Welcome to the Random Joke Generator project! This guide will help you get started with the project.

## Installation

### Option 1: Clone and Open Locally

```bash
# Clone the repository
git clone https://github.com/sulongwooo/random-joke-generator.git

# Navigate to the directory
cd random-joke-generator

# Open in your browser
open index.html
# or
start index.html  # Windows
```

### Option 2: Use GitHub Pages

The project is available online at:
`https://sulongwooo.github.io/random-joke-generator/`

## How It Works

### Architecture

```
┌─────────────────────┐
│   User Interface    │  (HTML/CSS)
│   - Get Joke Button │
│   - Share Button    │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  JavaScript Logic   │  (script.js)
│  - Fetch API Call   │
│  - Error Handling   │
│  - Clipboard Copy   │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│    Joke API v2      │  (External)
│ v2.jokeapi.dev      │
└─────────────────────┘
```

### API Integration

The project uses [Joke API v2](https://jokeapi.dev/):

```javascript
// Example API call
fetch('https://v2.jokeapi.dev/joke/Any?type=single')
  .then(response => response.json())
  .then(data => console.log(data.joke))
  .catch(error => console.error('Error:', error));
```

**Response Format:**
```json
{
  "error": false,
  "category": "General",
  "type": "single",
  "joke": "Why don't scientists trust atoms? Because they make up everything!",
  "flags": {
    "nsfw": false,
    "religious": false,
    "political": false,
    "racist": false,
    "sexist": false,
    "explicit": false
  },
  "id": 1,
  "safe": true,
  "lang": "en"
}
```

## Project Structure

```
random-joke-generator/
├── index.html           # Main HTML file
├── style.css            # CSS styling and animations
├── script.js            # JavaScript functionality
├── README.md            # Project documentation
├── CONTRIBUTING.md      # Contribution guidelines
├── CODE_OF_CONDUCT.md   # Community guidelines
├── SECURITY.md          # Security policy
├── LICENSE              # MIT License
└── GETTING_STARTED.md   # This file
```

## Development

### Making Changes

1. **Modify the UI** → Edit `index.html`
2. **Change styling** → Edit `style.css`
3. **Update logic** → Edit `script.js`
4. **Test locally** → Open `index.html` in your browser

### Common Tasks

#### Adding a new feature
1. Plan your feature
2. Create a branch: `git checkout -b feature/YourFeature`
3. Make changes
4. Test thoroughly
5. Commit: `git commit -m "Add: YourFeature"`
6. Push: `git push origin feature/YourFeature`
7. Open a Pull Request

#### Fixing a bug
1. Create an issue describing the bug
2. Create a branch: `git checkout -b fix/BugName`
3. Fix the bug
4. Test to ensure it's fixed
5. Follow commit steps above

#### Improving documentation
1. Edit the relevant `.md` file
2. Test that links work
3. Commit and push
4. Open a Pull Request

## API Rate Limits

The Joke API v2 has generous rate limits:
- 100 requests per hour for free tier
- No API key required
- Public and free to use

If rate limits are hit, the app displays an error message.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Known Limitations

- Older IE versions may not support Clipboard API (fallback included)
- CORS restrictions may apply in some environments

## Troubleshooting

### Issue: Jokes not loading
**Solution:**
- Check internet connection
- Check browser console for errors (F12)
- Try clearing cache (Ctrl+Shift+Delete)
- Verify API is responding: https://v2.jokeapi.dev/joke/Any?type=single

### Issue: Copy button not working
**Solution:**
- Browser must allow clipboard access
- Try using fallback method (should work automatically)
- Check browser security settings

### Issue: Styling looks broken
**Solution:**
- Ensure `style.css` is in the same directory
- Clear browser cache
- Reload the page

## Next Steps

- 🌟 Star the repository
- 🐛 Report bugs if you find any
- 💡 Suggest new features
- 🤝 Contribute improvements
- 📢 Share with friends

## Learning Resources

- [MDN Web Docs - Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [MDN Web Docs - Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- [JavaScript.info - Async/Await](https://javascript.info/async-await)
- [CSS-Tricks - Gradients](https://css-tricks.com/snippets/css/css-image-background-size-of-container/)

## Questions?

Feel free to:
- Open an issue with the `question` label
- Check existing issues for answers
- Review the documentation

Happy coding! 🎉
