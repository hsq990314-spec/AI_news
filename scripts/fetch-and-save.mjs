/**
 * GitHub Actions fetch script
 * Fetches news and saves to public/news.json for static deployment
 * Includes ALL Chinese sources from the original server/fetcher.js
 */
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import axios from 'axios';
import Parser from 'rss-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const rssParser = new Parser({
  timeout: 15000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
});

// Category keywords
const CATEGORIES = {
  coding: {
    name: '代码编写',
    icon: '🖥️',
    keywords_en: [
      'copilot', 'code generation', 'coding assistant', 'code completion',
      'cursor', 'ai coding', 'llm programming', 'code llm', 'devtools ai',
      'ai developer', 'code assistant', 'programming ai', 'swe-agent',
      'code interpreter', 'ai ide', 'ai debugger', 'automated coding'
    ],
    keywords_cn: [
      '代码生成', '编程助手', '代码补全', 'AI编程', '智能编程',
      '代码助手', 'AI写代码', '智能代码', '编程工具', '代码智能',
      '自动编程', 'AI程序员', '低代码', '无代码', '代码审查',
      '智能开发', 'AI IDE', '代码模型', '编程大模型', 'AI开发',
      '智能IDE', '代码智能体', 'AI Agent', '智能体', 'Devin',
      'Claude Code', 'Codex', 'AI软件工程师', '代码自动生成',
      '智能代码编辑器', 'Cursor', 'Copilot'
    ]
  },
  image: {
    name: '图像技术',
    icon: '🎨',
    keywords_en: [
      'stable diffusion', 'midjourney', 'dall-e', 'dalle', 'image generation',
      'computer vision', 'diffusion model', 'text to image', 'image synthesis',
      'generative art', 'neural rendering', 'image ai', 'visual generation',
      'flux', 'sora', 'video generation', 'image to video',
      'image editing', 'image enhancement', 'super resolution', 'image restoration',
      'object detection', 'image segmentation', 'visual understanding',
      'nerf', '3d reconstruction', 'image inpainting', 'image upscaling',
      'ai photo', 'visual ai', 'image recognition', 'ocr'
    ],
    keywords_cn: [
      '图像生成', '视觉模型', '扩散模型', '文生图', 'AI绘画',
      'AI视频', '图像识别', '计算机视觉', 'midjourney', 'stable diffusion',
      '图像编辑', 'AI修图', '图像增强', '超分辨率', '图像修复',
      '目标检测', '图像分割', '视觉理解', '图像处理',
      'NeRF', '3D重建', 'AI抠图', 'OCR识别', 'AI作图',
      'AI生图', 'AI画图', '文生视频', '图生图', 'AI P图',
      '视觉大模型', '多模态', 'AI换脸', '图像大模型', '视频生成',
      'Sora', 'AI短视频', 'AI动画', '数字人生成', 'AI摄影',
      '视觉智能', '图像智能', '图像合成', '风格迁移'
    ]
  },
  data: {
    name: '数据分析',
    icon: '📊',
    keywords_en: [
      'data analysis', 'ai analytics', 'data science', 'ml pipeline',
      'business intelligence', 'predictive analytics', 'data mining',
      'automl', 'data platform', 'ai dashboard', 'data warehouse ai',
      'llm analytics', 'ai spreadsheet', 'data agent'
    ],
    keywords_cn: [
      '数据分析', '数据科学', '机器学习', '大模型应用', '智能分析',
      '数据挖掘', 'AI分析', '自动化分析', '数据平台', '大模型',
      'LLM', 'GPT', 'ChatGPT', 'Claude', 'Gemini', 'DeepSeek',
      '人工智能', 'AI应用', 'AI工具', '智能助手', 'AI平台',
      '模型训练', '模型部署', 'RAG', '知识图谱', '向量数据库',
      '提示工程', 'Prompt', '微调', 'Fine-tuning', 'AI搜索',
      '智能问答', 'AI Agent', 'AI办公', 'AI写作', 'AI翻译',
      '语音识别', '自然语言处理', 'NLP', 'Transformer',
      '开源模型', '模型推理', '算力', 'GPU', '芯片',
      '国产大模型', '文心一言', '通义千问', '智谱', 'Kimi',
      '豆包', '元宝', '百小应', 'AI芯片', '华为AI', '百度AI',
      '阿里AI', '腾讯AI', '字节AI', 'AI融资', 'AI估值',
      'AI监管', 'AI安全', 'AI伦理', 'AGI', '通用人工智能',
      '世界模型', '具身智能', '机器人', '自动驾驶', 'AI医疗',
      'AI教育', '大模型落地', '企业AI', 'AI创业'
    ]
  }
};

