import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const downloads = JSON.parse(await fs.readFile(path.join(root, "qa/character-downloads.json"), "utf8"));
const manifestPath = path.join(root, "src/data/character-art.json");
let manifest = {};
try { manifest = JSON.parse(await fs.readFile(manifestPath, "utf8")); } catch { /* Initial asset preparation. */ }
const overrides = { floch: .52, levi: .8, eren: .7, mikasa: .72, armin: .65, reiner: .65, bertholdt: .58, annie: .65, erwin: .65, hange: .65, jean: .65, connie: .7, sasha: .65, historia: .6, ymir: .65, petra: .65, marco: .65, hannes: .55, pixis: .55 };
const generated = JSON.parse(await fs.readFile(path.join(root, "qa/character-extractions.json"), "utf8").catch(() => "{}"));
for (const job of downloads) {
  const source = generated[job.id] || (!['zeke','pieck','falco','gabi'].includes(job.id) ? job.out : null);
  if (!source) continue;
  const output = path.join(root, `public/media/characters/${job.id}.webp`);
  // Remove transparent canvas padding without resampling the source artwork.
  const info = await sharp(source).trim().webp({ lossless: true }).toFile(output);
  manifest[job.id] = { width: info.width, height: info.height, crop: overrides[job.id] ?? .47 };
}
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
const ids = downloads.map(job => job.id).filter(id => manifest[id]);
const tiles = await Promise.all(ids.map(async(id,index) => ({input: await sharp(path.join(root, `public/media/characters/${id}.webp`)).resize(170,210,{fit:'contain',background:'#10110f'}).extend({bottom:26,background:'#10110f'}).composite([{input:Buffer.from(`<svg width="170" height="26"><text x="85" y="19" fill="#eee" font-size="13" text-anchor="middle">${id}</text></svg>`),top:210,left:0}]).png().toBuffer(),left:(index%6)*170,top:Math.floor(index/6)*236})));
await sharp({create:{width:1020,height:Math.ceil(ids.length/6)*236,channels:3,background:'#10110f'}}).composite(tiles).jpeg({quality:90}).toFile(path.join(root,'qa/character-contact.jpg'));
console.log(`Prepared ${ids.length} transparent character assets.`);

