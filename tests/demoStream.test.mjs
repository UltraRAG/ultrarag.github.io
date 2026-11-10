import test from 'node:test';
import assert from 'node:assert/strict';
import {startDemoStream} from '../src/utils/demoStream.mjs';

test('leaving a chat during thinking prevents a late response', t => {
  t.mock.timers.enable({apis: ['setTimeout', 'setInterval']});
  const updates = [];
  const cancel = startDemoStream({content: 'sample'}, {
    onChunk: value => updates.push(value), onComplete: value => updates.push(value),
  });
  t.mock.timers.tick(400);
  cancel();
  t.mock.timers.tick(10000);
  assert.deepEqual(updates, []);
});

test('switching sessions while streaming stops chunks and completion', t => {
  t.mock.timers.enable({apis: ['setTimeout', 'setInterval']});
  const chunks = [];
  let completed = false;
  const cancel = startDemoStream({content: 'a longer sample response'}, {
    onChunk: value => chunks.push(value.content), onComplete: () => { completed = true; },
  });
  t.mock.timers.tick(800);
  t.mock.timers.tick(18);
  assert.deepEqual(chunks, ['', 'a l']);
  cancel();
  t.mock.timers.tick(10000);
  assert.equal(chunks.length, 2);
  assert.equal(completed, false);
});

test('a completed stream preserves response metadata', t => {
  t.mock.timers.enable({apis: ['setTimeout', 'setInterval']});
  const response = {content: 'sample', steps: [{name: 'Retrieval'}], sources: [{id: 1}]};
  let result;
  startDemoStream(response, {onChunk: () => {}, onComplete: value => { result = value; }});
  t.mock.timers.tick(800);
  t.mock.timers.tick(36);
  assert.deepEqual(result, response);
});
