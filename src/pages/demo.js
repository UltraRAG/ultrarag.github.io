import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from '@docusaurus/Head';
import {externalUrl} from '../utils/externalUrl.mjs';
import {startDemoStream} from '../utils/demoStream.mjs';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { Highlight, themes } from 'prism-react-renderer';
import { useIsZh } from '../i18n';
import styles from './demo.module.css';

// --- Mock Data ---
const DEMO_PIPELINES = [
  { name: 'LLM', id: 'llm' },
  { name: 'RAG', id: 'rag' },
  { name: 'LightResearch', id: 'lightresearch' },
  { name: 'AgentCPM-Report', id: 'agentcpm-report' },
];

const INITIAL_SESSIONS = {
  en: [
    { id: 1, title: 'UltraRAG Introduction' },
    { id: 2, title: 'UltraRAG Architecture' },
  ],
  zh: [
    { id: 1, title: 'UltraRAG 项目简介' },
    { id: 2, title: 'UltraRAG 架构详解' },
  ],
};

// Pre-filled demo conversations per session
const DEMO_CONVERSATIONS = {
  en: {
    1: [
      {
        role: 'user',
        content: 'What is UltraRAG?',
      },
      {
        role: 'assistant',
        steps: [
          { name: 'Query Analysis', detail: 'Parse user question and extract key intent' },
          { name: 'Dense Retrieval', detail: 'Retrieve project documentation from knowledge base' },
          { name: 'Response Generation', detail: 'Generate answer based on retrieved results' },
        ],
        content: `### About UltraRAG

UltraRAG is the first lightweight RAG development framework designed with **Model Context Protocol (MCP)** architecture, built specifically for scientific research exploration and industrial prototype design.

It standardizes core RAG components (such as Retriever, Generation, etc.) as independent **MCP Servers**, enabling flexible extension through function-level Tool interfaces. Combined with the MCP Client's workflow orchestration capabilities, developers can precisely orchestrate complex control structures (such as conditionals, loops) through YAML configuration. Additionally, the system supports seamless migration of algorithm logic to conversational demonstration interfaces, greatly optimizing the full development chain efficiency of complex RAG systems.

### Core Architecture

UltraRAG consists of four key components:

- **Pipeline · Workflow Definition**: Task logic written by users through YAML, defining the execution order and business logic of each component, achieving configuration-based reasoning workflows
- **Client · Scheduling Hub**: Responsible for parsing Pipeline configurations, uniformly coordinating tool invocations and data transfer between Servers, ensuring precise workflow execution
- **Server · Function Execution**: Standardizes core functions as independent services, supporting rapid extension and flexible combination of new modules through simple interfaces
- **UI · Interactive Demonstration**: Transforms YAML-defined logic into intuitive conversational interfaces with one click, significantly improving debugging efficiency and demonstration effects

> The system supports seamless migration of algorithm logic to conversational demonstration interfaces, greatly optimizing the full development chain efficiency of complex RAG systems.`,
        sources: [
          { id: 1, title: 'UltraRAG Introduction', used: true },
          { id: 2, title: 'MCP Architecture Design', used: true },
          { id: 3, title: 'Getting Started Guide', used: true },
        ],
      },
      {
        role: 'user',
        content: 'Why choose UltraRAG?',
      },
      {
        role: 'assistant',
        steps: [
          { name: 'Intent Recognition', detail: 'Identify user comparison needs' },
          { name: 'Doc Retrieval', detail: 'Retrieve Why UltraRAG documentation' },
          { name: 'Answer Synthesis', detail: 'Compile core advantages' },
        ],
        content: `RAG systems are undergoing a paradigm evolution from static chain concatenation to autonomous reasoning, increasingly relying on active model reasoning, dynamic retrieval, and conditional decision-making. However, traditional frameworks often face bottlenecks of insufficient flexibility and deep module coupling.

UltraRAG aims to provide developers with a **standardized, decoupled, and minimalist** new development paradigm:

### 🚀 Low-Code Pipeline Orchestration
Natively supports serial, loop, and conditional branch control structures. Developers only need to write YAML configuration files to implement complex iterative RAG logic in just dozens of lines of code.

### ⚡ Modular Extension & Packaging
Based on MCP architecture, functions are decoupled into independent Servers. New features only need to be registered as function-level Tools to seamlessly integrate into workflows, achieving extremely high reusability.

### 📊 Unified Evaluation & Benchmarking
Built-in standardized evaluation process with ready-to-use mainstream research Benchmarks. Through unified metric management and baseline integration, greatly improving experimental reproducibility and comparison efficiency.

### ✨ Interactive Prototype Generation
Say goodbye to tedious UI development. With just one command, Pipeline logic can be instantly transformed into an interactive conversational Web UI, shortening the distance from algorithm to demonstration.`,
        sources: [
          { id: 1, title: 'Why UltraRAG - Introduction', used: true },
          { id: 2, title: 'UltraRAG vs Traditional Frameworks', used: true },
          { id: 3, title: 'MCP Architecture Advantages', used: false },
        ],
      },
    ],
    2: [
      {
        role: 'user',
        content: 'How is UltraRAG\'s MCP architecture designed?',
      },
      {
        role: 'assistant',
        steps: [
          { name: 'Query Understanding', detail: 'Identify user interest in architecture' },
          { name: 'Knowledge Retrieval', detail: 'Retrieve MCP architecture design docs' },
        ],
        content: `UltraRAG is designed based on the **Model Context Protocol (MCP)** architecture, decomposing the core capabilities of RAG systems into standardized service units:

### MCP Server — Atomic Capability Carrier
Each MCP Server encapsulates an independent function, such as document retrieval, vector indexing, text generation, etc. New features only need to be registered as function-level **Tools** in the Server to seamlessly integrate into the entire workflow:

\`\`\`python
@app.tool(output="query,top_k->doc_list")
def dense_retrieve(query: str, top_k: int = 5):
    """Retrieve the most relevant document fragments from the vector database"""
    ret = retriever.search(query, top_k=top_k)
    return {"doc_list": ret}
\`\`\`

### MCP Client — Intelligent Scheduling Hub
The Client is responsible for parsing Pipeline configuration files, uniformly coordinating tool invocations and data transfer between Servers. It supports:
- **Serial Execution**: Invoke steps sequentially in order
- **Conditional Branching**: Dynamically select paths based on intermediate results
- **Loop Iteration**: Support multi-round retrieval-reasoning self-correction

A typical RAG Pipeline configuration:

\`\`\`yaml examples/rag_full.yaml
# MCP Server
servers:
  benchmark: servers/benchmark
  retriever: servers/retriever
  prompt: servers/prompt
  generation: servers/generation
  evaluation: servers/evaluation
  custom: servers/custom

# MCP Client Pipeline
pipeline:
- benchmark.get_data
- retriever.retriever_init
- retriever.retriever_embed
- retriever.retriever_index
- retriever.retriever_search
- generation.generation_init
- prompt.qa_rag_boxed
- generation.generate
- custom.output_extract_from_boxed
- evaluation.evaluate
\`\`\`

### Core Advantages
- **Decoupling**: Servers are completely independent, can be developed, tested, and deployed separately
- **Extensibility**: Zero-intrusion for new modules, registration of a Tool completes integration
- **Reproducibility**: Same Pipeline YAML + Server configuration = exactly the same execution results

> MCP architecture makes every step of the RAG system transparent, controllable, and reproducible.`,
        sources: [
          { id: 1, title: 'MCP Architecture Design', used: true },
          { id: 2, title: 'Server Development Guide', used: true },
        ],
      },
    ],
  },
  zh: {
    1: [
      {
        role: 'user',
        content: '请介绍一下 UltraRAG 是什么？',
      },
      {
        role: 'assistant',
        steps: [
          { name: 'Query Analysis', detail: '解析用户问题，提取关键意图' },
          { name: 'Dense Retrieval', detail: '从知识库中检索项目文档' },
          { name: 'Response Generation', detail: '基于检索结果生成回答' },
        ],
        content: `### 关于 UltraRAG

      UltraRAG 是首个基于 **Model Context Protocol (MCP)** 架构设计的轻量级 RAG 开发框架，专为科研探索与工业原型设计打造。

它将 RAG 中的核心组件（如 Retriever、Generation 等）标准化封装为独立的 **MCP Server**，实现了基于函数级 Tool 接口的灵活扩展。配合 MCP Client 的流程调度能力，开发者能够通过 YAML 配置实现对复杂控制结构（如条件、循环等）的精确编排。此外，系统支持算法逻辑向对话演示界面的无缝迁移，极大地优化了复杂 RAG 系统的开发全链路效率。

### 核心架构

UltraRAG 由四个关键组件构成：

- **Pipeline · 流程定义**：用户通过 YAML 编写的任务逻辑，定义了各组件的执行顺序与业务逻辑，实现推理流程的配置化
- **Client · 调度中枢**：负责解析 Pipeline 配置，统一协调各 Server 间工具的调用与数据传递，确保流程精准执行
- **Server · 功能执行**：将核心功能标准化封装为独立服务，支持通过简单接口实现新模块的快速扩展与灵活组合
- **UI · 交互演示**：将 YAML 定义的逻辑一键转化为直观的对话界面，显著提升系统的调试效率与演示效果

> 系统支持算法逻辑向对话演示界面的无缝迁移，极大地优化了复杂 RAG 系统的开发全链路效率。`,
        sources: [
          { id: 1, title: 'UltraRAG 项目简介', used: true },
          { id: 2, title: 'MCP 架构设计文档', used: true },
          { id: 3, title: 'Getting Started Guide', used: true },
        ],
      },
      {
        role: 'user',
        content: '为什么要选择 UltraRAG？',
      },
      {
        role: 'assistant',
        steps: [
          { name: 'Intent Recognition', detail: '识别用户对比需求' },
          { name: 'Doc Retrieval', detail: '检索 Why UltraRAG 文档' },
          { name: 'Answer Synthesis', detail: '整合核心优势说明' },
        ],
        content: `RAG 系统正经历从静态链式串联向自主推理体系的范式演进，愈发依赖模型的主动推理、动态检索与条件决策。然而传统框架往往面临灵活性不足、模块深度耦合等瓶颈。

UltraRAG 旨在为开发者提供一套**标准化、解耦且极简**的开发新范式：

### 🚀 低代码编排复杂流程
原生支持串行、循环与条件分支等控制结构。开发者仅需编写 YAML 配置文件，即可在数十行代码内实现复杂的迭代式 RAG 逻辑。

### ⚡ 模块化扩展与复现
基于 MCP 架构将功能解耦为独立 Server。新功能仅需以函数级 Tool 形式注册，即可无缝接入流程，实现极高的复用性。

### 📊 统一评测与基准对比
内置标准化评测流程，开箱即用主流科研 Benchmark。通过统一指标管理与基线集成，大幅提升实验的可复现性与对比效率。

### ✨ 交互原型快速生成
告别繁琐的 UI 开发。仅需一行命令，即可将 Pipeline 逻辑瞬间转化为可交互的对话式 Web UI，缩短从算法到演示的距离。`,
        sources: [
          { id: 1, title: 'Why UltraRAG - 项目简介', used: true },
          { id: 2, title: 'UltraRAG vs 传统框架对比', used: true },
          { id: 3, title: 'MCP 架构优势分析', used: false },
        ],
      },
    ],
    2: [
      {
        role: 'user',
        content: 'UltraRAG 的 MCP 架构是怎么设计的？',
      },
      {
        role: 'assistant',
        steps: [
          { name: 'Query Understanding', detail: '识别用户对架构的兴趣' },
          { name: 'Knowledge Retrieval', detail: '检索 MCP 架构设计文档' },
        ],
        content: `UltraRAG 基于 **Model Context Protocol (MCP)** 架构设计，将 RAG 系统的核心能力拆解为标准化的服务单元：

### MCP Server — 原子化能力载体
每个 MCP Server 封装一项独立功能，如文档检索、向量索引、文本生成等。新功能只需以函数级 **Tool** 形式注册到 Server 中，即可无缝接入整个流程：

\`\`\`python
@app.tool(output="query,top_k->doc_list")
def dense_retrieve(query: str, top_k: int = 5):
    """从向量数据库中检索最相关的文档片段"""
    ret = retriever.search(query, top_k=top_k)
    return {"doc_list": ret}
\`\`\`

### MCP Client — 智能调度中枢
Client 负责解析 Pipeline 配置文件，统一协调各 Server 间工具的调用与数据传递。它支持：
- **串行执行**：按顺序依次调用各步骤
- **条件分支**：根据中间结果动态选择路径
- **循环迭代**：支持多轮检索-推理的自我修正

一个典型的 RAG Pipeline 配置：

\`\`\`yaml examples/rag_full.yaml
# MCP Server
servers:
  benchmark: servers/benchmark
  retriever: servers/retriever
  prompt: servers/prompt
  generation: servers/generation
  evaluation: servers/evaluation
  custom: servers/custom

# MCP Client Pipeline
pipeline:
- benchmark.get_data
- retriever.retriever_init
- retriever.retriever_embed
- retriever.retriever_index
- retriever.retriever_search
- generation.generation_init
- prompt.qa_rag_boxed
- generation.generate
- custom.output_extract_from_boxed
- evaluation.evaluate
\`\`\`

### 核心优势
- **解耦性**：Server 之间完全独立，可单独开发、测试和部署
- **可扩展性**：新增模块零侵入，注册 Tool 即完成集成
- **可复现性**：相同 Pipeline YAML + Server 配置 = 完全相同的执行结果

> MCP 架构让 RAG 系统的每一个环节都变得透明、可控且可复现。`,
        sources: [
          { id: 1, title: 'MCP 架构设计文档', used: true },
          { id: 2, title: 'Server 开发指南', used: true },
        ],
      },
    ],
  },
};

