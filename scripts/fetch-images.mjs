#!/usr/bin/env node
/**
 * Downloads the site's photography into `public/images` so the project ships
 * self-contained with no runtime dependency on a third-party image host.
 *
 * Sources: Unsplash (free to use under the Unsplash License, no attribution
 * required, though credit is appreciated). Every file is validated as a real
 * JPEG before being written, so a broken upstream URL can never produce a
 * broken <img> in the built site.
 *
 * Usage:  npm run images:fetch
 */

import { mkdir, writeFile, readFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'images');

/**
 * Slot → Unsplash photo id. Slots are semantic so components reference intent
 * ("hero-primary") rather than a filename, making assets swappable later.
 * `w` is the delivery width; the CDN downsizes before transfer.
 */
const SLOTS = {
  // --- Hero & editorial -----------------------------------------------------
  'hero-primary': { id: 'photo-1541888946425-d81bb19240f5', w: 2400 },
  'hero-secondary': { id: 'photo-1504307651254-35680f356dfd', w: 2400 },
  'about-overview': { id: 'photo-1486406146926-c627a92ad1ab', w: 1800 },
  'about-intro': { id: 'photo-1581094794329-c8112a89af12', w: 1600 },
  'about-approach': { id: 'photo-1503387762-592deb58ef4e', w: 1600 },
  'about-commitments': { id: 'photo-1541976590-713941681591', w: 1600 },
  'why-primary': { id: 'photo-1581092160562-40aa08e78837', w: 1600 },
  'why-secondary': { id: 'photo-1581091226825-a6a2a5aee158', w: 1400 },
  'contact-primary': { id: 'photo-1487958449943-2429e8be8625', w: 1800 },
  'cta-primary': { id: 'photo-1590069261209-f8e9b8642343', w: 2000 },

  // --- History timeline ----------------------------------------------------
  'history-1': { id: 'photo-1503389152951-9f343605f61e', w: 1200 },
  'history-2': { id: 'photo-1565008447742-97f6f38c985c', w: 1200 },
  'history-3': { id: 'photo-1516216628859-9bccecab13ca', w: 1200 },
  'history-4': { id: 'photo-1567496898669-ee935f5f647a', w: 1200 },

  // --- Team portraits ------------------------------------------------------
  'team-1': { id: 'photo-1560250097-0b93528c311a', w: 900 },
  'team-2': { id: 'photo-1573496359142-b8d87734a5a2', w: 900 },
  'team-3': { id: 'photo-1472099645785-5658abf4ff4e', w: 900 },
  'team-4': { id: 'photo-1580489944761-15a19d654956', w: 900 },
  'team-5': { id: 'photo-1507003211169-0a1dd7228f2d', w: 900 },
  'team-6': { id: 'photo-1494790108377-be9c29b29330', w: 900 },

  // --- Services ------------------------------------------------------------
  'service-general-contracting': { id: 'photo-1621905251189-08b45d6a269e', w: 1400 },
  'service-design-build': { id: 'photo-1481253127861-534498168948', w: 1400 },
  'service-infrastructure': { id: 'photo-1545558014-8692077e9b5c', w: 1400 },
  'service-industrial': { id: 'photo-1531834685032-c34bf0d84c77', w: 1400 },
  'service-project-management': { id: 'photo-1454165804606-c3d57bc86b40', w: 1400 },
  'service-engineering': { id: 'photo-1581092160562-40aa08e78837', w: 1400 },
  'service-renovation': { id: 'photo-1600585154340-be6161a56a0c', w: 1400 },
  'service-mep': { id: 'photo-1581092918056-0c4c3acd3789', w: 1400 },
  'service-quality': { id: 'photo-1581092335397-9583eb92d232', w: 1400 },
  'service-turnkey': { id: 'photo-1512917774080-9991f1c4c750', w: 1400 },

  // --- Project covers ------------------------------------------------------
  'project-1': { id: 'photo-1449157291145-7efd050a4d0e', w: 1600 },
  'project-2': { id: 'photo-1460574283810-2aab119d8511', w: 1600 },
  'project-3': { id: 'photo-1470723710355-95304d8aece4', w: 1600 },
  'project-4': { id: 'photo-1431576901776-e539bd916ba2', w: 1600 },
  'project-5': { id: 'photo-1518005020951-eccb494ad742', w: 1600 },
  'project-6': { id: 'photo-1493397212122-2b85dda8106b', w: 1600 },
  'project-7': { id: 'photo-1545324418-cc1a3fa10c00', w: 1600 },
  'project-8': { id: 'photo-1558618666-fcd25c85cd64', w: 1600 },
  'project-9': { id: 'photo-1590674899484-d5640e854abe', w: 1600 },
  'project-10': { id: 'photo-1621905252507-b35492cc74b4', w: 1600 },
  'project-11': { id: 'photo-1517581177682-a085bb7ffb15', w: 1600 },
  'project-12': { id: 'photo-1508450859948-4e04fabaa4ea', w: 1600 },

  // --- Project gallery (shared pool, assigned per project) -----------------
  'gallery-1': { id: 'photo-1497366754035-f200968a6e72', w: 1400 },
  'gallery-2': { id: 'photo-1497366811353-6870744d04b2', w: 1400 },
  'gallery-3': { id: 'photo-1524758631624-e2822e304c36', w: 1400 },
  'gallery-4': { id: 'photo-1494526585095-c41746248156', w: 1400 },
  'gallery-5': { id: 'photo-1600566753086-00f18fb6b3ea', w: 1400 },
  'gallery-6': { id: 'photo-1600607687920-4e2a09cf159d', w: 1400 },
  'gallery-7': { id: 'photo-1613490493576-7fde63acd811', w: 1400 },
  'gallery-8': { id: 'photo-1580587771525-78b9dba3b914', w: 1400 },
  'gallery-9': { id: 'photo-1502005229762-cf1b2da7c5d6', w: 1400 },
  'gallery-10': { id: 'photo-1560518883-ce09059eeffa', w: 1400 },
  'gallery-11': { id: 'photo-1473163928189-364b2c4e1135', w: 1400 },
  'gallery-12': { id: 'photo-1517048676732-d65bc937f952', w: 1400 },

  // --- News covers ---------------------------------------------------------
  'news-1': { id: 'photo-1521791136064-7986c2920216', w: 1400 },
  'news-2': { id: 'photo-1552664730-d307ca884978', w: 1400 },
  'news-3': { id: 'photo-1567496898669-ee935f5f647a', w: 1400 },
  'news-4': { id: 'photo-1541888946425-d81bb19240f5', w: 1400 },
  'news-5': { id: 'photo-1504307651254-35680f356dfd', w: 1400 },
  'news-6': { id: 'photo-1503387762-592deb58ef4e', w: 1400 },

  // --- Careers / misc ------------------------------------------------------
  'careers-primary': { id: 'photo-1500648767791-00dcc994a43e', w: 1600 },
  'careers-team': { id: 'photo-1544005313-94ddf0286df2', w: 1400 },
  'tenders-primary': { id: 'photo-1454165804606-c3d57bc86b40', w: 1600 },
  'partners-primary': { id: 'photo-1519085360753-af0119f7cbe7', w: 1600 },
  'documents-primary': { id: 'photo-1554224155-6726b3ff858f', w: 1600 },
};

