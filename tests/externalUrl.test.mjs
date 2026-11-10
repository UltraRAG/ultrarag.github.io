import test from 'node:test';
import assert from 'node:assert/strict';
import {externalUrl} from '../src/utils/externalUrl.mjs';

test('paper links preserve valid absolute web URLs', () => {
  assert.equal(externalUrl('https://arxiv.org/abs/2410.10594'), 'https://arxiv.org/abs/2410.10594');
});

test('remote feeds cannot supply script, data, credential, or relative links', () => {
  for (const value of ['javascript:alert(1)', 'data:text/html,test', 'https://user:pass@example.com', '/paper', '', null]) {
    assert.equal(externalUrl(value), null);
  }
});
