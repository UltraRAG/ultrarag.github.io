import React, {useEffect, useId, useRef, useState} from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import {useLanguage} from '@site/src/context/LanguageContext';
import styles from './MegaMenu.module.css';

export default function MegaMenu({label, labelZh, items, to: triggerTo}) {
  const {lang} = useLanguage();
  const isZh = lang === 'zh';
  const displayLabel = isZh ? (labelZh || label) : label;
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const toggleRef = useRef(null);
  const timeoutRef = useRef(null);
  const menuId = useId();

  const open = () => {
    clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };
  const close = () => {
    clearTimeout(timeoutRef.current);
    setIsOpen(false);
  };

  useEffect(() => {
    const outside = event => {
      if (!containerRef.current?.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('pointerdown', outside);
    return () => {
      clearTimeout(timeoutRef.current);
      document.removeEventListener('pointerdown', outside);
    };
  }, []);

  return (
    <div
      className={clsx('navbar__item', styles.megaMenuContainer)}
      ref={containerRef}
      onMouseLeave={() => {
        if (!containerRef.current?.contains(document.activeElement)) {
          timeoutRef.current = setTimeout(close, 150);
        }
      }}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) close();
      }}
      onKeyDown={event => {
        if (event.key === 'Escape' && isOpen) {
          event.preventDefault();
          close();
          toggleRef.current?.focus();
        }
        if (event.key === 'ArrowDown' && event.target.closest('a, button')?.parentElement === containerRef.current) {
          event.preventDefault();
          open();
          requestAnimationFrame(() => document.getElementById(menuId)?.querySelector('a')?.focus());
        }
      }}>
      {triggerTo && (
        <Link to={triggerTo} className={clsx('navbar__link', styles.megaMenuTrigger)} onMouseEnter={open} onClick={close}>
          {displayLabel}
        </Link>
      )}
      <button
        type="button"
        ref={toggleRef}
        className={styles.menuToggle}
        aria-label={`${isOpen ? (isZh ? '收起' : 'Collapse') : (isZh ? '展开' : 'Expand')} ${displayLabel}`}
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => isOpen ? close() : open()}>
        {!triggerTo && displayLabel}
        <svg aria-hidden="true" width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <div id={menuId} hidden={!isOpen} className={clsx(styles.megaMenuDropdown, isOpen && styles.show)}>
        <div className={styles.dropdownContent}>
          {items.map((column, index) => (
            <div key={index} className={styles.menuColumn}>
              {column.title && <div className={styles.columnTitle}>{isZh ? (column.titleZh || column.title) : column.title}</div>}
              <ul className={styles.menuList}>
                {column.items.map((item, itemIndex) => (
                  <li key={itemIndex} className={styles.menuItem}>
                    <Link to={item.to || item.href} className={styles.menuLink} target={item.target}
                      rel={item.target === '_blank' ? 'noopener noreferrer' : undefined} onClick={close}>
                      {isZh ? (item.labelZh || item.label) : item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
