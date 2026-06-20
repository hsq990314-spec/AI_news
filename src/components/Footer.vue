<template>
  <footer class="footer">
    <div class="footer-border"></div>
    <div class="footer-content container">
      <div class="footer-left">
        <span class="footer-brand">AI NEWS HUB</span>
        <span class="footer-divider">|</span>
        <span class="footer-desc">人工智能新闻聚合平台</span>
      </div>
      <div class="footer-right">
        <span class="footer-sources">
          数据来源：HackerNews · TechCrunch · VentureBeat · 36氪 · 机器之心 · 量子位 · GitHub
        </span>
      </div>
      <div class="footer-bottom">
        <span>每日 07:00 自动更新 · Powered by Vue 3 + Node.js</span>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
.footer {
  margin-top: 60px;
  position: relative;
}

.footer-border {
  height: 1px;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(0, 195, 255, 0.3), 
    rgba(168, 85, 247, 0.3), 
    rgba(6, 255, 208, 0.3), 
    transparent
  );
}

.footer-content {
  padding: 30px 24px 40px;
  text-align: center;
}

.footer-left {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 12px;
}

.footer-brand {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 700;
  background: var(--gradient-blue-purple);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 2px;
}

.footer-divider {
  color: var(--text-muted);
  opacity: 0.3;
}

.footer-desc {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.footer-right {
  margin-bottom: 12px;
}

.footer-sources {
  font-size: 0.72rem;
  color: var(--text-muted);
  opacity: 0.7;
}

.footer-bottom {
  font-size: 0.7rem;
  color: var(--text-muted);
  opacity: 0.5;
}
</style>