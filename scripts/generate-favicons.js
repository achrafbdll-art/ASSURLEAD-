import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const svgPath = path.resolve('public/logo-premium.svg');
const svgBuffer = fs.readFileSync(svgPath);

// 1. Ensure favicon.svg is 100% byte-for-byte identical to logo-premium.svg
fs.writeFileSync('public/favicon.svg', svgBuffer);
fs.writeFileSync('favicon.svg', svgBuffer);

console.log('✓ public/favicon.svg and favicon.svg updated to be 100% identical to logo-premium.svg');

// 2. Generate crisp PNG assets directly from SVG
const targets = [
  { file: 'public/favicon-16x16.png', size: 16 },
  { file: 'public/favicon-32x32.png', size: 32 },
  { file: 'public/favicon-64.png', size: 64 },
  { file: 'public/apple-touch-icon.png', size: 180 },
  { file: 'public/android-chrome-192x192.png', size: 192 },
  { file: 'public/android-chrome-512x512.png', size: 512 },
  { file: 'public/logo-premium.png', size: 512 }
];

for (const { file, size } of targets) {
  await sharp(svgBuffer)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(file);
  console.log(`✓ Generated ${file} (${size}x${size})`);
}

// 3. Generate multi-resolution favicon.ico containing 16x16, 32x32, 48x48 PNG frames
async function createIco(pngBuffers, outputPath) {
  // ICO header: 6 bytes
  // 0-1: reserved (0)
  // 2-3: type (1 = icon)
  // 4-5: count of images
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngBuffers.length, 4);

  let offset = 6 + (pngBuffers.length * 16);
  const dirEntries = [];

  for (const { buffer, size } of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // color palette count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(buffer.length, 8); // size of image data
    entry.writeUInt32LE(offset, 12); // offset of image data
    dirEntries.push(entry);
    offset += buffer.length;
  }

  const icoBuffer = Buffer.concat([
    header,
    ...dirEntries,
    ...pngBuffers.map(p => p.buffer)
  ]);

  fs.writeFileSync(outputPath, icoBuffer);
}

const b16 = await sharp(svgBuffer).resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
const b32 = await sharp(svgBuffer).resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
const b48 = await sharp(svgBuffer).resize(48, 48, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();

await createIco([
  { buffer: b16, size: 16 },
  { buffer: b32, size: 32 },
  { buffer: b48, size: 48 }
], 'public/favicon.ico');

fs.copyFileSync('public/favicon.ico', 'favicon.ico');
console.log('✓ public/favicon.ico and favicon.ico generated');
