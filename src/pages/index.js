import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import { useIsZh } from '../i18n';
import styles from './index.module.css';

// --- 数据 ---

const FEATURES_EN = [
  {
    title: 'Low-Code Pipeline Orchestration',
    tag: 'Pipeline',
    desc: 'Natively supports serial, loop, and conditional branch control structures. Developers only need to write YAML configuration files to implement complex iterative RAG logic in just dozens of lines of code.',
    image: 'img/optimized/feature-pipeline-640.webp',
    link: 'https://ultrarag.openbmb.cn/pages/en/rag_client/pipeline',
  },
  {
    title: 'Modular Packaging & Extension',
    tag: 'Modular',
    desc: 'Based on MCP architecture, functions are decoupled into independent Servers. New features only need to be registered as function-level Tools to seamlessly integrate into workflows, achieving extremely high reusability.',
    image: 'img/optimized/feature-server-640.webp',
    link: 'https://ultrarag.openbmb.cn/pages/en/rag_servers/overview',
  },
  {
    title: 'Unified Evaluation & Benchmarking',
    tag: 'Benchmark',
    desc: 'Built-in standardized evaluation process with ready-to-use mainstream research Benchmarks. Through unified metric management and baseline integration, greatly improving experimental reproducibility and comparison efficiency.',
    image: 'img/optimized/feature-benchmark-640.webp',
    link: 'https://ultrarag.openbmb.cn/pages/en/develop_guide/dataset',
    extraLink: { label: 'Dataset', url: 'https://modelscope.cn/datasets/UltraRAG/UltraRAG_Benchmark' },
  },
  {
    title: 'Interactive Prototype Generation',
    tag: 'UI Generation',
    desc: 'Say goodbye to tedious UI development. With just one command, Pipeline logic can be instantly transformed into an interactive conversational Web UI, shortening the distance from algorithm to demonstration.',
    image: 'img/optimized/feature-ui-640.webp',
    link: 'https://ultrarag.openbmb.cn/pages/en/ui/start',
  },
];

const FEATURES_ZH = [
  {
    title: '低代码编排复杂流程',
    tag: 'Pipeline',
    desc: '原生支持串行、循环与条件分支等控制结构。开发者仅需编写 YAML 配置文件，即可在数十行代码内实现复杂的迭代式 RAG 逻辑。',
    image: 'img/optimized/feature-pipeline-640.webp',
    link: 'https://ultrarag.openbmb.cn/pages/cn/rag_client/pipeline',
  },
  {
    title: '模块化封装与扩展',
    tag: 'Modular',
    desc: '基于 MCP 架构将功能解耦为独立 Server。新功能仅需以函数级 Tool 形式注册，即可无缝接入流程，实现极高的复用性。',
    image: 'img/optimized/feature-server-640.webp',
    link: 'https://ultrarag.openbmb.cn/pages/cn/rag_servers/overview',
  },
  {
    title: '统一评测与基准对比',
    tag: 'Benchmark',
    desc: '内置标准化评测流程，开箱即用主流科研 Benchmark。通过统一指标管理与基线集成，大幅提升实验的可复现性与对比效率。',
    image: 'img/optimized/feature-benchmark-640.webp',
    link: 'https://ultrarag.openbmb.cn/pages/cn/develop_guide/dataset',
    extraLink: { label: '数据集', url: 'https://modelscope.cn/datasets/UltraRAG/UltraRAG_Benchmark' },
  },
  {
    title: '交互原型快速生成',
    tag: 'UI Generation',
    desc: '告别繁琐的 UI 开发。仅需一行命令，即可将 Pipeline 逻辑瞬间转化为可交互的对话式 Web UI，缩短从算法到演示的距离。',
    image: 'img/optimized/feature-ui-640.webp',
    link: 'https://ultrarag.openbmb.cn/pages/cn/ui/start',
  },
];

// --- 组件 ---

function HeroSection() {
  const isZh = useIsZh();

  return (
    <header className={styles.heroSection}>
      <div className={styles.heroContent}>
        <div className={styles.heroTextWrapper}>
          <h1 className={styles.heroTitle}>
            UltraRAG <span style={{color: '#2563eb'}}>3.0</span>
          </h1>
          <p className={styles.heroSubtitle}>
            {isZh
              ? <>拒绝"盲盒"开发，让每一行推理逻辑都看得见。<br/></>
              : <>Reject the Black Box. Make Every Step Visible.<br/></>
            }
          </p>

          <div className={styles.heroButtons}>
            {/* 按钮 1: 了解详情 -> 3.0 Blog */}
            <Link
              className={styles.btnPrimary}
              to="/blog/ultrarag-3.0-release">
              {isZh ? '了解 UltraRAG 3.0' : 'Explore UltraRAG 3.0'}
            </Link>

            {/* 按钮 2: 试玩 -> Demo */}
            <Link
              className={styles.btnSecondary}
              to="/demo">
              <span style={{marginRight: '6px'}}>▶</span> {isZh ? '试玩' : 'Try Demo'}
            </Link>

            {/* 按钮 3: 教程文档 */}
            <Link
              className={styles.btnSecondary}
              to={isZh ? "https://ultrarag.openbmb.cn/" : "https://ultrarag.openbmb.cn/pages/en/getting_started/introduction"}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '6px'}}>
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              {isZh ? '教程文档' : 'Tutorial'}
            </Link>

            {/* 按钮 4: Github */}
            <Link
              className={styles.btnSecondary}
              to="https://github.com/OpenBMB/UltraRAG">
               {/* 简单的 GitHub SVG 图标 */}
               <svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor" style={{marginRight: '8px'}}>
                 <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
               </svg>
               Github
            </Link>
          </div>
        </div>

        <div className={styles.heroImage}>
          <img
            src={useBaseUrl('img/optimized/home-800.webp')}
            srcSet={`${useBaseUrl('img/optimized/home-320.webp')} 320w, ${useBaseUrl('img/optimized/home-560.webp')} 560w, ${useBaseUrl('img/optimized/home-800.webp')} 800w`}
            sizes="(max-width: 480px) min(72vw, 280px), (max-width: 996px) 400px, 480px"
            width="800" height="800"
            fetchPriority="high"
            decoding="async"
            className={styles.heroImgElement}
            alt="UltraRAG Pipeline Architecture"
          />
        </div>
      </div>
    </header>
  );
}

