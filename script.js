/* ============================================================
   RANDOM JOKE TERMINAL — core logic
   - Live jokes from Joke API v2 (single + twopart)
   - Dot-matrix canvas portraits, typewriter, 8-bit SFX
   ============================================================ */

/* ---------- 8-bit sound synthesizer (Web Audio API) ---------- */

let audioCtx = null;
let audioEnabled = localStorage.getItem('jokeAppSfx') !== 'off';

function initAudio() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// Retro punchline chirp (E4 -> A4 -> E5 square waves)
function playChirpTone() {
    if (!audioEnabled) return;
    try {
        initAudio();
        const now = audioCtx.currentTime;
        [329.63, 440.0, 659.25].forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const t = now + i * 0.04;

            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, t);

            gain.gain.setValueAtTime(0.001, t);
            gain.gain.linearRampToValueAtTime(0.06, t + 0.008);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(t);
            osc.stop(t + 0.08);
        });
    } catch (e) { /* audio unsupported */ }
}

// Short typewriter blip
function playBlipTone() {
    if (!audioEnabled) return;
    try {
        initAudio();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600 + Math.random() * 200, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.025);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.025);
    } catch (e) { /* audio unsupported */ }
}

/* ---------- Dot-matrix characters ---------- */

const CHARACTERS = [
    {
        id: 'TRUMP',
        code: 'TRUMP.EXE',
        nameZh: '唐纳德·特朗普 (Donald Trump)',
        nameEn: 'Donald Trump',
        matrix: [
            "........................",
            "....XXXXXXXXXXXXX.......",
            "...XXXXXXXXXXXXXXXX.....",
            "..XXXXXXXXXXXXXXXXXX....",
            ".XXXXXXXXXXXXXXXXXXXX...",
            "XXXXXXXXXXXXXXX.XXXXX...",
            ".XXXXX.XXXXXX....XXXX...",
            "......XXXXXXXX..........",
            ".....XX..XX..XX.........",
            ".....XX..XX..XX.........",
            ".....X.XX..XX.X.........",
            "......X......X..........",
            "......XX....XX..........",
            ".......XXXXXX...........",
            ".......XX..XX...........",
            "........XXXX............",
            "........XXXX............",
            ".........XX.............",
            "......XXXXXXXX..........",
            ".....XXX.XX.XXX.........",
            "....XXXX.XX.XXXX........",
            "....XXXX.XX.XXXX........",
            "....XXXX.XX.XXXX........",
            "........................"
        ]
    },
    {
        id: 'IRONMAN',
        code: 'IRON_MAN.EXE',
        nameZh: '钢铁侠 / 托尼·斯塔克 (Iron Man)',
        nameEn: 'Iron Man / Tony Stark',
        matrix: [
            "........................",
            ".......XXXXXXXX.........",
            ".....XXXXXXXXXXXX.......",
            "....XXXXXXXXXXXXXX......",
            "...XXXXXXXXXXXXXXXX.....",
            "..XXX...XXXX...XXXX....",
            "..XX.....XX.....XX.....",
            "..XX.XXXX..XXXX.XX.....",
            "..XX.XXXX..XXXX.XX.....",
            "..XX.XXXX..XXXX.XX.....",
            "..XX.XXXX..XXXX.XX.....",
            "..XX............XX.....",
            "..XXX...XXXX...XXX.....",
            "...XXX..XXXX..XXX......",
            "....XXXXXXXXXXXX.......",
            ".....XXXXXXXXXX........",
            ".....XX.XXXX.XX........",
            "......XX....XX.........",
            ".......XXXXXX..........",
            ".......XXXXXX..........",
            ".....XXXXXXXXXX........",
            "....XXXXXXXXXXXX.......",
            "...XXXXXXXXXXXXXX......",
            "........................"
        ]
    },
    {
        id: 'BATMAN',
        code: 'BATMAN.EXE',
        nameZh: '蝙蝠侠 / 布鲁斯·韦恩 (Batman)',
        nameEn: 'Batman (The Dark Knight)',
        matrix: [
            "...XX..............XX...",
            "...XXX............XXX...",
            "...XXXX..........XXXX...",
            "...XXXXX........XXXXX...",
            "...XXXXXXXXXXXXXXXXXX...",
            "...XXXXXXXXXXXXXXXXXX...",
            "...XXXXXXXXXXXXXXXXXX...",
            "...XXXXXXXXXXXXXXXXXX...",
            "...XX...XXXXXX...XXXX...",
            "...XX....XXXX....XXXX...",
            "...XXX..XXXXXX..XXXXX...",
            "...XXXXXXXXXXXXXXXXXX...",
            "...XXXXXX.XX.XXXXXXXX...",
            "....XXXX......XXXXXX....",
            ".....XXXX....XXXXXX.....",
            "......XXXXXXXXXXXX......",
            "......XXXXXXXXXXXX......",
            "......XX.XXXXXX.XX......",
            "......XX.XXXXXX.XX......",
            "......XXXXXXXXXXXX......",
            "....XXXXXXXXXXXXXXXX....",
            "...XXXXXXXXXXXXXXXXXX...",
            "..XXXXXXXXXXXXXXXXXXXX..",
            "........................"
        ]
    },
    {
        id: 'SUPERMAN',
        code: 'SUPERMAN.EXE',
        nameZh: '超人 / 克拉克·肯特 (Superman)',
        nameEn: 'Superman / Clark Kent',
        matrix: [
            "........................",
            "......XXXXXXXXXX........",
            "....XXXXXXXXXXXXXX......",
            "...XXXXXXXXXXXXXXXX.....",
            "..XXXXXXXXXXXXXXXXXX....",
            "..XXXXX..XXXXXXXXXXX....",
            "..XXXX....XXXXXXXXXX....",
            "..XXXX.....XXXXXXXXX....",
            "..XXXXX.X...XXXXXXXX....",
            "....XXXXX....XXXXXXX....",
            "....XX..XX..XX..XXXX....",
            "....XX..XX..XX...XXX....",
            "....X.XX..XX.X...XXX....",
            ".....X......X....XX.....",
            ".....XX....XX....XX.....",
            "......XXXXXX.....XX.....",
            "......XX..XX.....X......",
            ".......XXXXX............",
            ".......XXXXXX...........",
            "........XXXX............",
            ".....XXXXXXXXXX.........",
            "....XXXXXXXXXXXX........",
            "...XXXXXXXXXXXXXX.......",
            "........................"
        ]
    }
];

