import test from 'node:test';
import assert from 'node:assert/strict';
import { checkRateLimit } from '../lib/security/rateLimiter.mjs';

test('allows up to the limit then blocks', () => {
  const key = 'test-key-' + Date.now();
  let lastResult = true;
  for (let i = 0; i < 10; i++) {
    lastResult = checkRateLimit(key);
  }
  assert.equal(lastResult, true, '10th call should still be allowed');
  assert.equal(checkRateLimit(key), false, '11th call should be blocked');
});

test('different keys have independent limits', () => {
  const keyA = 'a-' + Date.now();
  const keyB = 'b-' + Date.now();
  for (let i = 0; i < 10; i++) checkRateLimit(keyA);
  assert.equal(checkRateLimit(keyB), true);
});