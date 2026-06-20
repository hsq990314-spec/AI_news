<template>
  <a 
    :href="news.url" 
    target="_blank" 
    rel="noopener noreferrer"
    class="news-card"
    :style="cardStyle"
  >
    <div class="card-indicator"></div>
    <div class="card-content">
      <div class="card-header">
        <span class="card-source" :class="sourceClass">{{ news.source }}</span>
        <span v-if="news.score > 0" class="card-score">
          <svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12">
            <path d="M8 1l2 4.5H15l-3.8 3 1.4 4.5L8 10.5 3.4 13l1.4-4.5L1 5.5h5z"/>
          </svg>
          {{ formatScore(news.score) }}
        </span>
      </div>
      <h3 class="card-title">
        <template v-if="categoryKey === 'github' && news.meta">
          <span class="github-name">{{ news.meta.fullName }}</span>
          <span class="github-desc" v-if="news.meta.description"> — {{ news.meta.description }}</span>
        </template>
        <template v-else>{{ news.title }}</template>
      </h3>
      <p v-if="news.titleCn" class="card-title-cn">{{ news.titleCn }}</p>
      <div class="card-meta">
        <span class="card-time">{{ formatTime(news.timestamp) }}</span>
        <span v-if="categoryKey === 'github' && news.meta && news.meta.language" class="card-language">
          <span class="lang-dot" :style="{ background: languageColor(news.meta.language) }"></span>
          {{ news.meta.language }}
        </span>
        <span v-if="categoryKey === 'github' && news.meta && news.meta.forks" class="card-forks">
          🍴 {{ news.meta.forks }}
        </span>
      </div>
    </div>
    <div class="card-arrow">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
        <path d="M7 17L17 7M17 7H7M17 7V17"/>
      </svg>
    </div>
  </a>
</template>

<script>
const LANG_COLORS = {
  'JavaScript': '#f7df1e',
  'TypeScript': '#3178c6',
  'Python': '#3572A5',
  'Java': '#b07219',
  'Go': '#00ADD8',
  'Rust': '#dea584',
  'C++': '#f34b7d',
  'C': '#555555',
  'Ruby': '#701516',
  'Swift': '#F05138',
  'Kotlin': '#A97BFF',
  'Dart': '#00B4AB',
  'Shell': '#89e051',
  'HTML': '#e34c26',
  'CSS': '#563d7c',
  'Jupyter': '#DA5B0B',
  'Jupyter Notebook': '#DA5B0B',
  'Lua': '#000080',
  'R': '#198CE7',
  'Scala': '#c22d40',
  'PHP': '#4F5D95',
  'Vue': '#41b883',
  'Svelte': '#ff3e00'
}

export default {
  name: 'NewsCard',
  props: {
    news: { type: Object, required: true },
    categoryKey: { type: String, required: true },
    color: { type: Object, required: true },
    index: { type: Number, default: 0 }
  },
  computed: {
    cardStyle() {
      return {
        '--cat-accent': this.color.accent,
        '--cat-glow': this.color.glow,
        'animationDelay': (this.index * 0.05) + 's'
      }
    },
    sourceClass() {
      const source = this.news.source ? this.news.source.toLowerCase() : ''
      if (source.includes('github')) return 'source-github'
      if (source.includes('hacker')) return 'source-hackernews'
      if (source.includes('techcrunch')) return 'source-techcrunch'
      if (source.includes('venture')) return 'source-venturebeat'
      if (source.includes('verge')) return 'source-verge'
      if (source.includes('36') || source.includes('氪')) return 'source-36kr'
      if (source.includes('机器') || source.includes('synced')) return 'source-jiqizhixin'
      if (source.includes('量子')) return 'source-qbitai'
      if (source.includes('infoq')) return 'source-infoq'
      if (source.includes('新智元') || source.includes('aiera')) return 'source-aiera'
      if (source.includes('之家') || source.includes('ithome')) return 'source-ithome'
      if (source.includes('csdn')) return 'source-csdn'
      if (source.includes('开源')) return 'source-oschina'
      if (source.includes('google') || source.includes('新闻')) return 'source-googlenews'
      return 'source-default'
    }
  },
  methods: {
    formatTime(timestamp) {
      if (!timestamp) return ''
      var date = new Date(timestamp)
      var now = new Date()
      var diff = now - date
      var minutes = Math.floor(diff / 60000)
      var hours = Math.floor(diff / 3600000)
      var days = Math.floor(diff / 86400000)
      
      if (minutes < 1) return '刚刚'
      if (minutes < 60) return minutes + '分钟前'
      if (hours < 24) return hours + '小时前'
      if (days < 7) return days + '天前'
      
      return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
    },
    formatScore(score) {
      if (score >= 1000) return (score / 1000).toFixed(1) + 'k'
      return score.toString()
    },
    languageColor(lang) {
      return LANG_COLORS[lang] || '#8b949e'
    }
  }
}
</script>

