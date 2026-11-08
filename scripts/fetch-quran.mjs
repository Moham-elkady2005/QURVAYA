/**
 * Downloads the Uthmani text of all 114 surahs from AlQuran Cloud and stores it
 * in src/data/quran.json so builds are fast, deterministic and never rate-limited.
 *
 * Run with: node scripts/fetch-quran.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const output = resolve(__dirname, '..', 'src', 'data', 'quran.json');

const sleep = (ms) => new Promise((resolvePromise) => setTimeout(resolvePromise, ms));

async function fetchJson(url, attempts = 7) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const response = await fetch(url, { headers: { Accept: 'application/json' } });

    if (response.ok) {
      const payload = await response.json();
      if (payload.code !== 200 || !payload.data?.ayahs?.length) {
        throw new Error(`Invalid payload for ${url}`);
      }
      return payload;
    }

    if (response.status === 429 || response.status >= 500) {
      const wait = 1500 * attempt;
      console.warn(`  ${response.status} — retrying in ${wait}ms (attempt ${attempt}/${attempts})`);
      await sleep(wait);
      continue;
    }

    throw new Error(`Request failed with ${response.status}: ${url}`);
  }

  throw new Error(`Giving up after ${attempts} attempts: ${url}`);
}

const surahs = {};

for (let number = 1; number <= 114; number += 1) {
  const payload = await fetchJson(
    `https://api.alquran.cloud/v1/surah/${number}/quran-uthmani`,
  );

  surahs[number] = {
    number,
    ayahs: payload.data.ayahs.map((ayah) => ({
      number: ayah.number,
      text: ayah.text,
      numberInSurah: ayah.numberInSurah,
      juz: ayah.juz,
      page: ayah.page,
      sajda: ayah.sajda,
    })),
  };

  console.log(`surah ${number}/114 (${payload.data.ayahs.length} ayahs)`);
  await sleep(180);
}

await mkdir(dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(surahs)}\n`, 'utf8');

console.log(`\nWrote ${Object.keys(surahs).length} surahs to ${output}`);
