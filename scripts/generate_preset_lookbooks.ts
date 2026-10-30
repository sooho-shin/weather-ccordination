// 프리셋 룩북마다 그 카드의 아이템 글로 Flux 사진을 만들어 assets/lookbooks/<id>.jpg 로 저장합니다.
// 실행: HIVE_SECRET_KEY=... npx tsx scripts/generate_preset_lookbooks.ts [preset-id ...]
import fs from 'fs';
import path from 'path';
import { buildItemImagePrompt } from '../src/utils/promptBuilder';
import { MASTER_FULLBODY_PROMPT_DIRECTIVE } from '../src/constants/framingStandards';
import type { OutfitLookbook } from '../src/types/outfit';

const API_KEY = process.env.HIVE_SECRET_KEY;
if (!API_KEY) throw new Error('HIVE_SECRET_KEY must be explicitly supplied');
const HIVE = 'https://api-cdn.thehive.ai/api/v3';
const OUT_DIR = path.join(__dirname, '../assets/lookbooks');

// 프리셋 파일의 이미지 require 를 Node 에서 불러올 수 있게 경로 문자열로 대체합니다.
require.extensions['.jpg'] = (module) => { module.exports = module.filename; };
const { PRESET_LOOKBOOKS } = require('../src/data/presetLookbooks') as { PRESET_LOOKBOOKS: OutfitLookbook[] };

async function hive(endpoint: string, body: unknown) {
  const res = await fetch(`${HIVE}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${endpoint} ${res.status}: ${await res.text()}`);
  return res.json();
}

// Flux 는 한국어 아이템명을 잘 못 그리므로, 앱의 DeepSeek 와 같은 형식(영어 imageDescription)으로 바꿉니다.
async function describeItems(lookbook: OutfitLookbook): Promise<string[]> {
  const items = lookbook.items.map((item) => `${item.category}: ${item.name} — ${item.description}`).join('\n');
  const data = await hive('chat/completions', {
    model: 'deepseek-ai/deepseek-v4.1-flash-1017',
    messages: [
      { role: 'system', content: 'For each outfit item, write an English visual description: item type first, then color, material and shape, 6-10 words, under 60 characters. Keep the exact colors and garments given. Output only a JSON array of exactly one string per item line, in the same order.' },
      { role: 'user', content: `Translate into English descriptions, one per line:\n${items}` },
    ],
    temperature: 0.2,
    reasoning_effort: 'none',
    max_completion_tokens: 800,
  });
  const text: string = data.choices?.[0]?.message?.content ?? '';
  const parsed = JSON.parse(text.match(/\[[\s\S]*\]/)?.[0] ?? '[]');
  if (!Array.isArray(parsed) || parsed.length !== lookbook.items.length) throw new Error(`설명 개수 불일치: ${text}`);
  return parsed.map(String);
}

async function generate(lookbook: OutfitLookbook) {
  const descriptions = await describeItems(lookbook);
  const items = lookbook.items.map((item, i) => ({ ...item, imageDescription: descriptions[i] }));
  const prompt = `${MASTER_FULLBODY_PROMPT_DIRECTIVE} Outfit details: ${buildItemImagePrompt(items, lookbook.gender)}`.slice(0, 1024);
  const data = await hive('black-forest-labs/flux-schnell', {
    input: { prompt, num_images: 1, image_size: { width: 768, height: 1344 }, num_inference_steps: 4, output_format: 'jpeg', output_quality: 85 },
  });
  const url = data?.output?.[0]?.url;
  if (!url) throw new Error(`이미지 URL 없음: ${JSON.stringify(data)}`);
  const img = await fetch(url);
  if (!img.ok) throw new Error(`다운로드 실패 ${img.status}`);
  fs.writeFileSync(path.join(OUT_DIR, `${lookbook.id}.jpg`), Buffer.from(await img.arrayBuffer()));
  console.log(`✔ ${lookbook.id}  ${descriptions.join(' | ')}`);
}

async function main() {
  const only = process.argv.slice(2);
  const targets = only.length ? PRESET_LOOKBOOKS.filter((l) => only.includes(l.id)) : PRESET_LOOKBOOKS;
  const failed: string[] = [];
  for (const lookbook of targets) {
    try { await generate(lookbook); } catch (error) { failed.push(lookbook.id); console.error(`✘ ${lookbook.id}`, error); }
  }
  if (failed.length) { console.error(`실패: ${failed.join(' ')}`); process.exit(1); }
}

main();
