/* ============================================================
   i18n — bilingual (zh / en) terminal dictionaries
   Exposes: getCurrentLanguage / setLanguage / toggleLanguage / t
   ============================================================ */

const translations = {
    en: {
        title: 'RANDOM JOKE TERMINAL',
        protocol: '[ PROTOCOL // JOKEAPI.V2 ]',
        heroTitle: 'RANDOM JOKE TERMINAL',
        heroSubtitle: 'DECENTRALIZED PUNCHLINES // LOW LATENCY LAUGHTER',
        statusOk: 'JOKE PACKET // RECEIVED',
        statusLoading: 'PACKET // SYNCING...',
        statusTranslating: 'TRANSLATING // EN>ZH...',
        statusError: 'LINK FAILURE // RX ERROR',
        btnGen: 'GENERATE JOKE',
        btnCopy: 'COPY JOKE',
        sfxOn: 'SFX: ON',
        sfxOff: 'SFX: OFF',
        copied: 'COPIED TO CLIPBOARD',
        copyFailed: 'COPY FAILED, TRY AGAIN',
        getJokeFirst: 'RECEIVE A JOKE PACKET FIRST!',
        error: 'LINK ERROR: FAILED TO FETCH A JOKE. CHECK YOUR CONNECTION AND RETRY.',
        noJoke: 'EMPTY PACKET: NO JOKE AVAILABLE. RETRY!',
        spaceHint: '[SPACE] NEXT',
        portraitStandby: 'BG DOT-MATRIX: STANDBY',
        portraitPrefix: 'BG DOT-MATRIX: ',
        footerBrand: 'RANDOM_JOKE_TERMINAL // 1-BIT RETRO V3.2'
    },
    zh: {
        title: '随机笑话终端',
        protocol: '[ 协议 // JOKEAPI.V2 ]',
        heroTitle: '随机笑话终端',
        heroSubtitle: '去中心化笑话数据包 · 低延迟大笑传输',
        statusOk: '笑话数据包 // 接收成功',
        statusLoading: '数据包 // 同步中...',
        statusTranslating: '译码中 // 英译汉...',
        statusError: '链路故障 // 接收失败',
        btnGen: '换一个笑话',
        btnCopy: '复制笑话',
        sfxOn: '音效: 开启',
        sfxOff: '音效: 静音',
        copied: '已复制到剪贴板',
        copyFailed: '复制失败，请重试',
        getJokeFirst: '请先成功接收一个笑话数据包！',
        error: '链路异常：获取笑话失败，请检查网络后重试。',
        noJoke: '空数据包：暂无可用笑话，请重试！',
        spaceHint: '[空格] 换一个',
        portraitStandby: '背景点阵：待机中',
        portraitPrefix: '背景点阵角色：',
        footerBrand: '随机笑话终端 // 1-BIT RETRO V3.2'
    }
};

// 获取当前语言
function getCurrentLanguage() {
    const saved = localStorage.getItem('jokeAppLanguage');
    if (saved === 'en' || saved === 'zh') return saved;

    const browserLang = navigator.language.startsWith('zh') ? 'zh' : 'en';
    return browserLang;
}

// 获取翻译文本
function t(key) {
    const lang = getCurrentLanguage();
    return translations[lang][key] || translations.en[key];
}

// 同步双语分段按钮的高亮状态
function syncLangButtons(lang) {
    const zhBtn = document.getElementById('lang-zh');
    const enBtn = document.getElementById('lang-en');
    if (zhBtn) zhBtn.classList.toggle('is-active', lang === 'zh');
    if (enBtn) enBtn.classList.toggle('is-active', lang === 'en');
}

// 更新页面语言
function updatePageLanguage(lang) {
    document.documentElement.lang = lang;

    // 更新所有带有 data-i18n 属性的静态元素
    document.querySelectorAll('[data-i18n]').forEach(elem => {
        const key = elem.getAttribute('data-i18n');
        const text = translations[lang][key];
        if (text !== undefined) elem.textContent = text;
    });

    const titleElem = document.querySelector('title');
    if (titleElem) titleElem.textContent = t('title');

    syncLangButtons(lang);

    // 通知业务脚本刷新与状态相关的动态文案
    window.dispatchEvent(new CustomEvent('jokeapp:langchange', { detail: { lang } }));
}

// 设置语言
function setLanguage(lang) {
    if (lang !== 'en' && lang !== 'zh') return;
    localStorage.setItem('jokeAppLanguage', lang);
    updatePageLanguage(lang);
}

// 切换语言
function toggleLanguage() {
    setLanguage(getCurrentLanguage() === 'en' ? 'zh' : 'en');
}

// 初始化语言
document.addEventListener('DOMContentLoaded', () => {
    updatePageLanguage(getCurrentLanguage());
});
