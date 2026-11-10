import useBrokenLinks from '@docusaurus/useBrokenLinks';
import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import { useIsZh } from '../i18n';
import styles from './research.module.css';

// --- 博客数据 ---
const BLOGS_EN = [
  {
    title: 'UltraRAG 3.0: No More Black Boxes, Full Transparency in Reasoning',
    summary: 'Addressing the pain point of "algorithm prototyping takes a week, but building a usable system takes months", UltraRAG 3.0 brings three core upgrades: full-chain visible reasoning, modular MCP architecture, and unified evaluation system.',
    date: '2026.01.23',
    authors: 'Sen Mei, Haidong Xin',
    tags: ['Release', 'UltraRAG'],
    to: '/blog/ultrarag-3.0-release',
  },
  {
    title: 'UltraRAG 2.1: Deep Knowledge Integration, Cross-Modal Support',
    summary: 'Comprehensive upgrades focused on native multimodal support, automated knowledge integration and corpus construction, and unified RAG workflows for building and evaluation.',
    date: '2025.11.11',
    authors: 'Sen Mei, Haidong Xin',
    tags: ['Release', 'UltraRAG'],
    to: '/blog/ultrarag-2.1-release',
  },
  {
    title: 'UltraRAG 2.0: Minimal Code, Maximum Innovation',
    summary: 'The first RAG framework designed with Model Context Protocol (MCP) architecture, enabling researchers to implement multi-stage reasoning systems with just YAML files.',
    date: '2025.08.28',
    authors: 'Sen Mei, Haidong Xin, Chunyi Peng',
    tags: ['Release', 'UltraRAG'],
    to: '/blog/ultrarag-2.0-release',
  },
];

const BLOGS_ZH = [
  {
    title: 'UltraRAG 3.0：告别黑盒，推理逻辑全透明',
    summary: '针对"验证算法原型只需一周，构建可用系统却耗时数月"的痛点，UltraRAG 3.0 带来了全链路可视化推理、模块化 MCP 架构与统一评测体系三大核心升级。',
    date: '2026.01.23',
    authors: 'Sen Mei, Haidong Xin',
    tags: ['Release', 'UltraRAG'],
    to: '/blog/ultrarag-3.0-release',
  },
  {
    title: 'UltraRAG 2.1：纵深知识接入，横跨多模态支持',
    summary: '围绕原生多模态支持、知识接入与语料构建自动化、统一构建与评估的 RAG 工作流三大方向，进行了面向实际研究需求的全面升级。',
    date: '2025.11.11',
    authors: 'Sen Mei, Haidong Xin',
    tags: ['Release', 'UltraRAG'],
    to: '/blog/ultrarag-2.1-release',
  },
  {
    title: 'UltraRAG 2.0：代码极简化，创新最大化',
    summary: '首个基于 Model Context Protocol (MCP) 架构设计的 RAG 框架，让科研人员只需编写 YAML 文件即可实现多阶段推理系统。',
    date: '2025.08.28',
    authors: 'Sen Mei, Haidong Xin, Chunyi Peng',
    tags: ['Release', 'UltraRAG'],
    to: '/blog/ultrarag-2.0-release',
  },
];

// --- 模型数据 ---
const MODELS_EN = [
  {
    name: 'AgentCPM-Report',
    desc: 'An intelligent Agent model for long document generation and report writing, enabling automated research report generation.',
    tags: ['Agent', 'Long-Text Generation', 'DeepResearch'],
    href: 'https://huggingface.co/openbmb/AgentCPM-Report',
  },
  {
    name: 'MiniCPM-Embedding-Light',
    desc: 'A lightweight and efficient text embedding model, achieving leading performance on multiple retrieval benchmarks, suitable for large-scale semantic retrieval in RAG scenarios.',
    tags: ['Embedding', 'Retrieval'],
    href: 'https://huggingface.co/openbmb/MiniCPM-Embedding-Light',
  },
];

const MODELS_ZH = [
  {
    name: 'AgentCPM-Report',
    desc: '面向长文档生成与报告撰写的智能 Agent 模型，助力自动化研究报告生成。',
    tags: ['Agent', 'Long-Text Generation', 'DeepResearch'],
    href: 'https://huggingface.co/openbmb/AgentCPM-Report',
  },
  {
    name: 'MiniCPM-Embedding-Light',
    desc: '轻量高效的文本向量模型，在多项检索基准上取得领先表现，适配 RAG 场景下的大规模语义检索需求。',
    tags: ['Embedding', 'Retrieval'],
    href: 'https://huggingface.co/openbmb/MiniCPM-Embedding-Light',
  },
];