// RSS Sources (International + Chinese)
const RSS_SOURCES = [
  { url: 'https://techcrunch.com/category/artificial-intelligence/feed/', source: 'TechCrunch', lang: 'en' },
  { url: 'https://venturebeat.com/category/ai/feed/', source: 'VentureBeat', lang: 'en' },
  { url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', source: 'The Verge', lang: 'en' },
  { url: 'https://arstechnica.com/tag/ai/feed/', source: 'Ars Technica', lang: 'en' },
  { url: 'https://36kr.com/feed', source: '36氪', lang: 'cn' },
  { url: 'https://www.jiqizhixin.com/rss', source: '机器之心', lang: 'cn' },
];

// Chinese-specific RSS sources (Google News search feeds)
const CN_RSS_SOURCES = [
  { url: 'https://news.google.com/rss/search?q=AI+%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD+%E5%A4%A7%E6%A8%A1%E5%9E%8B&hl=zh-CN&gl=CN&ceid=CN:zh-Hans', source: 'Google新闻', lang: 'cn' },
  { url: 'https://news.google.com/rss/search?q=AI%E7%BC%96%E7%A8%8B+%E4%BB%A3%E7%A0%81%E7%94%9F%E6%88%90&hl=zh-CN&gl=CN&ceid=CN:zh-Hans', source: 'Google新闻', lang: 'cn' },
  { url: 'https://news.google.com/rss/search?q=AI%E7%BB%98%E7%94%BB+%E5%9B%BE%E5%83%8F%E7%94%9F%E6%88%90+%E6%96%87%E7%94%9F%E5%9B%BE&hl=zh-CN&gl=CN&ceid=CN:zh-Hans', source: 'Google新闻', lang: 'cn' },
];

function classifyNews(title, content = '', lang = '') {
  const text = `${title} ${content}`.toLowerCase();

  for (const [key, category] of Object.entries(CATEGORIES)) {
    const allKeywords = [...category.keywords_en, ...category.keywords_cn];
    const matchCount = allKeywords.filter(kw => text.includes(kw.toLowerCase())).length;
    if (matchCount > 0) {
      return key;
    }
  }

  // Broader fallback for Chinese/AI content
  const aiTerms = [
    '人工智能', 'ai', '大模型', 'llm', 'gpt', '智能', '机器学习', '深度学习',
    '神经网络', '开源', '模型', '算法', '算力', '芯片', '自动驾驶', '机器人',
    'chatgpt', 'claude', 'gemini', 'deepseek', '文心', '通义', '智谱',
    'kimi', '豆包', ' ai ', 'ai-', 'ai芯片', 'ai应用'
  ];
  for (const term of aiTerms) {
    if (text.includes(term)) return 'data';
  }

  return null;
}

// Translate English text to Chinese using MyMemory API
async function translateToCn(text) {
  if (!text || !text.trim()) return '';
  try {
    const response = await axios.get('https://api.mymemory.translated.net/get', {
      params: { q: text.slice(0, 500), langpair: 'en|zh-CN' },
      timeout: 10000
    });
    if (response.data?.responseData?.translatedText) {
      let translated = response.data.responseData.translatedText;
      if (translated === text.toUpperCase()) return '';
      return translated;
    }
    return '';
  } catch (error) {
    if (error.message.includes('429') || error.response?.status === 429) return '';
    console.error('Translation error:', error.message);
    return '';
  }
}

// Batch translate English news titles (top 60)
async function translateNewsTitles(newsArray) {
  const englishItems = newsArray.filter(item => item.lang === 'en' && item.title);
  englishItems.sort((a, b) => (b.score || 0) - (a.score || 0));
  const itemsToTranslate = englishItems.slice(0, 60);
  console.log(`🌐 Translating ${itemsToTranslate.length} English titles...`);

  let translated = 0;
  for (const item of itemsToTranslate) {
    const result = await translateToCn(item.title);
    if (result) {
      item.titleCn = result;
      translated++;
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  console.log(`✅ Translation: ${translated}/${itemsToTranslate.length} done`);
}

async function fetchHackerNews() {
  const news = [];
  const queries = [
    'AI coding', 'AI image generation', 'AI data analysis',
    'copilot', 'stable diffusion', 'machine learning tool',
    'LLM application', 'AI agent', 'AI image editing', 'computer vision'
  ];

  for (const query of queries) {
    try {
      const response = await axios.get('https://hn.algolia.com/api/v1/search', {
        params: {
          query,
          tags: 'story',
          hitsPerPage: 15,
          numericFilters: 'created_at_i>' + Math.floor(Date.now() / 1000 - 7 * 24 * 3600)
        },
        timeout: 15000
      });
      if (response.data?.hits) {
        for (const hit of response.data.hits) {
          const category = classifyNews(hit.title || '');
          if (category) {
            news.push({
              id: `hn_${hit.objectID}`,
              title: hit.title || '',
              url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
              source: 'HackerNews',
              category,
              timestamp: hit.created_at || new Date().toISOString(),
              score: hit.points || 0,
              lang: 'en'
            });
          }
        }
      }
    } catch (error) {
      console.error(`HackerNews error "${query}":`, error.message);
    }
  }
  return news;
}

async function fetchRSSFeeds() {
  const news = [];
  for (const source of RSS_SOURCES) {
    try {
      const feed = await rssParser.parseURL(source.url);
      if (feed?.items) {
        for (const item of feed.items) {
          const title = item.title || '';
          const content = item.contentSnippet || item.content || '';
          const category = classifyNews(title, content, source.lang);
          if (category) {
            news.push({
              id: `rss_${Buffer.from(item.link || '').toString('base64').slice(0, 20)}`,
              title,
              url: item.link || '',
              source: source.source,
              category,
              timestamp: item.isoDate || item.pubDate || new Date().toISOString(),
              score: 0,
              lang: source.lang
            });
          }
        }
      }
    } catch (error) {
      console.error(`RSS error ${source.source}:`, error.message);
    }
  }
  return news;
}

async function fetchChineseRSSFeeds() {
  const news = [];
  for (const source of CN_RSS_SOURCES) {
    try {
      const feed = await rssParser.parseURL(source.url);
      if (feed?.items) {
        for (const item of feed.items) {
          const title = item.title || '';
          const content = item.contentSnippet || item.content || '';
          const category = classifyNews(title, content, 'cn');
          if (category) {
            news.push({
              id: `cnrss_${Buffer.from(item.link || '').toString('base64').slice(0, 20)}`,
              title,
              url: item.link || '',
              source: source.source,
              category,
              timestamp: item.isoDate || item.pubDate || new Date().toISOString(),
              score: 0,
              lang: 'cn'
            });
          }
        }
      }
    } catch (error) {
      console.error(`Chinese RSS error ${source.source}:`, error.message);
    }
  }
  return news;
}

// Fetch fast-growing GitHub repos: pushed within 2 months, modest stars (500~5000)
async function fetchGitHubFastGrowing() {
  const news = [];
  const seenIds = new Set();
  const twoMonthsAgo = new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString().split('T')[0];
  const minStars = 500;

  const queries = [
    'AI agent', 'artificial intelligence', 'machine learning',
    'deep learning', 'LLM', 'stable diffusion', 'GPT', 'RAG',
    'multimodal', 'fine-tuning', 'computer vision', 'transformer',
    'diffusion', 'autonomous', 'chatbot', 'langchain', 'embedding',
    'vector database', 'LLM application', 'open source AI'
  ];

  for (const query of queries) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      const response = await axios.get('https://api.github.com/search/repositories', {
        params: { q: `${query} pushed:>${twoMonthsAgo} stars:>${minStars}`, sort: 'stars', order: 'desc', per_page: 10 },
        headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'AI-News-Aggregator/1.0' },
        timeout: 15000
      });
      if (response.data?.items) {
        for (const repo of response.data.items) {
          if (seenIds.has(repo.full_name)) continue;
          seenIds.add(repo.full_name);
          const description = repo.description || '';
          news.push({
            id: `gh_fast_${repo.id}`,
            title: `${repo.full_name}: ${description || 'No description'}`,
            url: repo.html_url,
            source: 'GitHub',
            category: 'github-fast',
            timestamp: repo.pushed_at || new Date().toISOString(),
            score: repo.stargazers_count || 0,
            lang: 'en',
            meta: {
              stars: repo.stargazers_count,
              language: repo.language,
              name: repo.name,
              fullName: repo.full_name,
              description,
              forks: repo.forks_count,
              pushedAt: repo.pushed_at
            }
          });
        }
      }
    } catch (error) {
      if (error.response?.status === 403) {
        console.error(`GitHub fast-growing search error "${query}": rate limited (403)`);
      } else {
        console.error(`GitHub fast-growing search error "${query}":`, error.message);
      }
    }
  }

  // Also scrape GitHub Trending page for recently trending repos
  try {
    const trendingResponse = await axios.get('https://github.com/trending?since=weekly', {
      timeout: 15000,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const html = trendingResponse.data;
    const repoPattern = /<h2[^>]*class="h3[^"]*"[^>]*>[\s\S]*?href="\/([^\/"]+\/[^\/"]+?)"[^>]*>[\s\S]*?<span[^>]*class="[^"]*octicon-star[^"]*"[^>]*>[\s\S]*?<\/span>\s*([\d,]+)/g;
    let match;
    while ((match = repoPattern.exec(html)) !== null) {
      const fullName = match[1].trim();
      const starsStr = match[2].replace(/,/g, '').trim();
      const stars = parseInt(starsStr, 10) || 0;
      if (fullName && stars >= minStars && !seenIds.has(fullName)) {
        seenIds.add(fullName);
        news.push({
          id: `gh_fast_trend_${Buffer.from(fullName).toString('base64').slice(0, 20)}`,
          title: `${fullName}: Trending on GitHub`,
          url: `https://github.com/${fullName}`,
          source: 'GitHub Trending',
          category: 'github-fast',
          timestamp: new Date().toISOString(),
          score: stars,
          lang: 'en',
          meta: { stars, fullName, trending: true }
        });
      }
    }
  } catch (error) {
    console.error('GitHub Trending scrape error:', error.message);
  }

  // Sort by stars descending, take top 15
  news.sort((a, b) => (b.score || 0) - (a.score || 0));
  const top = news.slice(0, 15);

  if (top.length > 0) {
    const stars = top.map(n => n.score).filter(s => s > 0);
    console.log(`   ⭐ Fast-growing star range: ${Math.min(...stars)} ~ ${Math.max(...stars)}`);
  }

  return top;
}

// Fetch popular high-star GitHub repos: created within 1 year, stars > 3000
async function fetchGitHubPopular() {
  const news = [];
  const seenIds = new Set();
  const oneYearAgo = new Date(Date.now() - 365 * 24 * 3600 * 1000).toISOString().split('T')[0];
  const minStars = 3000;

  const queries = [
    { q: 'artificial intelligence', minStars: 5000 },
    { q: 'machine learning', minStars: 5000 },
    { q: 'deep learning', minStars: 5000 },
    { q: 'LLM', minStars: 3000 },
    { q: 'stable diffusion', minStars: 3000 },
    { q: 'GPT', minStars: 3000 },
    { q: 'transformer', minStars: 3000 },
    { q: 'computer vision', minStars: 3000 },
    { q: 'large language model', minStars: 3000 },
    { q: 'diffusion model', minStars: 2000 },
    { q: 'RAG', minStars: 2000 },
    { q: 'multimodal', minStars: 2000 },
    { q: 'AI agent framework', minStars: 2000 },
  ];

  for (const { q, minStars: ms } of queries) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      const response = await axios.get('https://api.github.com/search/repositories', {
        params: { q: `${q} stars:>${ms}`, sort: 'stars', order: 'desc', per_page: 10 },
        headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'AI-News-Aggregator/1.0' },
        timeout: 15000
      });
      if (response.data?.items) {
        for (const repo of response.data.items) {
          if (seenIds.has(repo.full_name)) continue;
          seenIds.add(repo.full_name);
          const description = repo.description || '';
          news.push({
            id: `gh_pop_${repo.id}`,
            title: `${repo.full_name}: ${description || 'No description'}`,
            url: repo.html_url,
            source: 'GitHub',
            category: 'github-popular',
            timestamp: repo.created_at || new Date().toISOString(),
            score: repo.stargazers_count || 0,
            lang: 'en',
            meta: {
              stars: repo.stargazers_count,
              language: repo.language,
              name: repo.name,
              fullName: repo.full_name,
              description,
              forks: repo.forks_count
            }
          });
        }
      }
    } catch (error) {
      if (error.response?.status === 403) {
        console.error(`GitHub popular search error "${q}": rate limited (403)`);
      } else {
        console.error(`GitHub popular search error "${q}":`, error.message);
      }
    }
  }

  // Sort by stars descending, take top 15
  news.sort((a, b) => (b.score || 0) - (a.score || 0));
  const top = news.slice(0, 15);

  if (top.length > 0) {
    const stars = top.map(n => n.score).filter(s => s > 0);
    console.log(`   ⭐ Popular star range: ${Math.min(...stars)} ~ ${Math.max(...stars)}`);
  }

  return top;
}

