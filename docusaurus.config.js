// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'UltraRAG',
  tagline: 'The Modular and High-Precision RAG Framework',
  favicon: 'img/logo.svg',

  // 这里的 url 填你未来上线的网址
  url: 'https://ultrarag.github.io', 
  baseUrl: '/', // 如果你是用 GitHub Pages 且不是自定义域名，这里通常填 '/仓库名/'

  organizationName: 'UltraRAG', // 你的 GitHub 用户名
  projectName: 'ultrarag.github.io', // 你的仓库名

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  markdown: { hooks: { onBrokenMarkdownLinks: 'throw' } },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: false, // 禁用 docs 插件
        blog: {
          showReadingTime: true,
        },
        gtag: {
          trackingID: 'G-R2RNP2SFER',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // 强制深色模式，符合 vLLM 风格
      colorMode: {
        defaultMode: 'light', // 强制默认为亮色
        disableSwitch: true,  // 关掉切换开关（像vLLM一样保持风格统一）
        respectPrefersColorScheme: false,
      },
      image: 'img/home/home.jpg',
      navbar: {
        // title: 'UltraRAG',
        logo: {
          alt: 'UltraRAG Logo',
          src: 'img/optimized/_UltraRAG_logo-400.webp',
          width: 400,
          height: 60,
        },
        items: [
          // ========== 中间区域菜单 (position: left，但会通过 CSS 居中) ==========
          {
            type: 'custom-homeLink',
            to: '/',
            label: 'Home',
            labelZh: '首页',
            position: 'left',
          },
          // Products Mega Menu
          {
            type: 'custom-megaMenu',
            position: 'left',
            label: 'Research',
            labelZh: '研究',
            to: '/research',
            items: [
              {
                title: 'Latest',
                titleZh: '最新动态',
                items: [
                  { label: 'Blog', labelZh: '博客', to: '/blog' },
                ]
              },
              {
                title: 'Models',
                titleZh: '模型',
                items: [
                  { label: 'AgentCPM-Report', href: 'https://huggingface.co/openbmb/AgentCPM-Report', target: '_blank' },
                  { label: 'MiniCPM-Embedding-Light', href: 'https://huggingface.co/openbmb/MiniCPM-Embedding-Light', target: '_blank' },
                ]
              },
              {
                title: 'Papers',
                titleZh: '论文',
                items: [
                  { label: 'Selected Papers', labelZh: '精选论文', to: '/research#papers' },
                ]
              },
            ]
          },
          // Team Mega Menu
          {
            type: 'custom-megaMenu',
            position: 'left',
            label: 'Team',
            labelZh: '团队',
            to: '/team',
            items: [
              {
                title: 'About',
                titleZh: '关于我们',
                items: [
                  { label: 'Members', labelZh: '团队成员', to: '/team' },
                ]
              },
              {
                title: 'Connect',
                titleZh: '联系',
                items: [
                  { label: 'Contact', labelZh: '联系', to: '/contact' },
                  { label: 'Join Us', labelZh: '加入我们', href: 'https://nlp.csai.tsinghua.edu.cn/job/29', target: '_blank' },
                ]
              }
            ]
          },
          // ========== 右侧区域 ==========
          // GitHub Star Button（放在语言切换左侧）
          {
            type: 'custom-githubStar',
            position: 'right',
            repo: 'OpenBMB/UltraRAG',
            href: 'https://github.com/OpenBMB/UltraRAG',
          },
          // 语言切换按钮（最右侧）
          {
            type: 'custom-languageSwitcher',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'light',
        copyright: `Copyright © ${new Date().getFullYear()} UltraRAG.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