// --- 精选论文数据 ---
const PAPERS_EN = [
  {
    title: 'VisRAG: Vision-based Retrieval-Augmented Generation on Multi-modality Documents',
    authors: 'Shi Yu, Chaoyue Tang, et al.',
    date: '2025.04',
    venue: 'ICLR 2025',
    abstract: 'Proposes a "vision-first" retrieval-augmented generation paradigm that fundamentally solves the information degradation problem of complex layout documents in traditional text parsing by converting documents directly into visual vectors for matching and generation.',
    href: 'https://arxiv.org/pdf/2410.10594',
  },
  {
    title: 'RAG-DDR: Optimizing Retrieval-Augmented Generation Using Differentiable Data Rewards',
    authors: 'Xinze Li, Sen Mei, et al.',
    date: '2025.04',
    venue: 'ICLR 2025',
    abstract: 'Proposes a new RAG optimization paradigm based on "differentiable data rewards", significantly improving the model\'s ability to extract core information from external knowledge and resolve knowledge conflicts through end-to-end reward alignment between retriever and generator.',
    href: 'https://arxiv.org/pdf/2410.13509',
  },
  {
    title: 'RAGEval: Scenario Specific RAG Evaluation Dataset Generation Framework',
    authors: 'Kunlun Zhu, Yifan Luo, et al.',
    date: '2025.07',
    venue: 'ACL 2025',
    abstract: 'Proposes a new paradigm for automated RAG evaluation benchmark construction, enabling efficient customization of evaluation datasets for specific vertical scenarios (such as finance, law, healthcare) through Schema-based knowledge distillation and document generation.',
    href: 'https://aclanthology.org/2025.acl-long.418.pdf',
  },
  {
    title: 'DeepNote: Note-Centric Deep Retrieval-Augmented Generation',
    authors: 'Ruobing Wang, et al.',
    date: '2025.11',
    venue: 'EMNLP 2025',
    abstract: 'Proposes a "note-centric" adaptive retrieval-augmented generation paradigm that significantly improves the model\'s depth and robustness in handling complex open-domain QA tasks by introducing an iterative knowledge accumulation mechanism.',
    href: 'https://arxiv.org/pdf/2410.08821',
  },
];

const PAPERS_ZH = [
  {
    title: 'VisRAG: Vision-based Retrieval-Augmented Generation on Multi-modality Documents',
    authors: 'Shi Yu, Chaoyue Tang, et al.',
    date: '2025.04',
    venue: 'ICLR 2025',
    abstract: '提出了一种"视觉优先"的检索增强生成新范式，通过将文档直接转化为视觉向量进行匹配与生成，从根本上解决了复杂排版文档在传统文本解析中的信息降级问题。',
    href: 'https://arxiv.org/pdf/2410.10594',
  },
  {
    title: 'RAG-DDR: Optimizing Retrieval-Augmented Generation Using Differentiable Data Rewards',
    authors: 'Xinze Li, Sen Mei, et al.',
    date: '2025.04',
    venue: 'ICLR 2025',
    abstract: '提出了一种基于"可微分数据奖励"的 RAG 优化新范式，通过在检索器与生成器之间建立端到端的奖励对齐机制，显著提升了模型从外部知识中提取核心信息并解决知识冲突的能力。',
    href: 'https://arxiv.org/pdf/2410.13509',
  },
  {
    title: 'RAGEval: Scenario Specific RAG Evaluation Dataset Generation Framework',
    authors: 'Kunlun Zhu, Yifan Luo, et al.',
    date: '2025.07',
    venue: 'ACL 2025',
    abstract: '提出了一种自动化的检索增强生成评价基准构建新范式，通过基于 Schema 的知识蒸馏与文档生成技术，实现了针对特定垂直场景（如金融、法律、医疗）评价数据集的高效定制。',
    href: 'https://aclanthology.org/2025.acl-long.418.pdf',
  },
  {
    title: 'DeepNote: Note-Centric Deep Retrieval-Augmented Generation',
    authors: 'Ruobing Wang, et al.',
    date: '2025.11',
    venue: 'EMNLP 2025',
    abstract: '提出了一种以"笔记"为核心的自适应检索增强生成新范式，通过在检索过程中引入迭代式知识积累机制，显著提升了模型处理复杂开放域问答任务的深度与鲁棒性。',
    href: 'https://arxiv.org/pdf/2410.08821',
  },
];

// --- 组件 ---

function ResearchHero() {
  const isZh = useIsZh();
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>{isZh ? '研究' : 'Research'}</h1>
        <p className={styles.heroSubtitle}>
          {isZh ? '了解我们的最新研究成果' : 'Discover our latest research'}
        </p>
      </div>
    </section>
  );
}

