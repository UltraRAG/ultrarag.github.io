import React, { useState, useEffect, useRef } from 'react';
import Link from '@docusaurus/Link';
import { useNavbarMobileSidebar } from '@docusaurus/theme-common/internal';
import { useLanguage } from '@site/src/context/LanguageContext';
import styles from './styles.module.css';

/* ── 菜单数据 ── */
const NAV_ITEMS = {
  en: [
    { type: 'link', label: 'Home', to: '/' },
    {
      type: 'group', label: 'Research', to: '/research',
      children: [
        { section: 'Latest', items: [{ label: 'Blog', to: '/blog' }] },
        {
          section: 'Models', items: [
            { label: 'AgentCPM-Report', href: 'https://huggingface.co/openbmb/AgentCPM-Report' },
            { label: 'MiniCPM-Embedding-Light', href: 'https://huggingface.co/openbmb/MiniCPM-Embedding-Light' },
          ],
        },
        { section: 'Papers', items: [{ label: 'Featured Papers', to: '/research#papers' }] },
      ],
    },
    {
      type: 'group', label: 'Team', to: '/team',
      children: [
        { section: 'About', items: [{ label: 'Members', to: '/team' }] },
        {
          section: 'Connect', items: [
            { label: 'Contact', to: '/contact' },
            { label: 'Join Us', href: 'https://nlp.csai.tsinghua.edu.cn/job/29' },
          ],
        },
      ],
    },
  ],
  zh: [
    { type: 'link', label: '首页', to: '/' },
    {
      type: 'group', label: '研究', to: '/research',
      children: [
        { section: '最新动态', items: [{ label: '博客', to: '/blog' }] },
        {
          section: '模型', items: [
            { label: 'AgentCPM-Report', href: 'https://huggingface.co/openbmb/AgentCPM-Report' },
            { label: 'MiniCPM-Embedding-Light', href: 'https://huggingface.co/openbmb/MiniCPM-Embedding-Light' },
          ],
        },
        { section: '论文', items: [{ label: '精选论文', to: '/research#papers' }] },
      ],
    },
    {
      type: 'group', label: '团队', to: '/team',
      children: [
        { section: '关于我们', items: [{ label: '团队成员', to: '/team' }] },
        {
          section: '联系', items: [
            { label: '联系我们', to: '/contact' },
            { label: '加入我们', href: 'https://nlp.csai.tsinghua.edu.cn/job/29' },
          ],
        },
      ],
    },
  ],
};

/* ── 展开/折叠箭头 ── */
function Chevron({ open }) {
  return (
    <svg
      className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
      width="12" height="12" viewBox="0 0 12 12" fill="none"
    >
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── 外部链接图标 ── */
function ExternalIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginLeft: 4, opacity: 0.4 }}>
      <path d="M4.5 1.5H2.5C1.948 1.5 1.5 1.948 1.5 2.5V9.5C1.5 10.052 1.948 10.5 2.5 10.5H9.5C10.052 10.5 10.5 10.052 10.5 9.5V7.5M7.5 1.5H10.5M10.5 1.5V4.5M10.5 1.5L5 7"
        stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── 可折叠菜单组 ── */
function MenuGroup({ item, onClose, isZh }) {
  const [open, setOpen] = useState(false);

  return (
    <li className={styles.groupItem}>
      <div className={styles.groupHeader}>
        <Link to={item.to} className={styles.groupLabel} onClick={onClose}>
          {item.label}
        </Link>
        <button
          className={styles.expandBtn}
          onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
          aria-label={`${open ? (isZh ? '收起' : 'Collapse') : (isZh ? '展开' : 'Expand')} ${item.label}`}
          aria-expanded={open}
          aria-controls={`mobile-${item.to.slice(1)}`}
        >
          <Chevron open={open} />
        </button>
      </div>

      {open && (
        <div id={`mobile-${item.to.slice(1)}`} className={styles.subMenu}>
          {item.children.map((section, si) => (
            <div key={si} className={styles.section}>
              <div className={styles.sectionTitle}>{section.section}</div>
              <ul className={styles.sectionList}>
                {section.items.map((link, li) => (
                  <li key={li}>
                    <Link
                      to={link.to || link.href}
                      target={link.href ? '_blank' : undefined}
                      rel={link.href ? 'noopener noreferrer' : undefined}
                      className={styles.subLink}
                      onClick={onClose}
                    >
                      {link.label}
                      {link.href && <ExternalIcon />}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </li>
  );
}

/* ── 主组件 ── */
export default function NavbarMobilePrimaryMenu() {
  const mobileSidebar = useNavbarMobileSidebar();
  const { lang, setLang } = useLanguage();
  const items = NAV_ITEMS[lang] || NAV_ITEMS.en;
  const menuRef = useRef(null);

  useEffect(() => {
    if (!mobileSidebar.shown) return;
    const drawer = menuRef.current?.closest('.navbar-sidebar');
    if (!drawer) return;
    const frame = requestAnimationFrame(() => drawer.querySelector('.navbar-sidebar__close')?.focus());
    const onKeyDown = event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        mobileSidebar.toggle();
      }
      if (event.key === 'Tab') {
        if (!drawer.contains(document.activeElement)) {
          event.preventDefault();
          drawer.querySelector('.navbar-sidebar__close')?.focus();
          return;
        }
        const controls = [...drawer.querySelectorAll('a[href], button, [tabindex="0"]')]
          .filter(element => !element.disabled && element.getClientRects().length && !element.closest('[inert]'));
        if (event.shiftKey && document.activeElement === controls[0]) {
          event.preventDefault(); controls.at(-1)?.focus();
        } else if (!event.shiftKey && document.activeElement === controls.at(-1)) {
          event.preventDefault(); controls[0]?.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKeyDown);
      if (drawer.contains(document.activeElement)) document.querySelector('.navbar__toggle')?.focus();
    };
  }, [mobileSidebar.shown, mobileSidebar.toggle]);

  const closeSidebar = () => mobileSidebar.toggle();

  return (
    <div className={styles.mobileMenu} ref={menuRef}>
      <ul className={styles.menuList}>
        {items.map((item, i) =>
          item.type === 'group' ? (
            <MenuGroup key={i} item={item} onClose={closeSidebar} isZh={lang === 'zh'} />
          ) : (
            <li key={i} className={styles.menuItem}>
              <Link to={item.to} className={styles.menuLink} onClick={closeSidebar}>
                {item.label}
              </Link>
            </li>
          )
        )}
      </ul>

      {/* 底部工具栏 */}
      <div className={styles.bottomBar}>
        {/* GitHub */}
        <a
          href="https://github.com/OpenBMB/UltraRAG"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.githubLink}
          onClick={closeSidebar}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.332-1.756-1.332-1.756-1.089-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.604-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z" />
          </svg>
          <span>GitHub</span>
        </a>

        {/* 语言切换 */}
        <div className={styles.langSwitch}>
          <button
            className={`${styles.langBtn} ${lang === 'en' ? styles.langActive : ''}`}
            onClick={() => setLang('en')}
            aria-pressed={lang === 'en'}
            lang="en"
          >
            EN
          </button>
          <span className={styles.langDivider}>|</span>
          <button
            className={`${styles.langBtn} ${lang === 'zh' ? styles.langActive : ''}`}
            onClick={() => setLang('zh')}
            aria-pressed={lang === 'zh'}
            lang="zh-CN"
          >
            中文
          </button>
        </div>
      </div>
    </div>
  );
}
