# AI News Hub 🤖

人工智能新闻聚合平台 - 自动收集国内外主流 AI 新闻，按板块分类展示。

## ✨ 功能特性

- 🖥️ **代码编写** - AI编程工具、Copilot、代码生成相关新闻
- 🎨 **图像技术** - 图像生成/编辑/增强、视觉模型、计算机视觉相关新闻
- 📊 **数据分析** - 数据分析、ML工具、数据科学相关新闻
- 🔥 **热门项目** - GitHub AI 热门新项目推荐
- ⏰ **定时更新** - 每天上午 7:00 自动获取最新新闻
- 🔄 **手动刷新** - 支持手动触发新闻更新

## 📰 新闻来源

### 国际
- HackerNews (Algolia API)
- TechCrunch AI
- VentureBeat AI
- The Verge AI
- Ars Technica AI

### 国内
- 36氪
- 机器之心
- 量子位
- InfoQ中文

### 项目
- GitHub Search API (AI相关热门新仓库)

## 🛠️ 技术栈

- **前端**: Vue 3 + Vite + CSS3 (科技风暗色主题)
- **后端**: Node.js + Express
- **定时任务**: node-cron
- **数据获取**: RSS解析 + API调用 + 网页抓取

## 🚀 快速开始

```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd server && npm install

# 启动后端服务 (端口 3000)
cd server && node index.js

# 启动前端开发服务器 (端口 5173)
npm run dev
```

或者同时启动前后端：

```bash
npm start
```

访问 http://localhost:5173 查看网页。

## 📁 项目结构

```
AI_news/
├── server/                  # 后端
│   ├── index.js             # Express 服务器入口
│   ├── fetcher.js           # 新闻获取与分类逻辑
│   ├── scheduler.js         # 定时任务 (7AM CST)
│   ├── data/                # 新闻数据存储
│   └── package.json
├── src/                     # 前端 Vue 3
│   ├── components/
│   │   ├── Header.vue       # 顶部导航栏
│   │   ├── CategorySection.vue  # 分类板块
│   │   ├── NewsCard.vue     # 新闻卡片
│   │   └── Footer.vue       # 页脚
│   ├── App.vue              # 主应用
│   ├── main.js              # 入口
│   └── style.css            # 全局科技风样式
├── public/
├── index.html
├── vite.config.js
└── package.json
```

## 🎨 UI 设计

- 深色科技风主题 (深蓝/紫色渐变背景)
- 霓虹蓝/紫/青/橙色高亮
- 毛玻璃效果卡片
- 网格背景动画
- 流光边框效果
- 响应式布局 (桌面端 2×2 网格，移动端单列)

## 📡 API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/news` | 获取所有新闻 |
| GET | `/api/news/:category` | 获取指定分类新闻 |
| POST | `/api/refresh` | 手动刷新新闻 |
| GET | `/api/health` | 健康检查 |