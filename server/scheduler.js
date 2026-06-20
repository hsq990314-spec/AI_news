import cron from 'node-cron';
import { fetchAllNews } from './fetcher.js';

// Schedule news fetch every day at 7:00 AM (China Standard Time)
export function startScheduler() {
  console.log('⏰ Starting scheduler: news fetch at 07:00 AM (CST) daily');

  const task = cron.schedule('0 7 * * *', async () => {
    console.log('⏰ Scheduled fetch triggered at', new Date().toISOString());
    try {
      await fetchAllNews();
    } catch (error) {
      console.error('❌ Scheduled fetch failed:', error.message);
    }
  }, {
    scheduled: true,
    timezone: 'Asia/Shanghai'
  });

  console.log('✅ Scheduler started successfully');
  return task;
}