// Canned responses for demo
const CANNED_RESPONSES = {
  en: [
    {
      steps: [
        { name: 'Query Analysis', detail: 'Analyze user question' },
        { name: 'Dense Retrieval', detail: 'Retrieve relevant documents from knowledge base' },
        { name: 'Response Generation', detail: 'Generate answer based on retrieved results' },
      ],
      content: `Thank you for your question! This is a Demo environment showcasing UltraRAG's conversational interface.

UltraRAG is the first lightweight RAG development framework based on **MCP (Model Context Protocol)** architecture. In actual deployment, the system will:
- Retrieve relevant document fragments from your knowledge base through **MCP Server**
- Coordinate multi-step reasoning workflows orchestrated by Pipeline through **MCP Client**
- Generate high-quality, **traceable** answers based on retrieved facts

> To experience full functionality, please visit the [Deployment Guide](https://ultrarag.openbmb.cn/pages/en/ui/prepare) for local deployment instructions.`,
      sources: [
        { id: 1, title: 'UltraRAG Introduction', used: true },
        { id: 2, title: 'Deployment Guide', used: true },
      ],
    },
  ],
  zh: [
    {
      steps: [
        { name: 'Query Analysis', detail: '分析用户问题' },
        { name: 'Dense Retrieval', detail: '从知识库中检索相关文档' },
        { name: 'Response Generation', detail: '基于检索结果生成回答' },
      ],
      content: `感谢您的提问！这是一个 Demo 演示环境，展示了 UltraRAG 的对话交互界面。

UltraRAG 是首个基于 **MCP（Model Context Protocol）** 架构的轻量级 RAG 开发框架。在实际部署中，系统会：
- 通过 **MCP Server** 从您的知识库中检索相关文档片段
- 由 **MCP Client** 协调 Pipeline 编排的多步推理流程
- 基于检索到的事实生成高质量、**可溯源**的回答

> 如需体验完整功能，请访问 [部署指南](https://ultrarag.openbmb.cn/pages/cn/ui/prepare) 了解本地部署方式。`,
      sources: [
        { id: 1, title: 'UltraRAG 项目简介', used: true },
        { id: 2, title: '部署指南', used: true },
      ],
    },
  ],
};

