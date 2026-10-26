const fs = require('fs');
const path = require('path');

const API_KEY = process.env.EXPO_PUBLIC_HIVE_SECRET_KEY || '';
const ENDPOINT = 'https://api-cdn.thehive.ai/api/v3/black-forest-labs/flux-schnell';

const BASE_DIRECTIVE = 'Master high-fashion catalog lookbook photograph. Full-body head-to-toe shot of a stylish 20s Korean model standing upright, facing camera directly, centered in 9:16 vertical frame. Full length body visible from top of head to bottom of shoes. 8k photorealistic.';

const LOOKBOOKS_TO_GENERATE = [
  {
    filename: 'female_autumn_14c_2.jpg',
    gender: 'female',
    outfit: 'Wearing black vintage vegan leather jacket, soft gray fine knit top, deep indigo A-line maxi denim skirt, black leather chelsea ankle boots.',
  },
  {
    filename: 'female_autumn_14c_3.jpg',
    gender: 'female',
    outfit: 'Wearing heavy olive khaki lambswool zip-up cardigan, charcoal gray pintuck wide-leg trousers, white minimal leather retro sneakers.',
  },
  {
    filename: 'female_autumn_14c_4.jpg',
    gender: 'female',
    outfit: 'Wearing camel beige raglan single mac trench coat, cream crewneck knit sweater, ivory straight wide slacks, burgundy leather penny loafers.',
  },
  {
    filename: 'female_autumn_14c_5.jpg',
    gender: 'female',
    outfit: 'Wearing cream boa fleece jacket, slim fit ivory top, slate gray nylon parachute cargo pants, technical trail running sneakers.',
  },
  {
    filename: 'male_autumn_14c_1.jpg',
    gender: 'male',
    outfit: 'Wearing oversized charcoal herringbone tweed wool jacket, fine merino wool knit sweater, relaxed tapered wool slacks, classic black leather derby shoes.',
  },
  {
    filename: 'male_autumn_14c_2.jpg',
    gender: 'male',
    outfit: 'Wearing midnight navy single mac coat, navy striped knit sweater, beige straight chino pants, dark brown leather penny loafers.',
  },
  {
    filename: 'male_autumn_14c_3.jpg',
    gender: 'male',
    outfit: 'Wearing heather gray half-zip heavy sweatshirt, white layered t-shirt underneath, raw deep indigo wide denim pants, retro runner sneakers.',
  },
];

async function generateAndSave(item) {
  const genderWord = item.gender === 'female' ? 'female' : 'male';
  const prompt = BASE_DIRECTIVE.replace('Korean model', `Korean ${genderWord} model`) + ' ' + item.outfit;

  console.log(`Generating ${item.filename}...`);
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      input: {
        prompt: prompt,
        image_size: {
          width: 768,
          height: 1344,
        },
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Failed to generate ${item.filename}: ${response.status} - ${errText}`);
  }

  const data = await response.json();
  const imageUrl = data?.output?.[0]?.url || data?.output?.url;
  if (!imageUrl) {
    throw new Error(`No image URL returned for ${item.filename}: ${JSON.stringify(data)}`);
  }

  console.log(`Downloading ${item.filename} from ${imageUrl.slice(0, 80)}...`);
  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) throw new Error(`Download failed: ${imgRes.status}`);

  const buffer = Buffer.from(await imgRes.arrayBuffer());
  const destPath = path.join(__dirname, '../assets/lookbooks', item.filename);
  fs.writeFileSync(destPath, buffer);
  console.log(`✔ Saved ${item.filename} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`);
}

async function main() {
  for (const item of LOOKBOOKS_TO_GENERATE) {
    try {
      await generateAndSave(item);
    } catch (err) {
      console.error(`Error processing ${item.filename}:`, err);
    }
  }
  console.log('All remaining autumn lookbooks generated!');
}

main();
