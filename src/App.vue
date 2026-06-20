<template>
  <div class="app">
    <Header 
      :lastUpdated="lastUpdated" 
      :isRefreshing="isRefreshing"
      :currentTab="currentTab"
      @refresh="refreshNews"
      @tab-change="switchTab"
    />
    <main class="main-content container">
      <div class="tab-banner">
        <span class="tab-banner-icon">{{ currentTab === 'cn' ? '🇨🇳' : '🌍' }}</span>
        <span class="tab-banner-text">{{ currentTab === 'cn' ? '国内 AI 新闻' : '国际 AI 新闻' }}</span>
        <span class="tab-banner-desc">{{ currentTab === 'cn' ? '来自 36氪、机器之心、量子位、新智元、IT之家、CSDN、开源中国、Google新闻 等中文源' : '来自 HackerNews、TechCrunch、GitHub 等英文源（附中文翻译）' }}</span>
      </div>
      <div v-if="isLoading && !hasData" class="loading-state">
        <div class="loading-spinner"></div>
        <p class="loading-text">正在获取 AI 新闻...</p>
      </div>
      <div v-else-if="hasError && !hasData" class="error-state">
        <div class="error-icon">⚠️</div>
        <p class="error-text">加载失败，请稍后重试</p>
        <button class="retry-btn" @click="refreshNews">重新加载</button>
      </div>
      <div v-else class="categories-grid">
        <CategorySection
          v-for="(cat, key) in filteredCategories"
          :key="key + '_' + currentTab"
          :categoryKey="key"
          :name="cat.name"
          :icon="cat.icon"
          :news="cat.news"
          :color="categoryColors[key]"
        />
      </div>
    </main>
    <Footer />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import Header from './components/Header.vue'
import CategorySection from './components/CategorySection.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: { Header, CategorySection, Footer },
  setup() {
    const newsData = ref(null)
    const isLoading = ref(false)
    const isRefreshing = ref(false)
    const hasError = ref(false)
    const currentTab = ref('cn')

    const categoryColors = {
      coding: { gradient: 'linear-gradient(135deg, #00c3ff, #0080ff)', glow: 'rgba(0, 195, 255, 0.3)', accent: '#00c3ff' },
      image: { gradient: 'linear-gradient(135deg, #a855f7, #6d28d9)', glow: 'rgba(168, 85, 247, 0.3)', accent: '#a855f7' },
      data: { gradient: 'linear-gradient(135deg, #06ffd0, #00b894)', glow: 'rgba(6, 255, 208, 0.3)', accent: '#06ffd0' },
      github: { gradient: 'linear-gradient(135deg, #ff6b35, #ff2d78)', glow: 'rgba(255, 107, 53, 0.3)', accent: '#ff6b35' }
    }

    const lastUpdated = computed(() => newsData.value?.lastUpdated || null)
    const hasData = computed(() => newsData.value?.categories && Object.keys(newsData.value.categories).length > 0)
    const categories = computed(() => newsData.value?.categories || {})

    // Filter news by current tab language
    const filteredCategories = computed(() => {
      const cats = categories.value
      const result = {}
      for (const [key, cat] of Object.entries(cats)) {
        // GitHub only shows in international tab
        if (key === 'github') {
          if (currentTab.value === 'en') {
            result[key] = { ...cat, news: cat.news }
          }
        } else {
          const filteredNews = cat.news.filter(item => item.lang === currentTab.value)
          if (filteredNews.length > 0) {
            result[key] = { ...cat, news: filteredNews }
          }
        }
      }
      return result
    })

    function switchTab(tab) {
      currentTab.value = tab
    }

    async function fetchNews() {
      try {
        const response = await fetch('/AI_news/news.json')
        if (!response.ok) throw new Error('Failed to fetch')
        const data = await response.json()
        newsData.value = data
        hasError.value = false
      } catch (error) {
        // Fallback: try without base path for local dev
        try {
          const response = await fetch('/news.json')
          if (!response.ok) throw new Error('Failed to fetch')
          const data = await response.json()
          newsData.value = data
          hasError.value = false
          return
        } catch (e2) {}
        console.error('Fetch error:', error)
        hasError.value = true
      }
    }

    async function refreshNews() {
      // In static mode, refresh = reload the page
      window.location.reload()
    }

    onMounted(async () => {
      isLoading.value = true
      await fetchNews()
      isLoading.value = false
    })

    return {
      newsData, isLoading, isRefreshing, hasError,
      lastUpdated, hasData, categories, filteredCategories,
      categoryColors, currentTab, switchTab,
      refreshNews
    }
  }
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 92px;
  padding-bottom: 40px;
}

.tab-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius);
  animation: fadeInUp 0.4s ease forwards;
}

.tab-banner-icon {
  font-size: 1.3rem;
}

.tab-banner-text {
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 700;
  background: var(--gradient-blue-purple);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 1px;
}

.tab-banner-desc {
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-left: 8px;
  padding-left: 12px;
  border-left: 1px solid rgba(255, 255, 255, 0.08);
}

@media (max-width: 768px) {
  .tab-banner {
    flex-wrap: wrap;
    gap: 6px;
  }
  .tab-banner-desc {
    width: 100%;
    margin-left: 0;
    padding-left: 0;
    border-left: none;
    font-size: 0.72rem;
  }
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

@media (max-width: 1024px) {
  .categories-grid {
    grid-template-columns: 1fr;
  }
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 20px;
}

.loading-text {
  color: var(--text-secondary);
  font-size: 1.1rem;
  animation: pulse 1.5s ease-in-out infinite;
}

.error-icon {
  font-size: 3rem;
}

.error-text {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.retry-btn {
  padding: 10px 24px;
  background: var(--gradient-blue-purple);
  border: none;
  border-radius: var(--radius-sm);
  color: #fff;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow-hover);
}
</style>