<style scoped>
.news-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: var(--radius-sm);
  text-decoration: none;
  color: inherit;
  transition: all 0.25s ease;
  position: relative;
  animation: fadeInUp 0.4s ease forwards;
  opacity: 0;
  border: 1px solid transparent;
}

.news-card:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: var(--cat-glow);
  transform: translateX(4px);
}

.card-indicator {
  width: 3px;
  min-height: 40px;
  border-radius: 2px;
  background: var(--cat-accent);
  opacity: 0.4;
  transition: opacity 0.25s ease;
  flex-shrink: 0;
  align-self: stretch;
}

.news-card:hover .card-indicator {
  opacity: 1;
  box-shadow: 0 0 8px var(--cat-glow);
}

.card-content {
  flex: 1;
  min-width: 0;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.card-source {
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.source-github { background: rgba(255, 107, 53, 0.15); color: #ff6b35; }
.source-hackernews { background: rgba(255, 102, 0, 0.15); color: #ff6600; }
.source-techcrunch { background: rgba(0, 195, 255, 0.15); color: #00c3ff; }
.source-venturebeat { background: rgba(168, 85, 247, 0.15); color: #a855f7; }
.source-verge { background: rgba(6, 255, 208, 0.15); color: #06ffd0; }
.source-36kr { background: rgba(0, 195, 255, 0.15); color: #00c3ff; }
.source-jiqizhixin { background: rgba(168, 85, 247, 0.15); color: #a855f7; }
.source-qbitai { background: rgba(6, 255, 208, 0.15); color: #06ffd0; }
.source-infoq { background: rgba(255, 45, 120, 0.15); color: #ff2d78; }
.source-aiera { background: rgba(251, 191, 36, 0.15); color: #fbbf24; }
.source-ithome { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
.source-csdn { background: rgba(234, 88, 12, 0.15); color: #ea580c; }
.source-oschina { background: rgba(34, 197, 94, 0.15); color: #22c55e; }
.source-googlenews { background: rgba(99, 102, 241, 0.15); color: #6366f1; }
.source-default { background: rgba(255, 255, 255, 0.08); color: var(--text-secondary); }

.card-score {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 0.7rem;
  color: #fbbf24;
  font-weight: 500;
}

.card-title {
  font-size: 0.88rem;
  font-weight: 500;
  line-height: 1.5;
  color: var(--text-primary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.2s ease;
}

.news-card:hover .card-title {
  color: var(--cat-accent);
}

.github-name {
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-weight: 600;
}

.github-desc {
  color: var(--text-secondary);
  font-weight: 400;
}

.card-title-cn {
  font-size: 0.78rem;
  color: var(--text-muted);
  line-height: 1.4;
  margin-top: 3px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-style: italic;
  opacity: 0.8;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 6px;
  font-size: 0.72rem;
  color: var(--text-muted);
}

.card-language {
  display: flex;
  align-items: center;
  gap: 4px;
}

.lang-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.card-forks {
  display: flex;
  align-items: center;
  gap: 2px;
}

.card-arrow {
  color: var(--text-muted);
  opacity: 0;
  transform: translateX(-4px);
  transition: all 0.25s ease;
  flex-shrink: 0;
  margin-top: 4px;
}

.news-card:hover .card-arrow {
  opacity: 1;
  transform: translateX(0);
  color: var(--cat-accent);
}

@media (max-width: 768px) {
  .news-card {
    padding: 12px 10px;
  }
  
  .card-title {
    font-size: 0.82rem;
  }
}
</style>