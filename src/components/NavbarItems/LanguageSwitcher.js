import React from 'react';
import { useLanguage } from '@site/src/context/LanguageContext';
import styles from './LanguageSwitcher.module.css';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className={styles.switcher}>
      <button
        className={`${styles.btn} ${lang === 'en' ? styles.active : ''}`}
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
        lang="en"
      >
        EN
      </button>
      <span className={styles.divider}>|</span>
      <button
        className={`${styles.btn} ${lang === 'zh' ? styles.active : ''}`}
        onClick={() => setLang('zh')}
        aria-pressed={lang === 'zh'}
        lang="zh-CN"
      >
        中文
      </button>
    </div>
  );
}
