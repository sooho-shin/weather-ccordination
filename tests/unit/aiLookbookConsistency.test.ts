import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';
import { buildItemImagePrompt, buildOutfitPrompt } from '../../src/utils/promptBuilder';
import { OutfitItem } from '../../src/types/outfit';
import { MASTER_FULLBODY_PROMPT_DIRECTIVE } from '../../src/constants/framingStandards';

const require = createRequire(import.meta.url);
const items: OutfitItem[] = [
  { id: 'coat', category: 'outer', name: '네이비 울 자켓', iconName: 'shirt-outline', imageDescription: 'navy wool jacket' },
  { id: 'bag', category: 'accessory', name: '스트럭처드 레더 토트백', iconName: 'bag-handle-outline', imageDescription: 'structured brown leather tote bag' },
  { id: 'glasses', category: 'accessory', name: '선글라스', iconName: 'glasses-outline' },
  { id: 'umbrella', category: 'accessory', name: '우산', iconName: 'umbrella-outline' },
];
const preset = { id: 'preset', imageUrl: 'preset.jpg', items, imageSource: 'preset' };
const weather = { temperature: 13, weatherState: 'Clear' };
type Flux = (prompt: string) => Promise<{ success: boolean; imageUrl?: string }>;

function load(file: string, dependencies: Record<string, unknown>, fetchOverride?: typeof fetch) {
  const exports: any = {};
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  vm.runInNewContext(code, {
    exports, process: { env: {} }, window: {}, AbortController, setTimeout, clearTimeout,
    console: { ...console, warn: () => {} },
    fetch: fetchOverride || (async () => new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify({
      items, imagePrompt: 'unrelated pink dress',
    }) } }] }))),
    require: (id: string) => {
      if (id in dependencies) return dependencies[id];
      if (id === './session') return { ensureAiSession: async () => {}, aiErrorMessage: async () => 'test error' };
      if (id.includes('promptBuilder')) return { buildItemImagePrompt, buildOutfitPrompt };
      if (id.includes('temperatureBands')) return { getTemperatureBand: () => ({ id: 'mild' }) };
      if (id.includes('presetLookbooks')) return { findMatchingLookbooks: () => [preset] };
      return require(id);
    },
  });
  return exports;
}

function service(file: string, flux: Flux) {
  return load(file, {
    'react-native': { Platform: { OS: 'web' } },
    './fluxService': { generateFashionImageWithFlux: flux },
  });
}

test('every recommended item and accessory pose reaches the image prompt', async () => {
  let sentPrompt = '';
  const client = service('src/services/ai/deepseekService.ts', async (prompt) => {
    sentPrompt = prompt;
    return { success: true, imageUrl: 'generated.jpg' };
  });
  const result = await client.generateOotdWithDeepSeek(weather, 'office', 'female');
  assert.equal(result.success, true);
  for (const item of items) assert.ok(sentPrompt.includes(item.imageDescription || item.name));
  assert.match(sentPrompt, /structured brown leather tote bag/);
  assert.match(sentPrompt, /one hand beside the hip/);
  assert.match(sentPrompt, /on the face/);
  assert.match(sentPrompt, /Hold 우산/);
  assert.ok(!sentPrompt.includes('unrelated pink dress'));
  assert.equal(result.lookbook.imageSource, 'ai');
  assert.equal(result.lookbook.imageGenerationFailed, false);
});

test('image-only retry preserves the recommendation and never calls DeepSeek again', async () => {
  let recommendationCalls = 0;
  let imageCalls = 0;
  const stages: unknown[] = [];
  const client = load('src/services/ai/deepseekService.ts', {
    'react-native': { Platform: { OS: 'web' } },
    './fluxService': { generateFashionImageWithFlux: async () => {
      imageCalls++;
      return imageCalls === 1 ? { success: false, errorMessage: 'Temporary failure' } : { success: true, imageUrl: 'retried.jpg' };
    } },
  }, async () => {
    recommendationCalls++;
    return new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify({ styleTitle: 'Keep this title', items }) } }] }));
  });
  const first = await client.generateOotdWithDeepSeek(weather, 'office', 'female', undefined, (stage: unknown) => stages.push(stage));
  assert.equal(first.lookbook.imageGenerationFailed, true);
  const retried = await client.retryLookbookImage(first.lookbook);
  assert.equal(retried.imageGenerationFailed, false);
  assert.equal(retried.imageUrl, 'retried.jpg');
  assert.equal(retried.styleTitle, first.lookbook.styleTitle);
  assert.equal(retried.items, first.lookbook.items);
  assert.equal(recommendationCalls, 1);
  assert.equal(imageCalls, 2);
  assert.equal(stages[0], 'recommendation');
  assert.ok(stages.includes('image'));
  assert.equal(stages.at(-1), null);
});

