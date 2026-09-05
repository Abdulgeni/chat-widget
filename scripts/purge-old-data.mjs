import { purgeOldData } from '../lib/db/db.mjs';

const days = Number(process.argv[2]) || 30;
const result = purgeOldData(days);
console.log(`[retention] purged data older than ${days} days:`, result);