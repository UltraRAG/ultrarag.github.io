import React, { useState, useEffect, useRef } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useIsZh } from '../../i18n';
import styles from './styles.module.css';
import clsx from 'clsx';
import {externalUrl} from '../../utils/externalUrl.mjs';

// 目标 URL (使用 jsDelivr CDN 以获得更好的性能和 CORS 支持)
const PAPER_SOURCE_URL = 'https://cdn.jsdelivr.net/gh/OpenBMB/UltraRAG@rag-paper-daily/rag-paper-daily/README.md';

function CalendarIcon(props) {
  return (
    <svg
      {...props}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
}

function PaperCard({ title, link, abstract, summary }) {
  // 清理 summary 中的 HTML 标签（如果有）
  const cleanSummary = summary?.replace(/<details>.*?<\/details>/g, '').replace(/<summary>.*?<\/summary>/g, '').trim();
  
  return (
    <div className={styles.paperCard}>
      <div className={styles.cardHeader}>
        <Link to={link} className={styles.paperTitle} target="_blank" rel="noopener noreferrer">
          {title}
        </Link>
      </div>
      
      <div className={styles.contentSection}>
        {/* 总结卡片 */}
        {cleanSummary && (
          <div className={styles.summaryBox}>
            <span className={styles.summaryLabel}>TL;DR</span>
            <p className={styles.summaryText}>{cleanSummary}</p>
          </div>
        )}

        {/* 可折叠摘要 */}
        {abstract && (
          <details className={styles.abstractDetails}>
            <summary className={styles.abstractSummary}>Abstract</summary>
            <div className={styles.abstractContent}>
              {abstract}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

export default function DailyPapers() {
  const isZh = useIsZh();
  const [papersByDate, setPapersByDate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDate, setActiveDate] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [visibleDates, setVisibleDates] = useState(7);
  const pendingScroll = useRef(null);

  useEffect(() => {
    if (!pendingScroll.current) return;
    const element = document.getElementById(`date-${pendingScroll.current}`);
    if (element) {
      element.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
      pendingScroll.current = null;
    }
  }, [activeDate, visibleDates, loading]);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    setLoading(true);
    setError(null);
    async function fetchPapers() {
      try {
        const response = await fetch(PAPER_SOURCE_URL, {signal: controller.signal});
        if (!response.ok) throw new Error('Failed to fetch papers');
        const text = await response.text();
        const parsedData = parseMarkdown(text);
        if (controller.signal.aborted) return;
        if (!parsedData.length) throw new Error('No papers available');
        setPapersByDate(parsedData);
        if (parsedData.length > 0) {
          const requested = window.location.hash.slice(1);
          const index = parsedData.findIndex(group => `date-${group.date}` === requested);
          setVisibleDates(Math.max(7, index + 1));
          setActiveDate(parsedData[Math.max(0, index)].date);
          if (index >= 0) pendingScroll.current = parsedData[index].date;
        }
      } catch (err) {
        if (!disposed) setError(true);
      } finally {
        clearTimeout(timeout);
        if (!disposed) setLoading(false);
      }
    }

    let disposed = false;
    fetchPapers();
    return () => {
      disposed = true;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [attempt]);

  // 简单的 Markdown/HTML 解析器
  const parseMarkdown = (markdown) => {
    const results = [];
    // 按日期分割 "### 📅 "
    const dateSections = markdown.split('### 📅 ');
    
    // 跳过第一个（通常是标题部分）
    for (let i = 1; i < dateSections.length; i++) {
      const section = dateSections[i];
      const dateMatch = section.match(/^([^\n]+)/);
      if (!dateMatch) continue;
      
      const date = dateMatch[1].trim();
      const papers = [];

      // 提取表格行
      // 我们创建一个临时的 DOM 元素来解析 HTML 表格字符串
      // 注意：这只在浏览器端有效
      if (typeof DOMParser !== 'undefined') {
        const parser = new DOMParser();
        // 提取 table 部分
        const tableMatch = section.match(/<table[\s\S]*?<\/table>/);
        if (tableMatch) {
          const doc = parser.parseFromString(tableMatch[0], 'text/html');
          const rows = doc.querySelectorAll('tbody tr');
          
          rows.forEach(row => {
            const cols = row.querySelectorAll('td');
            if (cols.length >= 3) {
              const titleLink = cols[0].querySelector('a');
              const abstractDetails = cols[1].querySelector('details');
              const summaryDetails = cols[2].querySelector('details');

              const link = externalUrl(titleLink?.getAttribute('href'));
              if (titleLink && link) {
                // 处理 abstract 和 summary，移除 '展开' 文本
                let abstract = abstractDetails ? abstractDetails.textContent.replace('展开', '').trim() : cols[1].textContent.trim();
                let summary = summaryDetails ? summaryDetails.textContent.replace('展开', '').trim() : cols[2].textContent.trim();

                papers.push({
                  title: titleLink.textContent.trim(),
                  link,
                  abstract: abstract,
                  summary: summary
                });
              }
            }
          });
        }
      }

      if (papers.length > 0) {
        results.push({ date, papers });
      }
    }
    return results;
  };

  const scrollToDate = (date) => {
    pendingScroll.current = date;
    setActiveDate(date);
    const index = papersByDate.findIndex(group => group.date === date);
    setVisibleDates(current => Math.max(current, index + 1));
    // An already active date does not trigger a state update.
    const existing = document.getElementById(`date-${date}`);
    if (existing) {
      pendingScroll.current = null;
      existing.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      });
    }
  };

  return (
    <Layout
      title="RAG Paper Daily"
      description="Daily curated papers on Retrieval-Augmented Generation">
      
      <div className={styles.container}>
        {/* Loading State */}
        {loading && (
          <div className={styles.loadingContainer} role="status">
            <h1>{isZh ? 'RAG 每日论文' : 'RAG Daily Papers'}</h1>
            <div className={styles.spinner}></div>
            <p>{isZh ? '正在加载精选论文...' : 'Loading the curated paper feed...'}</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className={styles.loadingContainer}>
            <h1>{isZh ? 'RAG 每日论文' : 'RAG Daily Papers'}</h1>
            <p role="alert">{isZh ? '暂时无法加载论文，请稍后重试。' : 'The paper feed is currently unavailable. Please try again.'}</p>
            <button type="button" onClick={() => setAttempt(value => value + 1)}>{isZh ? '重试' : 'Retry'}</button>
            <Link to="https://github.com/OpenBMB/UltraRAG/tree/rag-paper-daily/rag-paper-daily">{isZh ? '查看论文源列表' : 'View the source paper list'}</Link>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && (
          <>
            {/* Sidebar Navigation */}
            <aside className={styles.sidebar}>
              <div className={styles.sidebarTitle}>
                <CalendarIcon className={styles.headerIcon} /> Timeline
              </div>
              <ul className={styles.dateList}>
                {papersByDate.map((group) => (
                  <li key={group.date} className={styles.dateItem}>
                    <button
                      className={clsx(styles.dateButton, activeDate === group.date && styles.active)}
                      onClick={() => scrollToDate(group.date)}
                    >
                      {group.date}
                      <span style={{float: 'right', opacity: 0.5, fontSize: '0.8em'}}>
                        {group.papers.length}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            {/* Papers List */}
            <div className={styles.mainContent}>
              <header className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>
                  {isZh ? 'RAG 每日论文' : 'RAG Daily Papers'}
                </h1>
                <p className={styles.pageSubtitle}>
                  {isZh
                    ? '了解检索增强生成领域的最新进展。'
                    : 'Stay up to date with the latest advances in Retrieval-Augmented Generation.'}
                </p>
              </header>

              {papersByDate.slice(0, visibleDates).map((group) => (
                <section 
                  key={group.date} 
                  id={`date-${group.date}`} 
                  className={styles.dateSection}
                >
                  <div className={styles.dateHeader}>
                    <CalendarIcon className={styles.headerIcon} /> {group.date}
                  </div>
                  <div className={styles.paperGrid}>
                    {group.papers.map((paper, idx) => (
                      <PaperCard key={idx} {...paper} />
                    ))}
                  </div>
                </section>
              ))}
              {visibleDates < papersByDate.length && (
                <button type="button" className={styles.loadMore}
                  onClick={() => setVisibleDates(count => count + 7)}>
                  {isZh ? '加载更早的论文' : 'Load earlier papers'}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