// Fetch from 量子位 (QbitAI) via web scraping
async function fetchQbitAI() {
  const news = [];
  try {
    const response = await axios.get('https://www.qbitai.com/', {
      timeout: 15000,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const html = response.data;
    const patterns = [
      /<a[^>]*href="(https:\/\/www\.qbitai\.com\/\d{4}\/\d+\/[^"]+)"[^>]*>([^<]+)<\/a>/g,
      /<a[^>]*href="(https:\/\/www\.qbitai\.com\/\d{4}\/\d+\/[^"]+)"[^>]*title="([^"]+)"/g,
    ];
    const seenUrls = new Set();
    for (const regex of patterns) {
      let match;
      while ((match = regex.exec(html)) !== null) {
        const url = match[1];
        const title = match[2].trim();
        if (seenUrls.has(url) || title.length < 6) continue;
        seenUrls.add(url);
        const category = classifyNews(title);
        if (category) {
          news.push({
            id: `qbit_${Buffer.from(url).toString('base64').slice(0, 20)}`,
            title, url, source: '量子位', category,
            timestamp: new Date().toISOString(), score: 0, lang: 'cn'
          });
        }
      }
    }
  } catch (error) {
    console.error('QbitAI error:', error.message);
  }
  return news;
}

// Fetch from 新智元 (AI Era) via web scraping
async function fetchAiera() {
  const news = [];
  try {
    const response = await axios.get('https://www.aiera.com.cn/', {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
      }
    });
    const html = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
    const patterns = [
      /href="(https:\/\/www\.aiera\.com\.cn\/[^"]*\d+[^"]*)"[^>]*>([^<]{8,})</g,
      /href="(\/[^"]*\d+[^"]*\.html)"[^>]*>([^<]{8,})</g,
      /title="([^"]{8,})"[^>]*href="(https:\/\/www\.aiera\.com\.cn\/[^"]*)"/g,
      /<a[^>]*href="(https:\/\/www\.aiera\.com\.cn\/\d{4}\/\d{2}\/\d{2}\/[^"]+)"[^>]*>/g,
    ];
    const seenUrls = new Set();
    for (const regex of patterns) {
      let match;
      while ((match = regex.exec(html)) !== null) {
        let url, title;
        if (match[0].includes('title=')) {
          title = match[1];
          url = match[2];
        } else if (match.length === 3) {
          url = match[1];
          title = match[2] || '';
        } else {
          url = match[1];
          title = '';
        }
        title = title.trim().replace(/<[^>]*>/g, '');
        if (url.startsWith('/')) url = 'https://www.aiera.com.cn' + url;
        if (seenUrls.has(url) || title.length < 6) continue;
        seenUrls.add(url);
        if (!title) {
          const urlParts = url.split('/');
          title = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2] || '新智元文章';
          title = decodeURIComponent(title).replace(/[-_]/g, ' ');
        }
        const category = classifyNews(title);
        if (category) {
          news.push({
            id: `aiera_${Buffer.from(url).toString('base64').slice(0, 20)}`,
            title, url, source: '新智元', category,
            timestamp: new Date().toISOString(), score: 0, lang: 'cn'
          });
        }
      }
    }
  } catch (error) {
    console.error('Aiera error:', error.message);
  }
  return news;
}

