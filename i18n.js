const translations = {
    en: {
        title: "😂 Random Joke Generator",
        placeholder: "Click the button below to get a random joke!",
        getJokeBtn: "Get a Joke",
        shareBtn: "Share Joke",
        loading: "Loading...",
        copied: "✅ Copied!",
        error: "Oops! Failed to fetch a joke. Please check your internet connection and try again.",
        noJoke: "No joke available. Try again!",
        getJokeFirst: "Get a joke first!",
        failedCopy: "Failed to copy. Please try again.",
        language: "Language",
        english: "English",
        chinese: "中文"
    },
    zh: {
        title: "😂 随机笑话生成器",
        placeholder: "点击下方按钮获取随机笑话！",
        getJokeBtn: "获取笑话",
        shareBtn: "分享笑话",
        loading: "加载中...",
        copied: "✅ 已复制！",
        error: "哎呀！获取笑话失败。请检查您的网络连接，然后重试。",
        noJoke: "没有可用的笑话。请重试！",
        getJokeFirst: "请先获取笑话！",
        failedCopy: "复制失败。请重试。",
        language: "语言",
        english: "English",
        chinese: "中文"
    }
};

// 获取当前语言
function getCurrentLanguage() {
    const saved = localStorage.getItem('jokeAppLanguage');
    if (saved) return saved;
    
    const browserLang = navigator.language.startsWith('zh') ? 'zh' : 'en';
    return browserLang;
}

// 设置语言
function setLanguage(lang) {
    localStorage.setItem('jokeAppLanguage', lang);
    updatePageLanguage(lang);
}

// 获取翻译文本
function t(key) {
    const lang = getCurrentLanguage();
    return translations[lang][key] || translations['en'][key];
}

// 更新页面语言
function updatePageLanguage(lang) {
    document.documentElement.lang = lang;
    
    // 更新所有带有 data-i18n 属性的元素
    document.querySelectorAll('[data-i18n]').forEach(elem => {
        const key = elem.getAttribute('data-i18n');
        if (elem.tagName === 'INPUT' || elem.tagName === 'BUTTON') {
            elem.value = translations[lang][key] || elem.value;
            elem.textContent = translations[lang][key] || elem.textContent;
        } else {
            elem.textContent = translations[lang][key] || elem.textContent;
        }
    });
    
    // 特殊处理按钮文本
    const getJokeBtn = document.getElementById('getJokeBtn');
    const shareBtn = document.getElementById('shareBtn');
    const languageBtn = document.getElementById('languageBtn');
    
    if (getJokeBtn) getJokeBtn.textContent = t('getJokeBtn');
    if (shareBtn) shareBtn.textContent = t('shareBtn');
    if (languageBtn) {
        languageBtn.textContent = lang === 'en' ? '中文' : 'English';
    }
    
    // 更新 title
    const titleElem = document.querySelector('title');
    if (titleElem) titleElem.textContent = t('title');
}

// 切换语言
function toggleLanguage() {
    const currentLang = getCurrentLanguage();
    const newLang = currentLang === 'en' ? 'zh' : 'en';
    setLanguage(newLang);
}

// 初始化语言
document.addEventListener('DOMContentLoaded', () => {
    const lang = getCurrentLanguage();
    updatePageLanguage(lang);
});
