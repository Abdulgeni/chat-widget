import { upsertWidgetConfig } from '../lib/db/db.mjs';

upsertWidgetConfig('test-app', ['*'], { primaryColor: '#2563eb' });
console.log('Seeded widget config for test-app (allowed: *)');