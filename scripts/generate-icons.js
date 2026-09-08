const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcPath = 'C:\\Users\\royki\\.gemini\\antigravity-ide\\brain\\4271a1e7-e919-430b-a75c-16278d052a57\\.user_uploaded\\media_1788794191792.jpg';

async function generateAll() {
  const image = sharp(srcPath);
  const metadata = await image.metadata();
  const { width, height } = metadata;
  const rawBuffer = await image.raw().toBuffer({ resolveWithObject: true });
  const data = rawBuffer.data;

  // Flood fill from outer boundaries to remove white background without touching inside
  const isOutside = new Uint8Array(width * height);
  const queue = [];

  for (let x = 0; x < width; x++) {
    const iTop = 0 * width + x;
    if (data[iTop*3] > 240 && data[iTop*3+1] > 240 && data[iTop*3+2] > 240) {
      isOutside[iTop] = 1;
      queue.push(iTop);
    }
    const iBot = (height - 1) * width + x;
    if (data[iBot*3] > 240 && data[iBot*3+1] > 240 && data[iBot*3+2] > 240) {
      isOutside[iBot] = 1;
      queue.push(iBot);
    }
  }
  for (let y = 0; y < height; y++) {
    const iLeft = y * width + 0;
    if (!isOutside[iLeft] && data[iLeft*3] > 240 && data[iLeft*3+1] > 240 && data[iLeft*3+2] > 240) {
      isOutside[iLeft] = 1;
      queue.push(iLeft);
    }
    const iRight = y * width + (width - 1);
    if (!isOutside[iRight] && data[iRight*3] > 240 && data[iRight*3+1] > 240 && data[iRight*3+2] > 240) {
      isOutside[iRight] = 1;
      queue.push(iRight);
    }
  }

  let head = 0;
  while (head < queue.length) {
    const curr = queue[head++];
    const cx = curr % width;
    const cy = Math.floor(curr / width);

    const neighbors = [
      cx > 0 ? curr - 1 : -1,
      cx < width - 1 ? curr + 1 : -1,
      cy > 0 ? curr - width : -1,
      cy < height - 1 ? curr + width : -1
    ];

    for (const n of neighbors) {
      if (n !== -1 && !isOutside[n]) {
        const p = n * 3;
        if (data[p] > 238 && data[p+1] > 238 && data[p+2] > 238) {
          isOutside[n] = 1;
          queue.push(n);
        }
      }
    }
  }

  // RGBA buffer with soft alpha anti-aliasing
  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const s = i * 3;
    const d = i * 4;
    const r = data[s], g = data[s+1], b = data[s+2];
    rgba[d] = r;
    rgba[d+1] = g;
    rgba[d+2] = b;
    if (isOutside[i]) {
      const br = (r + g + b) / 3;
      if (br >= 253) {
        rgba[d+3] = 0;
      } else {
        rgba[d+3] = Math.max(0, Math.min(255, Math.round(255 * (255 - br) / 16)));
      }
    } else {
      rgba[d+3] = 255;
    }
  }

  const fullImg = sharp(rgba, { raw: { width, height, channels: 4 } });

  // 1. EMBLEM ONLY:
  // Left: 288, Top: 152, Width: 451, Height: 441 (strictly ends at y=592 before the text)
  const emblemCrop = await fullImg.clone()
    .extract({ left: 288, top: 152, width: 451, height: 441 })
    .png()
    .toBuffer();

  // 512x512 Emblem Icon (Transparent)
  const emblem512 = await sharp(emblemCrop)
    .resize(512, 512, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toBuffer();

  fs.writeFileSync('public/kisanq-icon.png', emblem512);
  fs.writeFileSync('public/icon.png', emblem512);
  fs.writeFileSync('app/icon.png', emblem512);

  // Apple icon: 180x180 with clean solid white background circle/square
  const appleIcon = await sharp(emblemCrop)
    .resize(160, 160, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .extend({
      top: 10,
      bottom: 10,
      left: 10,
      right: 10,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .png()
    .toBuffer();

  fs.writeFileSync('public/apple-icon.png', appleIcon);
  fs.writeFileSync('app/apple-icon.png', appleIcon);

  // 32x32 Favicons (Light & Dark)
  const icon32 = await sharp(emblem512)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  fs.writeFileSync('public/icon-light-32x32.png', icon32);
  fs.writeFileSync('public/icon-dark-32x32.png', icon32);

  // Favicon ICO (16, 32, 48)
  const sizes = [16, 32, 48];
  const pngBuffers = [];
  for (const s of sizes) {
    const buf = await sharp(emblem512).resize(s, s).png().toBuffer();
    pngBuffers.push({ size: s, buffer: buf });
  }
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0);
  icoHeader.writeUInt16LE(1, 2);
  icoHeader.writeUInt16LE(pngBuffers.length, 4);
  const icoEntries = [];
  let offset = 6 + (16 * pngBuffers.length);
  for (const item of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(item.size, 0);
    entry.writeUInt8(item.size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(item.buffer.length, 8);
    entry.writeUInt32LE(offset, 12);
    icoEntries.push(entry);
    offset += item.buffer.length;
  }
  const icoData = Buffer.concat([icoHeader, ...icoEntries, ...pngBuffers.map(p => p.buffer)]);
  fs.writeFileSync('public/favicon.ico', icoData);
  fs.writeFileSync('app/favicon.ico', icoData);

  // SVG Icon wrapper
  const base64Png = emblem512.toString('base64');
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">\n  <image width="512" height="512" href="data:image/png;base64,${base64Png}"/>\n</svg>\n`;
  fs.writeFileSync('public/icon.svg', svgContent);

  // 2. FULL LOGO:
  // Left: 160, Top: 148, Width: 720, Height: 700
  const fullCrop = await fullImg.clone()
    .extract({ left: 160, top: 148, width: 720, height: 700 })
    .png()
    .toBuffer();
  fs.writeFileSync('public/kisanq-logo.png', fullCrop);

  console.log('All image assets created successfully!');
}

generateAll().catch(console.error);
