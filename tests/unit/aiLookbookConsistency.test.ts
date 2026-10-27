import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';
import { buildItemImagePrompt, buildOutfitPrompt } from '../../src/utils/promptBuilder';
import { OutfitItem } from '../../src/types/outfit';

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

function load(file: string, dependencies: Record<string, unknown>) {
  const exports: any = {};
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  vm.runInNewContext(code, {
    exports, process: { env: {} }, window: {}, AbortController, setTimeout, clearTimeout,
    console: { ...console, warn: () => {} },
    fetch: async () => new Response(JSON.stringify({ choices: [{ message: { content: JSON.stringify({
      items, imagePrompt: 'unrelated pink dress',
    }) } }] })),
    require: (id: string) => {
      if (id in dependencies) return dependencies[id];
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
  for (const item of items) assert.ok(sentPrompt.includes(item.name));
  assert.match(sentPrompt, /structured brown leather tote bag/);
  assert.match(sentPrompt, /one hand beside the hip or over the shoulder/);
  assert.match(sentPrompt, /on the face/);
  assert.match(sentPrompt, /Hold 우산/);
  assert.ok(!sentPrompt.includes('unrelated pink dress'));
  assert.equal(result.lookbook.imageSource, 'ai');
  assert.equal(result.lookbook.imageGenerationFailed, false);
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
    if (failed) assert.match(notices[0].props.children, /이미지 생성에 실패해 기존 사진으로 대체/);
    const badges = collect(tree, (node) => node.props?.children === '기존 사진 · 참고용');
    assert.equal(badges.length, failed ? 1 : 0);
  }
});
