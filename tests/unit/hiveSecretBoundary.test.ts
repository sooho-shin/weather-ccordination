import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { onRequestPost as fluxPost } from '../../functions/api/ai/flux';
import { onRequestPost as deepseekPost } from '../../functions/api/ai/deepseek';
import { buildItemImagePrompt } from '../../src/utils/promptBuilder';

for (const [name, handler] of [['flux', fluxPost], ['deepseek', deepseekPost]] as const) {
  test(`${name}: missing server secret fails without contacting Hive`, async () => {
    const previous = globalThis.fetch;
    let calls = 0;
    globalThis.fetch = async () => { calls++; throw new Error('Unexpected network'); };
    try {
      const response = await handler({
        request: new Request('https://example.test', { method: 'POST', body: '{}' }),
        env: { EXPO_PUBLIC_HIVE_SECRET_KEY: 'unused-public-test-value' },
      });
      assert.equal(response.status, 503);
      assert.equal(calls, 0);
      assert.match((await response.json()).error, /HIVE_SECRET_KEY/);
    } finally { globalThis.fetch = previous; }
  });
  test(`${name}: server secret authorizes only the upstream request`, async () => {
    const previous = globalThis.fetch;
    let calls = 0;
    globalThis.fetch = async (url, options) => {
      calls++;
      assert.equal(new URL(String(url)).hostname, 'api-cdn.thehive.ai');
      assert.equal(new Headers(options?.headers).get('Authorization'), 'Bearer test-server-only');
      return new Response('{"ok":true}', { status: 200 });
    };
    try {
      const response = await handler({
        request: new Request('https://example.test', { method: 'POST', body: '{}' }),
        env: { HIVE_SECRET_KEY: 'test-server-only' },
      });
      assert.equal(response.status, 200);
      assert.equal(calls, 1);
      assert.equal(response.headers.has('Authorization'), false);
      assert.equal((await response.text()).includes('test-server-only'), false);
    } finally { globalThis.fetch = previous; }
  });
}

function loadClient(file: string, platform: string, fetch: typeof globalThis.fetch) {
  const exports: any = {};
  const context = {
    exports, window: {}, process: { env: { EXPO_PUBLIC_HIVE_SECRET_KEY: 'must-not-be-used' } },
    fetch, AbortController, setTimeout, clearTimeout, console,
    require: (id: string) => {
      if (id === 'react-native') return { Platform: { OS: platform } };
      if (id.includes('framingStandards')) return { MASTER_FULLBODY_PROMPT_DIRECTIVE: 'Full body.' };
      if (id.includes('temperatureBands')) return { getTemperatureBand: () => ({ id: 'mild' }) };
      if (id.includes('presetLookbooks')) return { findMatchingLookbooks: () => [{ imageUrl: 'preset.jpg' }] };
      if (id.includes('fluxService')) return { generateFashionImageWithFlux: async () => ({ success: false }) };
      if (id.includes('promptBuilder')) return { buildItemImagePrompt };
      throw new Error('Unexpected dependency');
    },
  };
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, context);
  return exports;
}

test('web Flux uses same-origin proxy without any credential', async () => {
  let calls = 0;
  const client = loadClient('src/services/ai/fluxService.ts', 'web', async (url, options) => {
    calls++;
    assert.equal(url, '/api/ai/flux');
    assert.equal(new Headers(options?.headers).has('Authorization'), false);
    return new Response('{"output":[{"url":"https://example.test/image.png"}]}');
  });
  assert.equal((await client.generateFashionImageWithFlux('test')).success, true);
  assert.equal(calls, 1);
});

test('web DeepSeek is configured without client key and sends only proxy request', async () => {
  let calls = 0;
  const client = loadClient('src/services/ai/deepseekService.ts', 'web', async (url, options) => {
    calls++;
    assert.equal(url, '/api/ai/deepseek');
    assert.equal(new Headers(options?.headers).has('Authorization'), false);
    return new Response(JSON.stringify({ choices: [{ message: { content: '{"styleTitle":"Test","items":[{"category":"top","name":"셔츠"}]}' } }] }));
  });
  assert.equal(client.isDeepSeekConfigured(), true);
  assert.equal('apiKey' in client.getDeepSeekConfig(), false);
  const result = await client.generateOotdWithDeepSeek({ temperature: 20, weatherState: 'Clear' }, 'daily', 'female');
  assert.equal(result.success, true);
  assert.equal(calls, 1);
});

for (const platform of ['ios', 'android']) {
  test(`${platform}: native clients never call Hive or embed a key`, async () => {
    let calls = 0;
    const fetchMock = async () => { calls++; throw new Error('Unexpected network'); };
    const flux = loadClient('src/services/ai/fluxService.ts', platform, fetchMock);
    const deepseek = loadClient('src/services/ai/deepseekService.ts', platform, fetchMock);
    assert.equal(deepseek.isDeepSeekConfigured(), false);
    assert.equal((await flux.generateFashionImageWithFlux('test')).success, false);
    const result = await deepseek.generateOotdWithDeepSeek({}, 'daily', 'female');
    assert.equal(result.success, false);
    assert.match(result.errorMessage, /웹/);
    assert.equal(calls, 0);
  });
}