/* ---------- Dot-matrix canvas renderer ---------- */

const canvas = document.getElementById('dot-canvas');
const ctx = canvas.getContext('2d');

const DOT_SPACING = 16;
const DOT_RADIUS = 1.6;

let dotGridCols = 0;
let dotGridRows = 0;
let currentChar = null;
let morphProgress = 1.0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    dotGridCols = Math.ceil(canvas.width / DOT_SPACING);
    dotGridRows = Math.ceil(canvas.height / DOT_SPACING);
    drawDotMatrixBackground();
}

function drawDotMatrixBackground() {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const matrix = currentChar ? currentChar.matrix : null;
    const matRows = matrix ? matrix.length : 0;
    const matCols = matrix ? matrix[0].length : 0;

    const startCol = Math.floor((dotGridCols - matCols) / 2);
    const startRow = Math.floor((dotGridRows - matRows) / 2) - 2;

    for (let r = 0; r < dotGridRows; r++) {
        for (let c = 0; c < dotGridCols; c++) {
            const x = c * DOT_SPACING + DOT_SPACING / 2;
            const y = r * DOT_SPACING + DOT_SPACING / 2;

            let isCharPixel = false;
            if (matrix) {
                const matR = r - startRow;
                const matC = c - startCol;
                if (matR >= 0 && matR < matRows && matC >= 0 && matC < matCols) {
                    isCharPixel = matrix[matR][matC] === 'X';
                }
            }

            if (isCharPixel) {
                ctx.fillStyle = 'rgba(204, 255, 0, ' + (0.14 * morphProgress) + ')';
                ctx.beginPath();
                ctx.arc(x, y, DOT_RADIUS + 0.8, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
                ctx.beginPath();
                ctx.arc(x, y, DOT_RADIUS, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

// Fade-in wipe when the background character changes
function triggerCharacterSwitch(newChar) {
    currentChar = newChar;
    morphProgress = 0.2;
    let step = 0;

    (function stepAnim() {
        step++;
        morphProgress = Math.min(1.0, morphProgress + 0.12);
        drawDotMatrixBackground();
        if (step < 8) {
            requestAnimationFrame(stepAnim);
        } else {
            morphProgress = 1.0;
            drawDotMatrixBackground();
        }
    })();
}

/* ---------- DOM refs & state ---------- */

const setupLine = document.getElementById('joke-setup');
const punchlineLine = document.getElementById('joke-punchline');
const setupText = document.getElementById('setup-text');
const punchlineText = document.getElementById('punchline-text');
const cursorSetup = document.getElementById('cursor-setup');
const cursorPunch = document.getElementById('cursor-punch');

const badge = document.getElementById('terminal-badge');
const statusDot = document.querySelector('.status-dot');
const jokeIdEl = document.getElementById('joke-id');
const charTag = document.getElementById('char-tag');
const portraitHint = document.getElementById('portrait-hint');

const generateBtn = document.getElementById('btn-generate');
const copyBtn = document.getElementById('btn-copy');
const audioBtn = document.getElementById('btn-audio');
const audioIndicator = document.getElementById('audio-indicator');
const audioLabel = document.getElementById('audio-label');
const toast = document.getElementById('toast');
const toastText = document.getElementById('toast-text');
const clockEl = document.getElementById('status-clock');

const API_URL = 'https://v2.jokeapi.dev/joke/Any';

let currentJoke = null;      // normalized joke packet (always English source)
let appState = 'standby';    // standby | loading | ok | error
let isLoading = false;
let typewriterTimer = null;
let punchlineTimer = null;
let toastTimer = null;
let activeSeq = 0;           // monotonic token to drop stale async results

/* ---------- Single blinking cursor manager ---------- */

// Only one cursor is ever visible: on the setup line, the punchline line, or neither
function showCursor(where) {
    cursorSetup.style.display = where === 'setup' ? 'inline-block' : 'none';
    cursorPunch.style.display = where === 'punch' ? 'inline-block' : 'none';
}

/* ---------- EN -> ZH translation (free endpoints + cache) ---------- */

const translationCache = new Map();

async function translateViaGoogle(text) {
    const url = 'https://translate.googleapis.com/translate_a/single'
        + '?client=gtx&sl=en&tl=zh-CN&dt=t&q=' + encodeURIComponent(text);
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('google translate HTTP ' + resp.status);
    const data = await resp.json();
    const translated = data[0].map(seg => seg[0]).join('');
    if (!translated.trim()) throw new Error('empty google translation');
    return translated;
}

async function translateViaMyMemory(text) {
    const url = 'https://api.mymemory.translated.net/get?q='
        + encodeURIComponent(text) + '&langpair=en|zh-CN';
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('mymemory HTTP ' + resp.status);
    const data = await resp.json();
    const translated = data && data.responseData && data.responseData.translatedText;
    if (!translated || !translated.trim()) throw new Error('empty mymemory translation');
    return translated;
}

async function translateToZh(text) {
    if (!text) return '';
    if (translationCache.has(text)) return translationCache.get(text);

    let translated;
    try {
        translated = await translateViaGoogle(text);
    } catch (e1) {
        translated = await translateViaMyMemory(text); // throws if both fail
    }

    translationCache.set(text, translated);
    return translated;
}

// Build the localized display packet from the English source joke
async function resolveDisplayPacket(joke, lang, seq) {
    if (lang !== 'zh') return joke;

    const tasks = [translateToZh(joke.setup)];
    if (joke.type === 'twopart') tasks.push(translateToZh(joke.delivery));
    else tasks.push(Promise.resolve(''));

    const results = await Promise.allSettled(tasks);
    if (seq !== activeSeq) return null;

    const setup = results[0].status === 'fulfilled' ? results[0].value : joke.setup;
    const delivery = joke.type === 'twopart'
        ? (results[1].status === 'fulfilled' ? results[1].value : joke.delivery)
        : '';

    return Object.assign({}, joke, { setup: setup, delivery: delivery, translated: results[0].status === 'fulfilled' });
}

/* ---------- Status helpers ---------- */

function setStatus(state) {
    appState = state;

    const busy = state === 'loading' || state === 'translating';
    statusDot.classList.toggle('is-loading', busy);
    statusDot.classList.toggle('is-error', state === 'error');
    generateBtn.classList.toggle('is-busy', busy);

    if (state === 'loading') {
        badge.textContent = t('statusLoading');
    } else if (state === 'translating') {
        badge.textContent = t('statusTranslating');
    } else if (state === 'error') {
        badge.textContent = t('statusError');
    } else if (state === 'ok') {
        badge.textContent = t('statusOk');
    }
}

function updatePortraitHint() {
    if (!currentChar) {
        portraitHint.textContent = t('portraitStandby');
        return;
    }
    const lang = getCurrentLanguage();
    portraitHint.textContent = t('portraitPrefix') + (lang === 'zh' ? currentChar.nameZh : currentChar.nameEn);
}

/* ---------- Toast ---------- */

function showToast(messageKey, isError) {
    toastText.textContent = t(messageKey);
    toast.classList.toggle('is-error', !!isError);
    toast.classList.add('is-visible');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove('is-visible');
    }, 1800);
}

/* ---------- Joke fetching & rendering ---------- */

// Normalize Joke API payload into a single packet shape
function normalizeJoke(data) {
    const hexId = Number(data.id || 0).toString(16).toUpperCase().padStart(2, '0');
    const category = String(data.category || 'ANY').toUpperCase();

    if (data.type === 'twopart') {
        return {
            type: 'twopart',
            setup: data.setup,
            delivery: data.delivery,
            hash: '#0x' + hexId + '_' + category
        };
    }

    return {
        type: 'single',
        setup: data.joke || data.setup + ' ' + (data.delivery || data.punchline || ''),
        delivery: '',
        hash: '#0x' + hexId + '_' + category
    };
}

function pickCharacter() {
    if (CHARACTERS.length === 1) return CHARACTERS[0];
    let next;
    do {
        next = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
    } while (currentChar && next.id === currentChar.id);
    return next;
}

let displayPacket = null;   // localized packet currently on screen (used by copy)

function resetJokeArea() {
    clearInterval(typewriterTimer);
    clearTimeout(punchlineTimer);
    setupLine.classList.remove('is-error');
    setupText.textContent = '';
    punchlineText.textContent = '';
    punchlineLine.hidden = true;
    showCursor(null);
}

// Show a message instantly (loading / error states); cursor rests on this line
function showMessage(key, isError) {
    resetJokeArea();
    setupLine.classList.toggle('is-error', !!isError);
    setupText.textContent = '>> ' + t(key);
    showCursor('setup');
}

// Typewriter delivery of a localized packet; the single cursor follows the active line
function renderJoke(joke) {
    resetJokeArea();
    displayPacket = joke;
    jokeIdEl.textContent = joke.hash;
    showCursor('setup');

    if (joke.type === 'twopart') {
        let i = 0;
        typewriterTimer = setInterval(() => {
            if (i < joke.setup.length) {
                setupText.textContent += joke.setup.charAt(i);
                if (i % 2 === 0) playBlipTone();
                i++;
            } else {
                clearInterval(typewriterTimer);
                punchlineTimer = setTimeout(() => {
                    punchlineLine.hidden = false;
                    showCursor('punch');
                    punchlineText.textContent = joke.delivery;
                    playChirpTone();
                }, 220);
            }
        }, 14);
    } else {
        let i = 0;
        typewriterTimer = setInterval(() => {
            if (i < joke.setup.length) {
                setupText.textContent += joke.setup.charAt(i);
                if (i % 2 === 0) playBlipTone();
                i++;
            } else {
                clearInterval(typewriterTimer);
                showCursor(null);
                playChirpTone();
            }
        }, 14);
    }
}

async function getRandomJoke() {
    if (isLoading) return;

    const seq = ++activeSeq;
    isLoading = true;
    currentJoke = null;
    displayPacket = null;
    setStatus('loading');
    showMessage('statusLoading', false);
    jokeIdEl.textContent = '#0x--_SYNCING';
    charTag.textContent = 'CURRENT: SCANNING.EXE';

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('HTTP ' + response.status);

        const data = await response.json();
        if (data.error) throw new Error(data.message || 'API error');
        if (seq !== activeSeq) return;

        currentJoke = normalizeJoke(data);

        const nextChar = pickCharacter();
        triggerCharacterSwitch(nextChar);
        charTag.textContent = 'CURRENT: ' + nextChar.code;
        updatePortraitHint();

        const lang = getCurrentLanguage();
        if (lang === 'zh') setStatus('translating');

        const packet = await resolveDisplayPacket(currentJoke, lang, seq);
        if (packet === null || seq !== activeSeq) return;

        setStatus('ok');
        renderJoke(packet);
    } catch (error) {
        if (seq !== activeSeq) return;
        console.error('Error fetching joke:', error);
        setStatus('error');
        showMessage('error', true);
        jokeIdEl.textContent = '#0xFF_LINK_ERR';
        charTag.textContent = 'CURRENT: OFFLINE.EXE';
    } finally {
        // Concurrent fetches can't start while loading (button guarded),
        // so resetting unconditionally is safe even if a language re-render
        // has since taken over the sequence.
        isLoading = false;
    }
}

// Re-render the current joke after a language switch (translates on demand)
async function rerenderForLanguage() {
    if (!currentJoke) return;

    const seq = ++activeSeq;
    const lang = getCurrentLanguage();

    if (lang !== 'zh') {
        setStatus('ok');
        renderJoke(currentJoke);
        return;
    }

    setStatus('translating');
    showMessage('statusTranslating', false);
    jokeIdEl.textContent = currentJoke.hash;

    const packet = await resolveDisplayPacket(currentJoke, lang, seq);
    if (packet === null || seq !== activeSeq) return;

    setStatus('ok');
    renderJoke(packet);
}

/* ---------- Copy ---------- */

function copyJoke() {
    const packet = displayPacket;
    if (!packet) {
        showToast('getJokeFirst', true);
        return;
    }

    const body = packet.type === 'twopart'
        ? packet.setup + '\n> ' + packet.delivery
        : packet.setup;
    const text = body + '\n[via JOKEAPI.V2 // ' + packet.hash + ']';

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => showToast('copied', false))
            .catch(() => fallbackCopy(text));
    } else {
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();

    let ok = false;
    try {
        ok = document.execCommand('copy');
    } catch (e) {
        ok = false;
    }
    document.body.removeChild(textArea);

    showToast(ok ? 'copied' : 'copyFailed', !ok);
}

/* ---------- SFX toggle ---------- */

function syncAudioUI() {
    audioIndicator.classList.toggle('is-off', !audioEnabled);
    audioLabel.textContent = audioEnabled ? t('sfxOn') : t('sfxOff');
}

audioBtn.addEventListener('click', () => {
    audioEnabled = !audioEnabled;
    localStorage.setItem('jokeAppSfx', audioEnabled ? 'on' : 'off');
    syncAudioUI();
    if (audioEnabled) {
        initAudio();
        playChirpTone();
    }
});

/* ---------- Events ---------- */

generateBtn.addEventListener('click', () => {
    playChirpTone();
    getRandomJoke();
});

copyBtn.addEventListener('click', copyJoke);

document.getElementById('lang-zh').addEventListener('click', () => setLanguage('zh'));
document.getElementById('lang-en').addEventListener('click', () => setLanguage('en'));

// Re-localize every dynamic part of the page when the language changes
window.addEventListener('jokeapp:langchange', () => {
    if ((appState === 'ok' || appState === 'translating') && currentJoke) {
        // Re-render the joke itself (instant for EN, translated for ZH)
        rerenderForLanguage();
        updatePortraitHint();
        syncAudioUI();
        return;
    }

    if (appState === 'error') {
        setStatus('error');
        setupText.textContent = '>> ' + t('error');
    } else {
        // loading / standby: just refresh badge & hints;
        // an in-flight fetch reads the current language when it resolves
        setStatus(appState === 'standby' ? 'loading' : appState);
    }

    updatePortraitHint();
    syncAudioUI();
});

// Space / Enter fetches the next packet
window.addEventListener('keydown', (e) => {
    if ((e.code === 'Space' || e.code === 'Enter') && e.target.tagName !== 'BUTTON') {
        e.preventDefault();
        playChirpTone();
        getRandomJoke();
    }
});

window.addEventListener('resize', resizeCanvas);

/* ---------- Footer clock ---------- */

function tickClock() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    clockEl.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
}

setInterval(tickClock, 1000);

/* ---------- Init ---------- */

window.addEventListener('load', () => {
    showCursor(null);
    syncAudioUI();
    tickClock();
    resizeCanvas();
    updatePortraitHint();
    getRandomJoke();
});
