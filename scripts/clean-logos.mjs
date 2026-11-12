// One-off/re-runnable cleanup for the raw brand logo drops in /public.
// Produces transparent, tightly-cropped PNGs in /public/brand from the
// opaque originals (kept in /public/brand-source for reference).
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

// Re-runnable: reads from the backed-up originals if the raw drops in
// /public have already been cleaned up and removed from there.
import { existsSync } from 'node:fs';
const SOURCE_DIR = existsSync('public/matchday-live-logo.png') ? 'public' : 'public/brand-source';
const OUT_DIR = 'public/brand';
const BACKUP_DIR = 'public/brand-source';

async function loadRaw(path) {
  const { data, info } = await sharp(path).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data: new Uint8ClampedArray(data), info };
}

function colorDistance(r1, g1, b1, r2, g2, b2) {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/** Simple threshold key: treat near-white pixels as background, with a soft falloff band for anti-aliased edges. */
function whiteKey(data, info, { solid = 236, soft = 30 } = {}) {
  const { width, height, channels } = info;
  for (let i = 0; i < width * height; i++) {
    const o = i * channels;
    const r = data[o];
    const g = data[o + 1];
    const b = data[o + 2];
    const minC = Math.min(r, g, b);
    if (minC >= solid) {
      data[o + 3] = 0;
    } else if (minC >= solid - soft) {
      const t = (minC - (solid - soft)) / soft; // 0 at edge of subject, 1 at background
      data[o + 3] = Math.round(data[o + 3] * (1 - t));
    }
  }
}

/** Border flood-fill key: walks inward from the four edges through
 * gradually-changing background pixels (handles vignettes/gradients),
 * stopping at any hard edge into the subject. */
function floodFillKey(data, info, { tolerance = 16, maxSteps = 60000 } = {}) {
  const { width, height, channels } = info;
  const visited = new Uint8Array(width * height);
  const stack = [];

  const pushIfValid = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const idx = y * width + x;
    if (visited[idx]) return;
    stack.push(idx);
    visited[idx] = 1;
  };

  for (let x = 0; x < width; x++) {
    pushIfValid(x, 0);
    pushIfValid(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    pushIfValid(0, y);
    pushIfValid(width - 1, y);
  }

  const background = new Uint8Array(width * height);
  let steps = 0;

  while (stack.length && steps < maxSteps) {
    const idx = stack.pop();
    steps++;
    background[idx] = 1;
    const x = idx % width;
    const y = Math.floor(idx / width);
    const o = idx * channels;
    const r = data[o];
    const g = data[o + 1];
    const b = data[o + 2];

    const neighbors = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ];
    for (const [nx, ny] of neighbors) {
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      const nIdx = ny * width + nx;
      if (visited[nIdx]) continue;
      const no = nIdx * channels;
      const dist = colorDistance(r, g, b, data[no], data[no + 1], data[no + 2]);
      if (dist <= tolerance) {
        visited[nIdx] = 1;
        stack.push(nIdx);
      }
    }
  }

  for (let i = 0; i < width * height; i++) {
    if (background[i]) {
      data[i * channels + 3] = 0;
    }
  }
}

