import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeText } from '../lib/security/sanitize.mjs';

test('strips HTML tags', () => {
  assert.equal(sanitizeText('<script>alert(1)</script>hello'), 'alert(1)hello');
});

test('caps length at 4000 chars', () => {
  const long = 'a'.repeat(5000);
  assert.equal(sanitizeText(long).length, 4000);
});

test('handles null/undefined gracefully', () => {
  assert.equal(sanitizeText(null), '');
  assert.equal(sanitizeText(undefined), '');
});