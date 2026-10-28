import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function client(options: { blocked?: boolean; quota?: boolean; initial?: string; imageFails?: boolean } = {}) {
  const values = new Map<string, string>();
  if (options.initial) values.set('dize_saved_wardrobe', options.initial);
  const calls: string[] = [];
  const exports: any = {};
  const localStorage = {
    getItem: (key: string) => {
      if (options.blocked) throw new Error('Storage blocked');
      return values.get(key) || null;
    },
    setItem: (key: string, value: string) => {
      if (options.quota) { const error = new Error('Quota'); error.name = 'QuotaExceededError'; throw error; }
      values.set(key, value);
    },
  };
  class Reader {
    result = '';
    onload?: () => void;
    onerror?: () => void;
    async readAsDataURL(blob: Blob) {
      this.result = `data:${blob.type};base64,${Buffer.from(await blob.arrayBuffer()).toString('base64')}`;
      this.onload?.();
    }
  }
  vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/services/wardrobeService.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, {
    exports, window: { localStorage }, AbortSignal, FileReader: Reader,
    require: () => ({ ensureAiSession: async () => {}, aiErrorMessage: async () => '사진 보관 실패' }),
    fetch: async (url: string) => {
      calls.push(url);
      return new Response('photo-bytes', { status: options.imageFails ? 503 : 200, headers: { 'Content-Type': 'image/jpeg' } });
    },
  });
  return { api: exports, values, calls };
}
const outfit = { id: 'my-outfit', styleTitle: '토트백 코디', imageUrl: 'https://example.test/expiring.jpg', imageSource: 'ai', items: [], imageGenerationFailed: false };

test('save persists photo bytes and metadata, lists after reload and deletes locally', async () => {
  const first = client();
  assert.equal((await first.api.saveOutfitToWardrobe(outfit, {})).success, true);
  const stored = first.values.get('dize_saved_wardrobe')!;
  assert.match(JSON.parse(stored)[0].imageUrl, /^data:image\/jpeg;base64,/);
  const reloaded = client({ initial: stored });
  const list = await reloaded.api.fetchWardrobeOutfits();
  assert.equal(list[0].styleTitle, outfit.styleTitle);
  assert.equal(list[0].imageSource, 'ai');
  assert.equal(await reloaded.api.deleteOutfitFromWardrobe(outfit.id), true);
  assert.equal((await reloaded.api.fetchWardrobeOutfits()).length, 0);
  assert.deepEqual(first.calls, [outfit.imageUrl]);
  assert.deepEqual(reloaded.calls, []);
});

test('storage quota errors and blocked storage never report successful saves', async () => {
  for (const options of [{ quota: true }, { blocked: true }, { imageFails: true }]) {
    const { api } = client(options);
    const result = await api.saveOutfitToWardrobe(outfit, {});
    assert.equal(result.success, false);
    assert.ok(result.errorMessage);
  }
});

test('Hive photos use the protected same-origin copy endpoint rather than a CORS-blocked direct request', async () => {
  const { api, calls } = client();
  const generated = { ...outfit, imageUrl: 'https://hive-data-prod-cdn.thehive.ai/image_generation/test/photo.jpg' };
  assert.equal((await api.saveOutfitToWardrobe(generated)).success, true);
  assert.deepEqual(calls, ['/api/ai/photo']);
});

test('failed deletion leaves the stored outfit visible', async () => {
  const { api, values } = client({ initial: JSON.stringify([outfit]), quota: true });
  assert.equal(await api.deleteOutfitFromWardrobe(outfit.id), false);
  assert.equal(JSON.parse(values.get('dize_saved_wardrobe')!)[0].id, outfit.id);
});

test('corrupt stored data is preserved instead of overwritten with an empty list', async () => {
  const { api, values } = client({ initial: 'not valid JSON' });
  assert.equal((await api.saveOutfitToWardrobe(outfit, {})).success, false);
  assert.equal(values.get('dize_saved_wardrobe'), 'not valid JSON');
  await assert.rejects(api.fetchWardrobeOutfits(), /기존 데이터/);
});