function FeatureGrid() {
  const isZh = useIsZh();
  const FeaturesList = isZh ? FEATURES_ZH : FEATURES_EN;

  const [activeIndex, setActiveIndex] = React.useState(0);
  const [autoPlay, setAutoPlay] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [inView, setInView] = React.useState(false);
  const [pageVisible, setPageVisible] = React.useState(true);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const carouselRef = React.useRef(null);

  React.useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(preference.matches);
    const updateVisibility = () => setPageVisible(!document.hidden);
    updateMotion();
    updateVisibility();
    preference.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(carouselRef.current);
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', updateMotion);
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);
  const [slideDirection, setSlideDirection] = React.useState('right'); // 'left' | 'right'
  const [animKey, setAnimKey] = React.useState(0); // 用于触发重新动画

  // Advance only when explicitly enabled and the feature can be read safely.
  React.useEffect(() => {
    if (!autoPlay || hovered || focused || !inView || !pageVisible || reducedMotion) return;
    const interval = setInterval(() => {
      setSlideDirection('right');
      setAnimKey(k => k + 1);
      setActiveIndex((current) => (current + 1) % FeaturesList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [autoPlay, hovered, focused, inView, pageVisible, reducedMotion, FeaturesList.length]);

  const goTo = (idx) => {
    setSlideDirection(idx > activeIndex ? 'right' : 'left');
    setAnimKey(k => k + 1);
    setActiveIndex(idx);
  };

  const goPrev = () => {
    setSlideDirection('left');
    setAnimKey(k => k + 1);
    setActiveIndex((current) => (current - 1 + FeaturesList.length) % FeaturesList.length);
  };

  const goNext = () => {
    setSlideDirection('right');
    setAnimKey(k => k + 1);
    setActiveIndex((current) => (current + 1) % FeaturesList.length);
  };

  const currentFeature = FeaturesList[activeIndex];
  const slideClass = slideDirection === 'right' ? styles.slideInRight : styles.slideInLeft;

  return (
    <section className={styles.gridSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          {isZh ? '核心特性' : 'Core Features'}
        </h2>
        <p className={styles.sectionDesc}>
          {isZh
            ? 'UltraRAG 提供一站式 RAG 开发解决方案，助力研究者和开发者高效完成从数据治理、流程编排到系统演示的开发闭环。'
            : 'UltraRAG is an all-in-one RAG solution, streamlining the journey from data governance and orchestration to full-scale system demonstration.'}
        </p>
      </div>

      <div
        className={styles.carouselContainer}
        ref={carouselRef}
        role="region"
        aria-roledescription={isZh ? '轮播' : 'carousel'}
        aria-label={isZh ? '核心特性' : 'Core features'}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={event => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
        }}
      >
        {/* 大卡片区域 */}
        <div className={styles.carouselCard}>
          <div className={styles.carouselImageWrapper}>
            <img
              key={`img-${animKey}`}
              src={useBaseUrl(currentFeature.image)}
              className={clsx(styles.carouselImage, slideClass)}
              alt={currentFeature.title}
              srcSet={`${useBaseUrl(currentFeature.image.replace('-640.webp', '-400.webp'))} 400w, ${useBaseUrl(currentFeature.image)} 640w`}
              sizes="(max-width: 480px) 200px, (max-width: 996px) 300px, 480px"
              width="640" height="640"
              loading="lazy" decoding="async"
            />
          </div>
          <div key={`content-${animKey}`} className={clsx(styles.carouselContent, styles.fadeSlideIn)}>
            <div className={styles.carouselTag}>{currentFeature.tag}</div>
            <h3 className={styles.carouselTitle}>{currentFeature.title}</h3>
            <p className={styles.carouselDesc}>{currentFeature.desc}</p>
            <div className={styles.carouselActions}>
              <Link className={styles.btnFeature} to={currentFeature.link}>
                {isZh ? '查看功能文档' : 'Read feature documentation'}
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
              {currentFeature.extraLink && (
                <Link className={styles.btnFeatureOutline} to={currentFeature.extraLink.url}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                  {currentFeature.extraLink.label}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* 左箭头 */}
        <button
          className={clsx(styles.carouselArrow, styles.arrowLeft)}
          onClick={goPrev}
          aria-label={isZh ? '上一个' : 'Previous'}
        />

        {/* 右箭头 */}
        <button
          className={clsx(styles.carouselArrow, styles.arrowRight)}
          onClick={goNext}
          aria-label={isZh ? '下一个' : 'Next'}
        />

        {/* 指示点 */}
        <div className={styles.carouselDots}>
          {FeaturesList.map((_, idx) => (
            <button
              type="button"
              aria-label={`${isZh ? '显示功能' : 'Show feature'} ${idx + 1}: ${FeaturesList[idx].title}`}
              aria-pressed={idx === activeIndex}
              key={idx}
              className={clsx(styles.dot, idx === activeIndex && styles.active)}
              onClick={() => goTo(idx)}
            />
          ))}
        </div>
        <button type="button" className={styles.rotationControl}
          aria-pressed={autoPlay} disabled={reducedMotion}
          onClick={() => { setAutoPlay(value => !value); setFocused(false); }}>
          {autoPlay ? (isZh ? '暂停自动播放' : 'Pause autoplay') : (isZh ? '自动播放' : 'Play slideshow')}
        </button>
      </div>
    </section>
  );
}

function QuickStartSection() {
  const isZh = useIsZh();

  return (
    <section className={styles.quickStartSection}>
      {/* Part 1: Quick Start Code */}
      <div className={styles.quickStartContainer}>
        <div className={styles.quickStartCode}>
          <CodeBlock language="shell">
{isZh
  ? `# 安装依赖
pip install uv
git clone https://github.com/OpenBMB/UltraRAG.git
cd UltraRAG
uv sync

# 运行 Pipeline
uv run ultrarag build examples/experiments/sayhello.yaml --no-mcp
uv run ultrarag run examples/experiments/sayhello.yaml --no-mcp

# 启动 UI
uv run ultrarag show ui --no-mcp`
  : `# Install dependencies
pip install uv
git clone https://github.com/OpenBMB/UltraRAG.git
cd UltraRAG
uv sync

# Run Pipeline
uv run ultrarag build examples/experiments/sayhello.yaml --no-mcp
uv run ultrarag run examples/experiments/sayhello.yaml --no-mcp

# Start UI
uv run ultrarag show ui --no-mcp`}
          </CodeBlock>
        </div>
        <div className={styles.quickStartContent}>
          <h2 className={styles.quickStartTitle}>
            {isZh ? '快速开始' : 'Quick Start'}
          </h2>
          <p className={styles.quickStartDesc}>
            {isZh
              ? '快速了解如何基于 UltraRAG 运行一个完整的 RAG 实验。'
              : 'Quickly learn how to run a complete RAG experiment based on UltraRAG.'}
          </p>
          <Link
            className={styles.btnPrimary}
            to={isZh
              ? "https://ultrarag.openbmb.cn/pages/cn/getting_started/quick_start"
              : "https://ultrarag.openbmb.cn/pages/en/getting_started/quick_start"
            }>
            {isZh ? '即刻上手' : 'Get Started'}
          </Link>
        </div>
      </div>

      {/* Part 2: UI Showcase */}
      <div className={styles.quickStartContainer} style={{marginTop: '100px'}}>
        <div className={styles.quickStartContent}>
          <h2 className={styles.quickStartTitle}>
            {isZh ? '可视化交互界面' : 'Visual Interactive Interface'}
          </h2>
          <p className={styles.quickStartDesc}>
            {isZh
              ? '探索如何通过可视化界面，轻松完成知识库管理、RAG 流程搭建及系统演示。'
              : 'Explore how to easily manage knowledge bases, build RAG workflows, and create system demonstrations through the visual interface.'}
          </p>
          <Link
            className={styles.btnSecondary}
            to={isZh
              ? "https://ultrarag.openbmb.cn/pages/cn/ui/start"
              : "https://ultrarag.openbmb.cn/pages/en/ui/start"
            }>
            {isZh ? '查看详解' : 'View Details'}
          </Link>
        </div>
        <div className={styles.quickStartImageWrapper}>
          <img
            src={useBaseUrl('img/optimized/ui-1280.webp')}
            srcSet={`${useBaseUrl('img/optimized/ui-640.webp')} 640w, ${useBaseUrl('img/optimized/ui-800.webp')} 800w, ${useBaseUrl('img/optimized/ui-1280.webp')} 1280w`}
            sizes="(max-width: 996px) calc(100vw - 32px), 600px"
            width="2782" height="2008"
            loading="lazy" decoding="async"
            className={styles.quickStartImage}
            alt="UltraRAG UI"
          />
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Layout
      title={`UltraRAG 3.0`}
      description="The Modular and High-Precision RAG Framework">

      <main>
        <HeroSection />
        <FeatureGrid />
        <QuickStartSection />
      </main>
    </Layout>
  );
}