const JPEG_MAGIC = Buffer.from([0xff, 0xd8, 0xff]);

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function download(slot, { id, w }, { force }) {
  const filename = `${slot}.jpg`;
  const target = join(outDir, filename);

  if (!force && (await exists(target))) {
    return { slot, file: filename, status: 'cached' };
  }

  const url =
    `https://images.unsplash.com/${id}` +
    `?w=${w}&q=72&fm=jpg&fit=crop&auto=format&cs=tinysrgb`;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'meridian-site-builder/1.0' },
        signal: AbortSignal.timeout(45_000),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const buffer = Buffer.from(await response.arrayBuffer());

      if (buffer.length < 4096) {
        throw new Error(`suspiciously small payload (${buffer.length} bytes)`);
      }
      if (!buffer.subarray(0, 3).equals(JPEG_MAGIC)) {
        throw new Error('payload is not a JPEG');
      }

      await writeFile(target, buffer);
      return { slot, file: filename, status: 'downloaded', bytes: buffer.length };
    } catch (error) {
      if (attempt === 3) {
        return { slot, file: filename, status: 'failed', error: String(error.message) };
      }
      await new Promise((r) => setTimeout(r, 700 * attempt));
    }
  }
}

async function main() {
  const force = process.argv.includes('--force');
  await mkdir(outDir, { recursive: true });

  const entries = Object.entries(SLOTS);
  console.log(`Fetching ${entries.length} images into public/images …\n`);

  const results = [];
  // Modest concurrency keeps us polite to the CDN and avoids socket exhaustion.
  const queue = [...entries];
  const workers = Array.from({ length: 6 }, async () => {
    for (;;) {
      const next = queue.shift();
      if (!next) return;
      const [slot, spec] = next;
      const result = await download(slot, spec, { force });
      results.push(result);
      const mark = result.status === 'failed' ? '✗' : result.status === 'cached' ? '·' : '✓';
      console.log(
        `${mark} ${slot.padEnd(30)} ${result.status}${
          result.bytes ? ` (${(result.bytes / 1024).toFixed(0)} KB)` : ''
        }${result.error ? ` — ${result.error}` : ''}`,
      );
    }
  });

  await Promise.all(workers);

  const failed = results.filter((r) => r.status === 'failed');
  const ok = results.filter((r) => r.status !== 'failed');

  // The manifest is what the app actually imports; it only ever lists files
  // that were verified on disk.
  const manifest = Object.fromEntries(
    ok.sort((a, b) => a.slot.localeCompare(b.slot)).map((r) => [r.slot, `/images/${r.file}`]),
  );

  await mkdir(join(root, 'src', 'data'), { recursive: true });
  await writeFile(
    join(root, 'src', 'data', 'image-manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  );
  await writeFile(
    join(outDir, 'manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  );

  const totalKb = results.reduce((sum, r) => sum + (r.bytes ?? 0), 0) / 1024;
  console.log(
    `\n${ok.length}/${entries.length} images ready (${(totalKb / 1024).toFixed(1)} MB downloaded).`,
  );

  if (failed.length) {
    console.warn(`\n${failed.length} slot(s) failed and were omitted from the manifest:`);
    for (const f of failed) console.warn(`  - ${f.slot}: ${f.error}`);
    console.warn('\nRe-run `npm run images:fetch` to retry. Slots without a file fall back');
    console.warn('to the hatched placeholder frame, so the build stays valid.');
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
