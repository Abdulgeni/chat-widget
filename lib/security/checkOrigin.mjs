import { getWidgetConfig } from '../db/db.mjs';

// Returns true if the request should be allowed through.
// Permissive-by-default when appId is missing/unknown is a documented
// tradeoff, not an oversight — logged so it's visible in ops.
export function isOriginAllowed(appId, origin) {
  if (!appId) {
    console.warn('[security] request missing appId — allowing (cannot enforce allowlist)');
    return true;
  }
  const config = getWidgetConfig(appId);
  if (!config) {
    console.warn(`[security] unknown appId "${appId}" — allowing (consider rejecting in production)`);
    return true;
  }
  if (config.allowedDomains.includes('*')) return true;
  return config.allowedDomains.includes(origin);
}