const SUGGESTION_CHIPS = {
  en: [
    { icon: '🚀', text: 'What is UltraRAG?', sub: 'Learn about the MCP-based RAG framework' },
    { icon: '⚡', text: 'Why choose UltraRAG?', sub: 'Low-code orchestration, modular extension, unified evaluation' },
    { icon: '🔧', text: 'How to orchestrate Pipelines?', sub: 'Implement complex RAG logic with YAML' },
    { icon: '💡', text: 'How is MCP architecture designed?', sub: 'Server decoupling & Client scheduling' },
  ],
  zh: [
    { icon: '🚀', text: 'UltraRAG 是什么？', sub: '了解基于 MCP 架构的 RAG 框架' },
    { icon: '⚡', text: '为什么选择 UltraRAG？', sub: '低代码编排、模块化扩展、统一评测' },
    { icon: '🔧', text: 'Pipeline 怎么编排？', sub: 'YAML 配置实现复杂 RAG 逻辑' },
    { icon: '💡', text: 'MCP 架构如何设计？', sub: 'Server 解耦与 Client 调度' },
  ],
};

// --- UI Strings ---
const UI = {
  en: {
    newChat: 'New Chat',
    knowledgeBase: 'Knowledge Base',
    recentChats: 'RECENT',
    backToHome: 'Back to Home',
    thinkingProcess: 'Thinking Process',
    copy: 'Copy',
    collapse: 'Collapse',
    expand: 'Expand',
    unreferencedDocs: 'unreferenced documents',
    askUltraRAG: 'Ask UltraRAG',
    exploreToday: 'What shall we explore today?',
    toastNewChat: 'New chat created',
    toastSwitchPipeline: 'Switched to',
    toastKnowledgeBase: 'Knowledge base management is available after local deployment',
    toastKnowledgeSwitch: 'Knowledge base switching is available after local deployment',
    newChatTitle: 'New Chat',
    demoNotice: 'Interactive preview · Replies are pre-recorded samples.',
    send: 'Send message',
    conversation: 'Conversation',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    copied: 'Copied',
    copyFailed: 'Copy failed',
  },
  zh: {
    newChat: '新建对话',
    knowledgeBase: '知识库',
    recentChats: '最近对话',
    backToHome: '返回官网',
    thinkingProcess: '思考过程',
    copy: '复制',
    collapse: '收起',
    expand: '展开',
    unreferencedDocs: '个未引用文档',
    askUltraRAG: '向 UltraRAG 提问',
    exploreToday: '今天想探索什么？',
    toastNewChat: '已创建新对话',
    toastSwitchPipeline: '已切换到',
    toastKnowledgeBase: '知识库管理功能请在本地部署后使用',
    toastKnowledgeSwitch: '知识库切换功能请在本地部署后使用',
    newChatTitle: '新对话',
    demoNotice: '交互预览 · 回复为预设演示内容。',
    send: '发送消息',
    conversation: '对话记录',
    openMenu: '打开菜单',
    closeMenu: '关闭菜单',
    copied: '已复制',
    copyFailed: '复制失败',
  },
};

