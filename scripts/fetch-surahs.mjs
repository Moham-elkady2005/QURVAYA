/**
 * Generates src/data/surahs.json from the AlQuran Cloud API.
 * Run with: node scripts/fetch-surahs.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const output = resolve(__dirname, '..', 'src', 'data', 'surahs.json');

const response = await fetch('https://api.alquran.cloud/v1/surah');
if (!response.ok) {
  throw new Error(`API responded with ${response.status}`);
}

const payload = await response.json();
const surahs = payload.data.map((surah) => ({
  number: surah.number,
  name: surah.name.replace(/^سُورَةُ\s*/, ''),
  englishName: surah.englishName,
  englishNameTranslation: surah.englishNameTranslation,
  numberOfAyahs: surah.numberOfAyahs,
  revelationType: surah.revelationType,
}));

await mkdir(dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(surahs, null, 2)}\n`, 'utf8');
console.log(`Wrote ${surahs.length} surahs to ${output}`);