// Fetch from IT之家 AI channel
async function fetchITHome() {
  const news = [];
  try {
    const response = await axios.get('https://www.ithome.com/tag/AI/', {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': 'zh-CN,zh;q=0.9'
      }
    });
    const html = typeof response.data === 'string' ? response.data : '';
    const patterns = [
      /href="(https:\/\/www\.ithome\.com\/0\/(\d+)\.htm)"[^>]*>/g,
      /href="(\/0\/(\d+)\.htm)"[^>]*>/g,
    ];
    const seenIds = new Set();
    const articles = [];
    for (const regex of patterns) {
      let match;
      while ((match = regex.exec(html)) !== null) {
        const articleId = match[2];
        if (seenIds.has(articleId)) continue;
        seenIds.add(articleId);
        let url = match[1];
        if (url.startsWith('/')) url = 'https://www.ithome.com' + url;
        articles.push({ url, id: articleId });
      }
    }
    for (const article of articles.slice(0, 30)) {
      const urlEscaped = article.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const titlePatterns = [
        new RegExp(`href="${urlEscaped}"[^>]*>([^<]{8,})<`, 'g'),
        new RegExp(`title="([^"]{8,})"[^>]*href="${urlEscaped}"`, 'g'),
        new RegExp(`href="${urlEscaped}"[^>]*title="([^"]{8,})"`, 'g'),
      ];
      let title = '';
      for (const tp of titlePatterns) {
        const tm = tp.exec(html);
        if (tm && tm[1]) { title = tm[1].trim(); break; }
      }
      if (!title) continue;
      const category = classifyNews(title);
      if (category) {
        news.push({
          id: `ithome_${article.id}`,
          title, url: article.url, source: 'IT之家', category,
          timestamp: new Date().toISOString(), score: 0, lang: 'cn'
        });
      }
    }
  } catch (error) {
    console.error('ITHome error:', error.message);
  }
  return news;
}

