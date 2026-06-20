import express from 'express';
import cors from 'cors';
import { fetchAllNews, loadNews } from './fetcher.js';
import { startScheduler } from './scheduler.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'AI News Hub API Server',
    endpoints: {
      news: '/api/news',
      category: '/api/news/:category',
      refresh: 'POST /api/refresh',
      health: '/api/health'
    },
    frontend: 'http://localhost:5173'
  });
});

// API: Get all news
app.get('/api/news', (req, res) => {
  const data = loadNews();
  if (data) {
    res.json(data);
  } else {
    res.json({ lastUpdated: null, categories: {} });
  }
});

// API: Get news by category
app.get('/api/news/:category', (req, res) => {
  const data = loadNews();
  const category = req.params.category;
  if (data?.categories?.[category]) {
    res.json(data.categories[category]);
  } else {
    res.status(404).json({ error: 'Category not found' });
  }
});

// API: Manual refresh
app.post('/api/refresh', async (req, res) => {
  try {
    const data = await fetchAllNews();
    res.json({ success: true, lastUpdated: data.lastUpdated, stats: getStats(data) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API: Health check
app.get('/api/health', (req, res) => {
  const data = loadNews();
  res.json({
    status: 'ok',
    lastUpdated: data?.lastUpdated || 'never',
    categories: data ? Object.keys(data.categories) : []
  });
});

function getStats(data) {
  const stats = {};
  if (data?.categories) {
    for (const [key, cat] of Object.entries(data.categories)) {
      stats[key] = cat.news?.length || 0;
    }
  }
  return stats;
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AI News Server running on http://localhost:${PORT}`);

  // Start the scheduler
  startScheduler();

  // Fetch news on startup if no data exists
  const existingData = loadNews();
  if (!existingData) {
    console.log('📡 No existing data found, fetching news...');
    fetchAllNews().catch(err => console.error('Initial fetch failed:', err.message));
  } else {
    const lastUpdated = new Date(existingData.lastUpdated);
    const hoursSinceUpdate = (Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60);
    if (hoursSinceUpdate > 12) {
      console.log('📡 Data is older than 12 hours, refreshing...');
      fetchAllNews().catch(err => console.error('Refresh failed:', err.message));
    } else {
      console.log(`📦 Using cached data (last updated: ${lastUpdated.toLocaleString()})`);
    }
  }
});