// --- Toast Notification ---
function Toast({ message, visible, onClose }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 2500);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className={styles.toast} role="status">
      <span className={styles.toastIcon}>ℹ</span>
      <span>{message}</span>
    </div>
  );
}

function CopyCodeButton({code, t}) {
  const [status, setStatus] = useState('');
  const timeoutRef = useRef(null);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; clearTimeout(timeoutRef.current); };
  }, []);
  return <button type="button" className={styles.codeBlockCopy} onClick={async () => {
    try {
      await navigator.clipboard.writeText(code);
      if (mounted.current) setStatus(t.copied);
    } catch {
      if (mounted.current) setStatus(t.copyFailed);
    }
    if (mounted.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setStatus(''), 2000);
    }
  }}><span role="status">{status || t.copy}</span></button>;
}

// --- Components ---

function Sidebar({ collapsed, onToggle, activeSession, sessions, onSessionChange, onNewChat, onShowToast, t, sidebarRef, isMobile }) {
  const logoUrl = useBaseUrl('img/ultrarag.svg');
  const homeUrl = useBaseUrl('/');

  return (
    <aside id="demo-sidebar" ref={sidebarRef} inert={isMobile && collapsed ? true : undefined}
      aria-label="Chat navigation" className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''}`}>
      {/* Header */}
      <div className={styles.sidebarHeader}>
        <div className={styles.sidebarToggleRow}>
          {!collapsed && (
            <button className={styles.logoLink} onClick={onNewChat} title={t.newChat}>
              <img src={logoUrl} alt="UltraRAG" width="400" height="60" className={styles.logoImg} />
            </button>
          )}
          <button
            className={`${styles.toggleBtn} ${collapsed ? styles.toggleBtnRotated : ''}`}
            onClick={onToggle}
            title={collapsed ? t.openMenu : t.closeMenu}
            aria-label={collapsed ? t.openMenu : t.closeMenu}
            aria-expanded={!collapsed}
            aria-controls="demo-sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
            </svg>
          </button>
        </div>

        {/* New Chat */}
        <button className={styles.navBtn} aria-label={t.newChat} onClick={onNewChat}>
          <span className={styles.navIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
              stroke="currentColor" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
          </span>
          {!collapsed && <span className={styles.navText}>{t.newChat}</span>}
        </button>

        {/* Knowledge Base */}
        <button className={styles.navBtn} aria-label={t.knowledgeBase} onClick={() => onShowToast(t.toastKnowledgeBase)}>
          <span className={styles.navIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
              stroke="currentColor" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </span>
          {!collapsed && <span className={styles.navText}>{t.knowledgeBase}</span>}
        </button>
      </div>

      {/* Session List */}
      {!collapsed && (
        <div className={styles.sessionList}>
          <div className={styles.sessionLabel}>{t.recentChats}</div>
          {sessions.map((session) => (
            <button
              type="button"
              aria-current={session.id === activeSession ? 'true' : undefined}
              key={session.id}
              className={`${styles.sessionItem} ${session.id === activeSession ? styles.sessionActive : ''}`}
              onClick={() => onSessionChange(session.id)}
            >
              <span className={styles.sessionTitle}>{session.title}</span>
            </button>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className={styles.sidebarFooter}>
        <a href={homeUrl} aria-label={t.backToHome} className={styles.navBtn} style={{ textDecoration: 'none' }}>
          <span className={styles.navIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
              stroke="currentColor" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
          </span>
          {!collapsed && <span className={styles.navText}>{t.backToHome}</span>}
        </a>
      </div>
    </aside>
  );
}

function ProcessContainer({ steps, t }) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className={`${styles.processContainer} ${collapsed ? styles.processCollapsed : ''}`}>
      <button type="button" className={styles.processHeader} aria-expanded={!collapsed} onClick={() => setCollapsed(!collapsed)}>
        <span className={styles.processHeaderDot}></span>
        <span className={styles.processHeaderText}>{t.thinkingProcess}</span>
        <svg className={`${styles.processChevron} ${collapsed ? '' : styles.processChevronOpen}`}
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      {!collapsed && (
        <div className={styles.processBody}>
          {steps.map((step, idx) => (
            <div key={idx} className={styles.processStep}>
              <div className={styles.stepTitle}>
                <span>{step.name}</span>
              </div>
              {step.detail && (
                <div className={styles.stepDetails}>{step.detail}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ReferenceContainer({ sources, t }) {
  const [showUnused, setShowUnused] = useState(false);
  const usedSources = sources.filter(s => s.used);
  const unusedSources = sources.filter(s => !s.used);

  return (
    <div className={styles.referenceContainer}>
      {usedSources.map((src) => (
        <div key={src.id} className={`${styles.refItem} ${styles.refUsed}`}>
          <span className={styles.refId}>[{src.id}]</span>
          <span className={styles.refTitle}>{src.title}</span>
        </div>
      ))}
      {unusedSources.length > 0 && (
        <div className={styles.unusedRefsSection}>
          <button className={styles.unusedToggle} onClick={() => setShowUnused(!showUnused)}>
            <span>{showUnused ? t.collapse : t.expand} {unusedSources.length} {t.unreferencedDocs}</span>
            <svg className={showUnused ? styles.unusedChevronOpen : ''} width="12" height="12"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          {showUnused && unusedSources.map((src) => (
            <div key={src.id} className={`${styles.refItem} ${styles.refUnused}`}>
              <span className={styles.refId}>[{src.id}]</span>
              <span className={styles.refTitle}>{src.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Parse markdown content into React elements
function parseMarkdown(content, t) {
  const lines = content.split('\n');
  const elements = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith('```')) {
      const langLine = line.slice(3).trim();
      const lang = langLine.split(/\s+/)[0] || 'text'; // 提取语言名（忽略文件名等额外文本）
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      const codeStr = codeLines.join('\n');
      elements.push(
        <div key={key++} className={styles.codeBlockWrapper}>
          <div className={styles.codeBlockHeader}>
            <span className={styles.codeBlockLang}>{lang}</span>
            <CopyCodeButton code={codeStr} t={t} />
          </div>
          <Highlight code={codeStr} language={lang} theme={themes.github}>
            {({ tokens, getTokenProps }) => (
              <pre className={styles.codeBlockPre}>
                <code>
                  {tokens.map((line, lineIdx) => (
                    <div key={lineIdx}>
                      {line.map((token, tokenIdx) => (
                        <span key={tokenIdx} {...getTokenProps({ token })} />
                      ))}
                    </div>
                  ))}
                </code>
              </pre>
            )}
          </Highlight>
        </div>
      );
      continue;
    }

    // Heading
    if (line.startsWith('### ')) {
      elements.push(<h2 key={key++} className={styles.mdH3}>{line.slice(4)}</h2>);
      i++; continue;
    }
    if (line.startsWith('## ')) {
      elements.push(<h2 key={key++} className={styles.mdH2}>{line.slice(3)}</h2>);
      i++; continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={key++} className={styles.mdBlockquote}>
          {renderInline(line.slice(2))}
        </blockquote>
      );
      i++; continue;
    }

    // List item
    if (line.startsWith('- ')) {
      const listItems = [];
      while (i < lines.length && lines[i].startsWith('- ')) {
        listItems.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={key++} className={styles.mdUl}>
          {listItems.map((item, idx) => (
            <li key={idx} className={styles.mdLi}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      i++; continue;
    }

    // Paragraph
    elements.push(<p key={key++} className={styles.mdP}>{renderInline(line)}</p>);
    i++;
  }

  return elements;
}

function renderInline(text) {
  const parts = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const codeMatch = remaining.match(/`(.+?)`/);

    let nextMatch = null;
    let type = null;

    if (boldMatch && codeMatch) {
      if (boldMatch.index < codeMatch.index) {
        nextMatch = boldMatch; type = 'bold';
      } else {
        nextMatch = codeMatch; type = 'code';
      }
    } else if (boldMatch) {
      nextMatch = boldMatch; type = 'bold';
    } else if (codeMatch) {
      nextMatch = codeMatch; type = 'code';
    }

    const linkMatch = remaining.match(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/);
    if (linkMatch && (!nextMatch || linkMatch.index < nextMatch.index)) {
      nextMatch = linkMatch;
      type = 'link';
    }
    if (!nextMatch) {
      parts.push(<span key={key++}>{remaining}</span>);
      break;
    }
    if (nextMatch.index > 0) {
      parts.push(<span key={key++}>{remaining.substring(0, nextMatch.index)}</span>);
    }
    if (type === 'link') {
      const href = externalUrl(nextMatch[2]);
      parts.push(href ? <a key={key++} href={href} target="_blank" rel="noopener noreferrer">{nextMatch[1]}</a> : <span key={key++}>{nextMatch[1]}</span>);
    } else if (type === 'bold') {
      parts.push(<strong key={key++}>{nextMatch[1]}</strong>);
    } else {
      parts.push(<code key={key++} className={styles.inlineCode}>{nextMatch[1]}</code>);
    }
    remaining = remaining.substring(nextMatch.index + nextMatch[0].length);
  }
  return parts;
}

function MessageBubble({ message, t }) {
  if (message.role === 'user') {
    return (
      <div className={`${styles.chatBubble} ${styles.chatBubbleUser}`}>
        <div className={styles.msgContent}>{message.content}</div>
      </div>
    );
  }

  return (
    <div className={`${styles.chatBubble} ${styles.chatBubbleAssistant}`}>
      {message.steps && <ProcessContainer steps={message.steps} t={t} />}
      <div className={styles.msgContent}>
        {parseMarkdown(message.content, t)}
      </div>
      {message.sources && message.sources.length > 0 && (
        <ReferenceContainer sources={message.sources} t={t} />
      )}
    </div>
  );
}

function EmptyState({ onSuggestionClick, t, chips }) {
  return (
    <div className={styles.emptyStateWrapper}>
      <div className={styles.greetingSection}>
        <span className={styles.greetingGradient}>{t.exploreToday}
        </span>
      </div>
      <div className={styles.suggestionGrid}>
        {chips.map((chip, idx) => (
          <button key={idx} className={styles.suggestionCard} onClick={() => onSuggestionClick(chip.text)}>
            <div className={styles.suggestionCardTop}>
              <span className={styles.suggestionCardIcon}>{chip.icon}</span>
              <span className={styles.suggestionCardTitle}>{chip.text}</span>
            </div>
            <span className={styles.suggestionCardSub}>{chip.sub}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function PipelineDropdown({ pipelineIdx, onPipelineSelect }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const pipeline = DEMO_PIPELINES[pipelineIdx];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  return (
    <div className={styles.pipelineDropdownWrapper} ref={dropdownRef}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}
      onKeyDown={event => {
        if (event.key === 'Escape') {
          setOpen(false);
          dropdownRef.current?.querySelector('button')?.focus();
        }
      }}>
      <button className={styles.btnPipelineSelect} aria-expanded={open} onClick={() => setOpen(!open)}>
        <span className={styles.pipelineName}>{pipeline.name}</span>
        <span className={styles.pipelineSubtext}>UltraRAG</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ opacity: 0.4, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      {open && (
        <div className={styles.pipelineMenu}>
          {DEMO_PIPELINES.map((p, idx) => (
            <button
              key={p.id}
              className={`${styles.pipelineMenuItem} ${idx === pipelineIdx ? styles.pipelineMenuItemActive : ''}`}
              onClick={() => { onPipelineSelect(idx); setOpen(false); }}
            >
              <span>{p.name}</span>
              {idx === pipelineIdx && <span className={styles.pipelineCheck}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ChatArea({ messages, streamingMessage, isProcessing, onSendMessage, pipelineIdx, onPipelineSelect, onShowToast, isEmpty, t, sidebarCollapsed, onSidebarToggle, isMobile, chips }) {
  const chatHistoryRef = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef(null);

  const initialRender = useRef(true);
  const previousMessages = useRef(messages);
  const followBottom = useRef(true);
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    const newUserMessage = previousMessages.current !== messages && messages.at(-1)?.role === 'user';
    previousMessages.current = messages;
    if (chatHistoryRef.current && (followBottom.current || newUserMessage)) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages, streamingMessage]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputValue]);

  const handleSend = useCallback((text) => {
    const msg = text || inputValue.trim();
    if (!msg || isProcessing) return;
    setInputValue('');
    onSendMessage(msg);
  }, [inputValue, isProcessing, onSendMessage]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <main className={styles.chatMain} inert={isMobile && !sidebarCollapsed ? true : undefined}>
      {/* View Header */}
      <header className={styles.viewHeader}>
        <button data-demo-menu className={styles.mobileMenuBtn} onClick={onSidebarToggle}
          aria-label={t.openMenu} aria-controls="demo-sidebar" aria-expanded={!sidebarCollapsed}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        <h1 className={styles.srOnly}>UltraRAG Demo</h1>
        <PipelineDropdown pipelineIdx={pipelineIdx} onPipelineSelect={onPipelineSelect} />
      </header>

      <p className={styles.demoNotice}>{t.demoNotice}</p>
      {/* Chat Container */}
      <div className={`${styles.chatContainer} ${isEmpty ? styles.chatContainerEmpty : ''}`}>
        <div className={styles.chatHistory} ref={chatHistoryRef} role="log" aria-label={t.conversation} aria-live="polite" aria-busy={isProcessing}
          onScroll={event => {
            const {scrollHeight, scrollTop, clientHeight} = event.currentTarget;
            followBottom.current = scrollHeight - scrollTop - clientHeight < 80;
          }}>
          {isEmpty && !streamingMessage ? (
            <EmptyState
              onSuggestionClick={(text) => handleSend(text)}
              t={t}
              chips={chips}
            />
          ) : (
            <>
              {messages.map((msg, idx) => (
                <MessageBubble key={idx} message={msg} t={t} />
              ))}
              {streamingMessage && streamingMessage.isThinking && (
                <div className={`${styles.chatBubble} ${styles.chatBubbleAssistant}`}>
                  <div className={styles.aiThinking}>
                    <span className={styles.aiThinkingDot}></span>
                    <span className={styles.aiThinkingDot}></span>
                    <span className={styles.aiThinkingDot}></span>
                  </div>
                </div>
              )}
              {streamingMessage && streamingMessage.isStreaming && (
                <div className={`${styles.chatBubble} ${styles.chatBubbleAssistant}`}>
                  {streamingMessage.steps && <ProcessContainer steps={streamingMessage.steps} t={t} />}
                  <div className={`${styles.msgContent} ${styles.streamingContent}`}>
                    {parseMarkdown(streamingMessage.content, t)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Input Area */}
        <div className={styles.chatInputWrapper}>
          <div className={styles.chatInputContainer}>
            <textarea
              ref={textareaRef}
              className={styles.chatInput}
              placeholder={t.askUltraRAG}
              aria-label={t.askUltraRAG}
              rows="1"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className={styles.actionsRow}>
              <div className={styles.leftActions}>
                <button className={styles.kbSelectorPill} onClick={() => onShowToast(t.toastKnowledgeSwitch)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </svg>
                  <span>{t.knowledgeBase}</span>
                </button>
              </div>
              <div className={styles.rightActions}>
                <button
                  className={styles.btnSend}
                  aria-label={t.send}
                  onClick={() => handleSend()}
                  disabled={isProcessing || !inputValue.trim()}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="19" x2="12" y2="5"></line>
                    <polyline points="5 12 12 5 19 12"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// --- Main Demo Page ---
function DemoExperience({isZh}) {
  const t = isZh ? UI.zh : UI.en;
  const lang = isZh ? 'zh' : 'en';

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [viewportReady, setViewportReady] = useState(false);
  const sidebarRef = useRef(null);
  useEffect(() => {
    const query = window.matchMedia('(max-width: 768px)');
    const update = () => {
      setIsMobile(query.matches);
      setSidebarCollapsed(query.matches);
      setViewportReady(true);
    };
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!isMobile || sidebarCollapsed) return;
    const drawer = sidebarRef.current;
    const focusable = () => [...drawer.querySelectorAll('button, a[href]')].filter(el => !el.disabled);
    focusable()[0]?.focus();
    const onKeyDown = event => {
      const controls = focusable();
      if (event.key === 'Escape') { event.preventDefault(); setSidebarCollapsed(true); }
      if (event.key === 'Tab') {
        if (event.shiftKey && document.activeElement === controls[0]) {
          event.preventDefault(); controls.at(-1)?.focus();
        } else if (!event.shiftKey && document.activeElement === controls.at(-1)) {
          event.preventDefault(); controls[0]?.focus();
        }
      }
    };
    drawer.addEventListener('keydown', onKeyDown);
    return () => {
      drawer.removeEventListener('keydown', onKeyDown);
      document.querySelector('[data-demo-menu]')?.focus();
    };
  }, [isMobile, sidebarCollapsed]);
  const [activeSession, setActiveSession] = useState(1);
  const [pipelineIdx, setPipelineIdx] = useState(1);
  const [conversations, setConversations] = useState(DEMO_CONVERSATIONS[lang]);
  const [sessions, setSessions] = useState(INITIAL_SESSIONS[lang]);
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [streamingMsg, setStreamingMsg] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cancelStreamRef = useRef(null);
  useEffect(() => () => cancelStreamRef.current?.(), []);
  const cancelStream = useCallback(() => {
    cancelStreamRef.current?.();
    cancelStreamRef.current = null;
    setStreamingMsg(null);
    setIsProcessing(false);
  }, []);

  const currentMessages = conversations[activeSession] || [];
  const isEmpty = currentMessages.length === 0;

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setToastVisible(true);
  }, []);

  const handleSessionChange = useCallback((sessionId) => {
    // Cancel any ongoing streaming when switching sessions
    cancelStream();
    if (isMobile) setSidebarCollapsed(true);
    setActiveSession(sessionId);
  }, [cancelStream, isMobile]);

  const handleNewChat = useCallback(() => {
    if (isMobile) setSidebarCollapsed(true);
    if (isEmpty) return;
    // Cancel any ongoing streaming
    cancelStream();
    const newId = Date.now();
    setConversations((prev) => ({ ...prev, [newId]: [] }));
    setSessions((prev) => [{ id: newId, title: t.newChatTitle }, ...prev]);
    setActiveSession(newId);
    showToast(t.toastNewChat);
  }, [isEmpty, showToast, t, cancelStream, isMobile]);

  const handlePipelineSelect = useCallback((idx) => {
    setPipelineIdx(idx);
    showToast(`${t.toastSwitchPipeline} ${DEMO_PIPELINES[idx].name}`);
  }, [showToast, t]);

  const handleSendMessage = useCallback((text) => {
    const currentSession = activeSession;

    setConversations((prev) => ({
      ...prev,
      [currentSession]: [...(prev[currentSession] || []), { role: 'user', content: text }],
    }));
    // Update session title if it's a new chat
    setSessions((prev) => prev.map(s =>
      s.id === currentSession && s.title === t.newChatTitle
        ? { ...s, title: text.slice(0, 20) + (text.length > 20 ? '...' : '') }
        : s
    ));

    setIsProcessing(true);
    setStreamingMsg({ role: 'assistant', isThinking: true });

    cancelStreamRef.current?.();
    cancelStreamRef.current = startDemoStream(CANNED_RESPONSES[lang][0], {
      onChunk: setStreamingMsg,
      onComplete: response => {
        setStreamingMsg(null);
        setIsProcessing(false);
        setConversations(prev => ({
          ...prev,
          [currentSession]: [...(prev[currentSession] || []), {role: 'assistant', ...response}],
        }));
      },
    });
  }, [activeSession, lang, t]);

  return (
    <div className={styles.demoContainer} data-ready={viewportReady || undefined}>
      <Head>
        <title>UltraRAG Demo | UltraRAG</title>
        <meta name="description" content="Explore the UltraRAG chat interface with pre-recorded sample responses." />
      </Head>
      <Sidebar
        collapsed={sidebarCollapsed}
        isMobile={isMobile}
        sidebarRef={sidebarRef}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeSession={activeSession}
        sessions={sessions}
        onSessionChange={handleSessionChange}
        onNewChat={handleNewChat}
        onShowToast={showToast}
        t={t}
      />
      {/* 移动端遮罩层 */}
      {isMobile && !sidebarCollapsed && (
        <div aria-hidden="true" className={styles.sidebarBackdrop} onClick={() => setSidebarCollapsed(true)} />
      )}
      <ChatArea
        key={activeSession}
        isMobile={isMobile}
        chips={SUGGESTION_CHIPS[lang]}
        messages={currentMessages}
        streamingMessage={streamingMsg}
        isProcessing={isProcessing}
        onSendMessage={handleSendMessage}
        pipelineIdx={pipelineIdx}
        onPipelineSelect={handlePipelineSelect}
        onShowToast={showToast}
        isEmpty={isEmpty}
        t={t}
        sidebarCollapsed={sidebarCollapsed}
        onSidebarToggle={() => setSidebarCollapsed(false)}
      />
      <Toast message={toastMsg} visible={toastVisible} onClose={() => setToastVisible(false)} />
    </div>
  );
}

export default function DemoPage() {
  const isZh = useIsZh();
  return <DemoExperience key={isZh ? 'zh' : 'en'} isZh={isZh} />;
}