// Fetch from CSDN
async function fetchCSDN() {
  const news = [];
  try {
    const response = await axios.get('https://bizapi.csdn.net/blog-gateway/api/v1/articles/list?category=ai&pageSize=20', {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://www.csdn.net/nav/ai'
      }
    });
    if (response.data?.data?.list) {
      for (const article of response.data.data.list) {
        const title = article.title || '';
        if (title.length < 6) continue;
        const category = classifyNews(title);
        if (category) {
          news.push({
            id: `csdn_${article.articleId || Buffer.from(title).toString('base64').slice(0, 20)}`,
            title,
            url: article.url || article.detailUrl || '',
            source: 'CSDN', category,
            timestamp: article.createdTime ? new Date(article.createdTime).toISOString() : new Date().toISOString(),
            score: article.viewCount || article.diggCount || 0,
            lang: 'cn'
          });
        }
      }
    }
  } catch (error) {
    // Fallback: scrape from CSDN HTML page
    console.error('CSDN API error, trying fallback:', error.message);
    try {
      const response = await axios.get('https://www.csdn.net/nav/ai', {
        timeout: 15000,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
      });
      const html = typeof response.data === 'string' ? response.data : '';
      const patterns = [
        /href="(https:\/\/blog\.csdn\.net\/[^"]+\/article\/details\/\d+)"[^>]*title="([^"]+)"/g,
        /<a[^>]*href="(https:\/\/blog\.csdn\.net\/\w+\/article\/details\/\d+)"[^>]*>([^<]{8,})<\/a>/g,
      ];
      const seenUrls = new Set();
      for (const regex of patterns) {
        let match;
        while ((match = regex.exec(html)) !== null) {
          const url = match[1];
          const title = match[2].trim().replace(/&[a-z]+;/g, ' ').replace(/<[^>]*>/g, '');
          if (seenUrls.has(url) || title.length < 6) continue;
          seenUrls.add(url);
          const category = classifyNews(title);
          if (category) {
            news.push({
              id: `csdn_${Buffer.from(url).toString('base64').slice(0, 20)}`,
              title, url, source: 'CSDN', category,
              timestamp: new Date().toISOString(), score: 0, lang: 'cn'
            });
          }
        }
      }
    } catch (fallbackError) {
      console.error('CSDN fallback error:', fallbackError.message);
    }
  }
  return news;
}

