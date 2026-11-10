import Head from '@docusaurus/Head';
import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext({
  lang: 'en',
  setLang: () => {},
});

const STORAGE_KEY = 'ultrarag_lang';

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('en');

  // 初始化：从 localStorage 读取
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'zh' || saved === 'en') {
        setLangState(saved);
      }
    } catch (e) {
      // SSR or localStorage not available
    }
  }, []);

  const setLang = (newLang) => {
    if (newLang !== 'en' && newLang !== 'zh') return;
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch (e) {
      // ignore
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
      {/* Render after Layout so its static locale does not override the selection. */}
      <Head><html lang={lang === 'zh' ? 'zh-CN' : 'en'} /></Head>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
