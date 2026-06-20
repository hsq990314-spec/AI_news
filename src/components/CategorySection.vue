<template>
  <div class="category-section" :style="cssVars">
    <div class="section-header">
      <div class="section-icon">{{ icon }}</div>
      <h2 class="section-title">{{ name }}</h2>
      <span class="section-count">{{ news.length }} 条</span>
    </div>
    <div class="section-border"></div>
    <div class="news-list">
      <NewsCard
        v-for="(item, index) in news"
        :key="item.id"
        :news="item"
        :categoryKey="categoryKey"
        :color="color"
        :index="index"
      />
      <div v-if="news.length === 0" class="empty-state">
        <p>暂无相关新闻</p>
      </div>
    </div>
  </div>
</template>

<script>
import NewsCard from './NewsCard.vue'

export default {
  name: 'CategorySection',
  components: { NewsCard },
  props: {
    categoryKey: { type: String, required: true },
    name: { type: String, required: true },
    icon: { type: String, required: true },
    news: { type: Array, default: () => [] },
    color: { type: Object, required: true }
  },
  computed: {
    cssVars() {
      return {
        '--cat-gradient': this.color.gradient,
        '--cat-glow': this.color.glow,
        '--cat-accent': this.color.accent
      }
    }
  }
}
</script>

<style scoped>
.category-section {
  background: var(--bg-card);
  border: 1px solid var(--border-glow);
  border-radius: var(--radius);
  overflow: hidden;
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease forwards;
  position: relative;
}

.category-section:hover {
  border-color: var(--border-glow-hover);
  box-shadow: var(--shadow-glow-hover);
  transform: translateY(-2px);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px 16px;
}

.section-icon {
  font-size: 1.6rem;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cat-glow);
  border-radius: 10px;
  flex-shrink: 0;
}

.section-title {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--cat-accent);
  letter-spacing: 1px;
  flex: 1;
}

.section-count {
  font-size: 0.75rem;
  color: var(--text-muted);
  padding: 3px 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.section-border {
  height: 1px;
  background: var(--cat-gradient);
  opacity: 0.4;
  margin: 0 24px;
}

.news-list {
  padding: 12px 16px 16px;
  max-height: 600px;
  overflow-y: auto;
}

.news-list::-webkit-scrollbar {
  width: 4px;
}

.news-list::-webkit-scrollbar-track {
  background: transparent;
}

.news-list::-webkit-scrollbar-thumb {
  background: var(--cat-accent);
  border-radius: 2px;
  opacity: 0.5;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-muted);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .section-header {
    padding: 16px 18px 12px;
  }
  
  .news-list {
    padding: 10px 12px 14px;
    max-height: 500px;
  }
}
</style>