// Fetch Chinese AI news from Bing News Search
async function fetchBingNewsCN() {
  const news = [];
  const queries = [
    { q: '人工智能 大模型', label: 'AI通用' },
    { q: 'AI编程 代码生成', label: 'AI编程' },
    { q: 'AI绘画 图像生成', label: 'AI图像' },
  ];
  for (const { q } of queries) {
    try {
      const response = await axios.get('https://www.bing.com/news/search', {
        params: { q, qft: 'interval="8"', form: 'PTFTNR' },
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept-Language': 'zh-CN,zh;q=0.9'
        }
      });
      const html = typeof response.data === 'string' ? response.data : '';
      const patterns = [
        /<a[^>]*class="[^"]*title[^"]*"[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/g,
        /<a[^>]*href="([^"]+)"[^>]*class="[^"]*title[^"]*"[^>]*>([^<]+)<\/a>/g,
      ];
      const seenUrls = new Set();
      for (const regex of patterns) {
        let match;
        while ((match = regex.exec(html)) !== null) {
          let url = match[1];
          const title = match[2].trim().replace(/&[a-z]+;/g, ' ');
          if (seenUrls.has(url) || title.length < 6 || url.includes('bing.com')) continue;
          seenUrls.add(url);
          const category = classifyNews(title);
          if (category) {
            news.push({
              id: `bing_${Buffer.from(url + title).toString('base64').slice(0, 20)}`,
              title, url, source: '必应新闻', category,
              timestamp: new Date().toISOString(), score: 0, lang: 'cn'
            });
          }
        }
      }
    } catch (error) {
      console.error(`Bing News error "${q}":`, error.message);
    }
  }
  return news;
}