function boundingBox(data, info, { padding = 12 } = {}) {
  const { width, height, channels } = info;
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * channels + 3];
      if (alpha > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return { left: 0, top: 0, width, height };
  minX = Math.max(0, minX - padding);
  minY = Math.max(0, minY - padding);
  maxX = Math.min(width - 1, maxX + padding);
  maxY = Math.min(height - 1, maxY + padding);
  return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

/** Finds the bounding box of "content" via local gradient magnitude, for
 * images where the whole canvas is a soft glow/gradient with no flat
 * background region to key out (so the crop keeps full opacity — used as
 * a framed badge rather than a free-floating cutout). */
function contentBoundingBox(data, info, { step = 4, threshold = 14, padding = 24 } = {}) {
  const { width, height, channels } = info;
  const lum = (o) => 0.2126 * data[o] + 0.7152 * data[o + 1] + 0.0722 * data[o + 2];
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = step; y < height - step; y++) {
    for (let x = step; x < width - step; x++) {
      const o = (y * width + x) * channels;
      const oRight = (y * width + (x + step)) * channels;
      const oDown = ((y + step) * width + x) * channels;
      const dx = Math.abs(lum(o) - lum(oRight));
      const dy = Math.abs(lum(o) - lum(oDown));
      if (Math.max(dx, dy) > threshold) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return { left: 0, top: 0, width, height };
  minX = Math.max(0, minX - padding);
  minY = Math.max(0, minY - padding);
  maxX = Math.min(width - 1, maxX + padding);
  maxY = Math.min(height - 1, maxY + padding);
  return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

async function process(file, { mode, outName, ...opts }) {
  const srcPath = `${SOURCE_DIR}/${file}`;
  const { data, info } = await loadRaw(srcPath);

  if (mode === 'white') whiteKey(data, info, opts);
  if (mode === 'flood') floodFillKey(data, info, opts);

  const bbox = mode === 'cropOnly' ? contentBoundingBox(data, info, opts) : boundingBox(data, info);
  const cropped = await sharp(Buffer.from(data.buffer), {
    raw: { width: info.width, height: info.height, channels: info.channels },
  })
    .extract(bbox)
    .png()
    .toBuffer();

  const backupPath = `${BACKUP_DIR}/${outName}`;
  if (srcPath !== backupPath) await sharp(srcPath).toFile(backupPath);
  await sharp(cropped).toFile(`${OUT_DIR}/${outName}`);
  console.log(`cleaned ${file} -> ${OUT_DIR}/${outName} (${bbox.width}x${bbox.height}, mode=${mode})`);
}

await mkdir(OUT_DIR, { recursive: true });
await mkdir(BACKUP_DIR, { recursive: true });

await process('matchday-analytics-logo.png', { mode: 'white', outName: 'matchday-analytics-logo.png' });
await process('MPL-partner-logo.png', { mode: 'white', outName: 'MPL-partner-logo.png' });
await process('mlis-logo-partner.png', { mode: 'white', outName: 'mlis-logo-partner.png' });
await process('matchday-live-logo.png', { mode: 'cropOnly', outName: 'matchday-live-logo.png' });

// --- Favicons + default OG image, derived from the cleaned primary badge ---
// The badge keeps its baked-in gradient (see mode: 'cropOnly' above), so we
// letterbox it onto our own near-black brand background rather than trying
// to seamlessly extend/key a gradient we don't have clean control points for.
const NIGHT = { r: 0x07, g: 0x09, b: 0x0a, alpha: 1 };
const badge = sharp(`${OUT_DIR}/matchday-live-logo.png`);
const badgeMeta = await badge.metadata();

// Icon-only crop: drop the "Matchday Live" wordmark band at the bottom,
// keep just the runner+camera mark, for use as a favicon/app icon.
const iconHeight = Math.round(badgeMeta.height * 0.78);
const iconSquareSource = Math.max(badgeMeta.width, iconHeight);

await sharp(`${OUT_DIR}/matchday-live-logo.png`)
  .extract({ left: 0, top: 0, width: badgeMeta.width, height: iconHeight })
  .resize({
    width: iconSquareSource,
    height: iconSquareSource,
    fit: 'contain',
    background: NIGHT,
  })
  .resize(512, 512)
  .png()
  .toFile(`${OUT_DIR}/icon-512.png`);

for (const size of [16, 32, 180]) {
  await sharp(`${OUT_DIR}/icon-512.png`)
    .resize(size, size)
    .png()
    .toFile(`${OUT_DIR}/${size === 180 ? 'apple-touch-icon' : `favicon-${size}`}.png`);
}

// Default Open Graph image: full badge (icon + wordmark) centered on the
// brand's night-stadium background at the standard 1200x630 OG size.
await sharp(`${OUT_DIR}/matchday-live-logo.png`)
  .resize({ width: 1000, height: 540, fit: 'inside' })
  .toBuffer()
  .then((buf) =>
    sharp({
      create: { width: 1200, height: 630, channels: 4, background: NIGHT },
    })
      .composite([{ input: buf, gravity: 'centre' }])
      .png()
      .toFile(`${OUT_DIR}/og-default.png`),
  );

console.log('favicons + og-default.png written to', OUT_DIR);
