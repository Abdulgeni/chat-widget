import * as Sentry from '@sentry/node';

let initialized = false;

export function initSentry() {
  if (initialized) return;
  if (!process.env.SENTRY_DSN) {
    console.warn('[monitoring] SENTRY_DSN not set — error tracking disabled (fine for local dev).');
    return;
  }
  Sentry.init({ dsn: process.env.SENTRY_DSN, tracesSampleRate: 0.1 });
  initialized = true;
}

export function captureError(err, context) {
  if (initialized) Sentry.captureException(err, { extra: context });
}