// Fetch from 开源中国
async function fetchOSChina() {
  const news = [];
  try {
    const feed = await rssParser.parseURL('https://www.oschina.net/news/rss');
    if (feed?.items) {
      for (const item of feed.items) {
        const title = item.title || '';
        const content = item.contentSnippet || '';
        const category = classifyNews(title, content, 'cn');
        if (category) {
          news.push({
            id: `osc_${Buffer.from(item.link || '').toString('base64').slice(0, 20)}`,
            title, url: item.link || '', source: '开源中国', category,
            timestamp: item.isoDate || item.pubDate || new Date().toISOString(),
            score: 0, lang: 'cn'
          });
        }
      }
    }
  } catch (error) {
    console.error('OSChina error:', error.message);
  }
  return news;
}

// Fetch from 机器之心 via web scraping (backup for RSS)
async function fetchJiqizhixin() {
  const news = [];
  try {
    const response = await axios.get('https://www.jiqizhixin.com/', {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': 'zh-CN,zh;q=0.9'
      }
    });
    const html = typeof response.data === 'string' ? response.data : '';
    const patterns = [
      /href="(https:\/\/www\.jiqizhixin\.com\/articles\/[^"]+)"[^>]*>([^<]{8,})</g,
      /href="(\/articles\/[^"]+)"[^>]*>([^<]{8,})</g,
      /title="([^"]{8,})"[^>]*href="(https:\/\/www\.jiqizhixin\.com\/articles\/[^"]+)"/g,
    ];
    const seenUrls = new Set();
    for (const regex of patterns) {
      let match;
      while ((match = regex.exec(html)) !== null) {
        let url, title;
        if (match[0].includes('title=')) {
          title = match[1];
          url = match[2];
        } else {
          url = match[1];
          title = match[2] || '';
        }
        title = title.trim().replace(/<[^>]*>/g, '');
        if (url.startsWith('/')) url = 'https://www.jiqizhixin.com' + url;
        if (seenUrls.has(url) || title.length < 6) continue;
        seenUrls.add(url);
        const category = classifyNews(title);
        if (category) {
          news.push({
            id: `jqx_${Buffer.from(url).toString('base64').slice(0, 20)}`,
            title, url, source: '机器之心', category,
            timestamp: new Date().toISOString(), score: 0, lang: 'cn'
          });
        }
      }
    }
  } catch (error) {
    console.error('Jiqizhixin error:', error.message);
  }
  return news;
}

