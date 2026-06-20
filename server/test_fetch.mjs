import { fetchAllNews } from './fetcher.js';

fetchAllNews()
  .then(() => { console.log('Done!'); process.exit(0); })
  .catch(e => { console.error(e); process.exit(1); });