function BlogSection() {
  const isZh = useIsZh();
  const BlogsList = isZh ? BLOGS_ZH : BLOGS_EN;

  return (
    <section id="blog" className={styles.blogSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeaderRow}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{isZh ? '博客' : 'Blog'}</h2>
            <p className={styles.sectionDesc}>
              {isZh
                ? '跟踪 UltraRAG 开源进展与技术更新。'
                : 'Follow UltraRAG open-source progress and technical updates.'}
            </p>
          </div>
          <Link className={styles.viewAllLink} to="/blog">
            {isZh ? '查看全部' : 'View All'} <span>→</span>
          </Link>
        </div>

        {/* 第一篇大卡片 */}
        <Link to={BlogsList[0].to} className={styles.blogFeatured}>
          <div className={styles.blogFeaturedTag}>{BlogsList[0].tags[0]}</div>
          <h3 className={styles.blogFeaturedTitle}>{BlogsList[0].title}</h3>
          <p className={styles.blogFeaturedSummary}>{BlogsList[0].summary}</p>
          <div className={styles.blogFeaturedMeta}>
            <span>{BlogsList[0].date}</span>
            <span className={styles.blogMetaDivider}>·</span>
            <span>{BlogsList[0].authors}</span>
          </div>
        </Link>

        {/* 其余卡片网格 */}
        <div className={styles.blogGrid}>
          {BlogsList.slice(1).map((blog, idx) => (
            <Link key={idx} to={blog.to} className={styles.blogCard}>
              <div className={styles.blogCardTag}>{blog.tags[0]}</div>
              <h3 className={styles.blogCardTitle}>{blog.title}</h3>
              <p className={styles.blogCardSummary}>{blog.summary}</p>
              <div className={styles.blogCardMeta}>
                <span>{blog.date}</span>
                <span className={styles.blogMetaDivider}>·</span>
                <span>{blog.authors}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ModelsSection() {
  const isZh = useIsZh();
  const ModelsList = isZh ? MODELS_ZH : MODELS_EN;

  return (
    <section className={styles.modelsSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{isZh ? '模型' : 'Models'}</h2>
          <p className={styles.sectionDesc}>
            {isZh
              ? '我们开源的核心模型，为 RAG 生态提供基础能力支撑。'
              : 'Our open-source core models, providing foundational capabilities for the RAG ecosystem.'}
          </p>
        </div>
        <div className={styles.modelsGrid}>
          {ModelsList.map((model, idx) => (
            <a
              key={idx}
              href={model.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.modelCard}
            >
              <div className={styles.modelCardInner}>
                <h3 className={styles.modelName}>{model.name}</h3>
                <p className={styles.modelDesc}>{model.desc}</p>
                <div className={styles.modelTags}>
                  {model.tags.map((tag, tIdx) => (
                    <span key={tIdx} className={styles.modelTag}>{tag}</span>
                  ))}
                </div>
                <div className={styles.modelLink}>
                  {isZh ? '查看模型' : 'View Model'} <span className={styles.modelArrow}>→</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function PapersSection() {
  useBrokenLinks().collectAnchor('papers');
  const isZh = useIsZh();
  const PapersList = isZh ? PAPERS_ZH : PAPERS_EN;

  return (
    <section id="papers" className={styles.papersSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            {isZh ? '精选论文' : 'Selected Papers'}
          </h2>
          <p className={styles.sectionDesc}>
            {isZh
              ? '我们团队在 RAG 领域的代表性研究工作。'
              : 'Representative research work from our team in the RAG domain.'}
          </p>
        </div>
        <div className={styles.papersList}>
          {PapersList.map((paper, idx) => (
            <a
              key={idx}
              href={paper.href}
              target={paper.href.startsWith('http') ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className={styles.paperCard}
            >
              <div className={styles.paperMeta}>
                <span className={styles.paperDate}>{paper.date}</span>
                <span className={styles.paperVenue}>{paper.venue}</span>
              </div>
              <h3 className={styles.paperTitle}>{paper.title}</h3>
              <p className={styles.paperAuthors}>{paper.authors}</p>
              <p className={styles.paperAbstract}>{paper.abstract}</p>
              <div className={styles.paperLinkText}>
                {isZh ? '阅读更多' : 'Read More'} <span className={styles.paperArrow}>→</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Research() {
  const isZh = useIsZh();
  return (
    <Layout
      title={isZh ? '研究' : 'Research'}
      description="UltraRAG Research - Models and Papers"
    >
      <main>
        <ResearchHero />
        <BlogSection />
        <ModelsSection />
        <PapersSection />
      </main>
    </Layout>
  );
}