function deduplicateNews(newsArray) {
  const seen = new Map();
  const result = [];
  for (const item of newsArray) {
    const normalizedTitle = item.title.toLowerCase().trim().replace(/\s+/g, ' ');
    if (!seen.has(normalizedTitle)) {
      seen.set(normalizedTitle, true);
      result.push(item);
    }
  }
  return result;
}

function sortNews(newsArray) {
  return newsArray.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return new Date(b.timestamp) - new Date(a.timestamp);
  });
}

async function fetchAllNews() {
  console.log('🔄 Starting news fetch at', new Date().toISOString());
  const allNews = [];

  const results = await Promise.allSettled([
    fetchHackerNews(), fetchRSSFeeds(), fetchChineseRSSFeeds(),
    fetchGitHubFastGrowing(), fetchGitHubPopular(), fetchQbitAI(), fetchAiera(),
    fetchITHome(), fetchCSDN(), fetchOSChina(),
    fetchJiqizhixin(), fetchBingNewsCN()
  ]);

  const sourceNames = [
    'HackerNews', 'RSS', 'ChineseRSS', 'GitHubFastGrowing',
    'GitHubPopular', 'QbitAI', 'Aiera', 'ITHome', 'CSDN', 'OSChina',
    'Jiqizhixin', 'BingNewsCN'
  ];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(`   📥 ${sourceNames[index]}: ${result.value.length} articles`);
      allNews.push(...result.value);
    }
  });

  console.log(`   📊 Total before dedup: ${allNews.length}`);
  const deduped = deduplicateNews(allNews);
  console.log(`   📊 After dedup: ${deduped.length}`);

  // Translate English titles to Chinese
  await translateNewsTitles(deduped);

  const organized = {
    coding: { name: CATEGORIES.coding.name, icon: CATEGORIES.coding.icon, news: [] },
    image: { name: CATEGORIES.image.name, icon: CATEGORIES.image.icon, news: [] },
    data: { name: CATEGORIES.data.name, icon: CATEGORIES.data.icon, news: [] },
    'github-fast': { name: '快速增长', icon: '🔥', news: [] },
    'github-popular': { name: '热门项目', icon: '⭐', news: [] }
  };

  for (const item of deduped) {
    if (item.category === 'github-fast' || item.category === 'github-popular') {
      organized[item.category].news.push(item);
    } else if (organized[item.category]) {
      organized[item.category].news.push(item);
    }
  }

  for (const key of Object.keys(organized)) {
    organized[key].news = sortNews(organized[key].news).slice(0, key.startsWith('github') ? 15 : 20);
  }

  const data = { lastUpdated: new Date().toISOString(), categories: organized };

  // Save to public/ directory
  const outputDir = join(projectRoot, 'public');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(join(outputDir, 'news.json'), JSON.stringify(data, null, 2), 'utf-8');

  console.log('✅ News fetch completed!');
  for (const [key, cat] of Object.entries(organized)) {
    const cnCount = cat.news.filter(n => n.lang === 'cn').length;
    const enCount = cat.news.filter(n => n.lang === 'en').length;
    console.log(`   ${cat.icon} ${cat.name}: ${cat.news.length} articles (🇨🇳${cnCount} / 🌍${enCount})`);
  }
  console.log(`📁 Saved to public/news.json`);

  return data;
}

// Run
fetchAllNews().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});