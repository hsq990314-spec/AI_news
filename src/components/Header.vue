<template>
  <header class="header">
    <div class="header-bg"></div>
    <div class="header-content container">
      <div class="logo-section">
        <div class="logo-icon">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" stroke="url(#logoGrad)" stroke-width="2" fill="none"/>
            <path d="M14 20L18 24L26 16" stroke="url(#logoGrad)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40">
                <stop offset="0%" stop-color="#00c3ff"/>
                <stop offset="100%" stop-color="#a855f7"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div class="logo-text">
          <h1 class="logo-title">AI NEWS HUB</h1>
          <p class="logo-subtitle">人工智能新闻聚合平台</p>
        </div>
      </div>
      <div class="header-tabs">
        <button 
          class="tab-btn" 
          :class="{ active: currentTab === 'cn' }"
          @click="$emit('tab-change', 'cn')"
        >
          <span class="tab-icon">🇨🇳</span>
          <span class="tab-label">国内新闻</span>
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: currentTab === 'en' }"
          @click="$emit('tab-change', 'en')"
        >
          <span class="tab-icon">🌍</span>
          <span class="tab-label">国际新闻</span>
        </button>
      </div>
      <div class="header-actions">
        <div v-if="lastUpdated" class="update-info">
          <span class="update-dot"></span>
          <span class="update-text">{{ formatTime(lastUpdated) }}</span>
        </div>
        <button 
          class="refresh-btn" 
          :class="{ refreshing: isRefreshing }"
          @click="$emit('refresh')"
          :disabled="isRefreshing"
        >
          <svg class="refresh-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 2v6h-6"/>
            <path d="M3 12a9 9 0 0 1 15-6.7L21 8"/>
            <path d="M3 22v-6h6"/>
            <path d="M21 12a9 9 0 0 1-15 6.7L3 16"/>
          </svg>
          <span>{{ isRefreshing ? '刷新中...' : '刷新' }}</span>
        </button>
      </div>
    </div>
    <!-- Animated border line -->
    <div class="header-border"></div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  props: {
    lastUpdated: { type: String, default: null },
    isRefreshing: { type: Boolean, default: false },
    currentTab: { type: String, default: 'cn' }
  },
  emits: ['refresh', 'tab-change'],
  methods: {
    formatTime(timestamp) {
      if (!timestamp) return ''
      const date = new Date(timestamp)
      const now = new Date()
      const diff = now - date
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(diff / 3600000)
      
      if (minutes < 1) return '刚刚更新'
      if (minutes < 60) return `${minutes} 分钟前更新`
      if (hours < 24) return `${hours} 小时前更新`
      
      return date.toLocaleDateString('zh-CN', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) + ' 更新'
    }
  }
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 72px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.header-bg {
  position: absolute;
  inset: 0;
  background: rgba(10, 14, 39, 0.85);
  z-index: -1;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 14px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  animation: glow 3s ease-in-out infinite;
}

.logo-title {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 900;
  background: var(--gradient-blue-purple);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 2px;
}

.logo-subtitle {
  font-size: 0.75rem;
  color: var(--text-muted);
  letter-spacing: 1px;
  margin-top: -2px;
}

.header-tabs {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 10px;
  padding: 3px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: var(--text-muted);
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: var(--font-body);
  white-space: nowrap;
}

.tab-btn:hover {
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.05);
}

.tab-btn.active {
  background: rgba(0, 195, 255, 0.12);
  color: var(--accent-blue);
  box-shadow: 0 0 12px rgba(0, 195, 255, 0.15);
  border: 1px solid rgba(0, 195, 255, 0.2);
}

.tab-icon {
  font-size: 0.9rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.update-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: rgba(0, 195, 255, 0.08);
  border: 1px solid rgba(0, 195, 255, 0.15);
  border-radius: 20px;
}

.update-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-cyan);
  animation: pulse 2s ease-in-out infinite;
}

.update-text {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  background: rgba(0, 195, 255, 0.1);
  border: 1px solid rgba(0, 195, 255, 0.3);
  border-radius: var(--radius-sm);
  color: var(--accent-blue);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: var(--font-body);
}

.refresh-btn:hover:not(:disabled) {
  background: rgba(0, 195, 255, 0.2);
  border-color: rgba(0, 195, 255, 0.5);
  box-shadow: 0 0 15px rgba(0, 195, 255, 0.2);
  transform: translateY(-1px);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.refresh-btn.refreshing .refresh-icon {
  animation: spin 1s linear infinite;
}

.refresh-icon {
  width: 16px;
  height: 16px;
}

.header-border {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent, 
    var(--accent-blue), 
    var(--accent-purple), 
    var(--accent-cyan), 
    transparent
  );
  background-size: 200% 100%;
  animation: borderFlow 4s ease infinite;
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
  }
  
  .logo-title {
    font-size: 1.1rem;
  }
  
  .logo-subtitle {
    display: none;
  }
  
  .tab-label {
    display: none;
  }
  
  .tab-btn {
    padding: 7px 10px;
  }
  
  .update-info {
    display: none;
  }
  
  .refresh-btn span {
    display: none;
  }
  
  .refresh-btn {
    padding: 8px;
  }
}
</style>