test('image descriptions stay concise and a scarf mentioning a bag is still worn', () => {
  const prompt = buildItemImagePrompt([
    { ...items[1], imageDescription: 'brown leather tote bag ' + 'detailed '.repeat(80) },
    { id: 'scarf', category: 'accessory', name: '캐시미어 머플러', description: '가방에 걸어도 좋아요', imageDescription: 'ivory cashmere scarf', iconName: 'ribbon-outline' },
  ], 'female');
  assert.match(prompt, /Carry brown leather tote bag/);
  assert.match(prompt, /Wear ivory cashmere scarf/);
  assert.ok(!prompt.includes('Carry ivory cashmere scarf'));
  assert.ok(prompt.length < 600);
});

test('six detailed items and framing fit in a compact Flux request without omitting items', () => {
  const sixItems = ['outer', 'top', 'bottom', 'shoes', 'accessory', 'accessory'].map((category, i) => ({
    id: String(i), category, name: i === 4 ? '레더 토트백' : '아이템', iconName: 'shirt-outline',
    imageDescription: `item${i} ` + 'navy wool detailed fabric '.repeat(20),
  })) as OutfitItem[];
  const prompt = MASTER_FULLBODY_PROMPT_DIRECTIVE + ' Outfit details: ' + buildItemImagePrompt(sixItems, 'female');
  assert.ok(prompt.length <= 1024);
  for (let i = 0; i < 6; i++) assert.ok(prompt.includes(`item${i}`));
});

for (const [name, flux] of [
  ['failure', async () => ({ success: false })],
  ['exception', async () => { throw new Error('timeout'); }],
] as const) {
  test(`DeepSeek preserves recommendations and marks the reference photo after ${name}`, async () => {
    const client = service('src/services/ai/deepseekService.ts', flux);
    const result = await client.generateOotdWithDeepSeek(weather, 'office', 'female');
    assert.equal(result.success, true);
    assert.equal(result.lookbook.imageUrl, 'preset.jpg');
    assert.equal(result.lookbook.imageSource, 'preset');
    assert.equal(result.lookbook.imageGenerationFailed, true);
    assert.equal(result.lookbook.items[1].name, items[1].name);
  });

  test(`secondary generation also flags the reference photo after ${name}`, async () => {
    const client = service('src/services/ai/envImageGenerationService.ts', flux);
    const result = await client.defaultImageGenerationService.generateOutfit({ gender: 'female', ...weather });
    assert.equal(result.isFallback, true);
    assert.equal(result.lookbook.imageUrl, 'preset.jpg');
    assert.equal(result.lookbook.imageSource, 'preset');
    assert.equal(result.lookbook.imageGenerationFailed, true);
  });
}

test('fallback notice is visible only for a failed generation, including when a lookbook is reapplied', () => {
  const ui = load('src/components/StyleGuideSheet.tsx', {
    // 렌더러 없이 컴포넌트를 함수로 직접 호출하므로 훅은 초기값만 돌려주는 스텁으로 대체
    react: { ...require('react'), useState: (init: unknown) => [typeof init === 'function' ? (init as () => unknown)() : init, () => {}] },
    'react-native': { View: 'View', Text: 'Text', ScrollView: 'ScrollView', TouchableOpacity: 'Button', ActivityIndicator: 'Spinner', Platform: { select: (x: any) => x.web } , StyleSheet: { create: (x: unknown) => x } },
    'expo-blur': { BlurView: 'BlurView' },
    '@expo/vector-icons': { Ionicons: 'Icon' },
    './OutfitItemCard': { OutfitItemCard: 'Item' },
  });
  function collect(node: any, predicate: (value: any) => boolean): any[] {
    if (!node || typeof node !== 'object') return [];
    if (Array.isArray(node)) return node.flatMap((child) => collect(child, predicate));
    return [...(predicate(node) ? [node] : []), ...collect(node.props?.children, predicate)];
  }
  for (const failed of [true, false]) {
    const tree = ui.StyleGuideSheet({ lookbook: { ...preset, imageGenerationFailed: failed }, currentIndex: 0, totalCount: 1 });
    const notices = collect(tree, (node) => node.props?.accessibilityRole === 'alert');
    assert.equal(notices.length, failed ? 1 : 0);
    if (failed) assert.match([notices[0].props.children].flat().join(''), /이미지 생성에 실패해 기존 사진으로 대체/);
    const badges = collect(tree, (node) => node.props?.children === '기존 사진 · 참고용');
    assert.equal(badges.length, failed ? 1 : 0);
  }
});
