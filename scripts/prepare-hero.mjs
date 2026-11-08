import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { mkdirSync, renameSync } from 'node:fs';
import path from 'node:path';
const require = createRequire(import.meta.url);
const ffmpeg = require('ffmpeg-static');
const input = path.resolve('WatermarkRemoved-Clips/Completed-Clip.mp4');
mkdirSync('public/media', { recursive: true });
function run(args) {
  const result = spawnSync(ffmpeg, ['-hide_banner', '-y', ...args], { stdio: 'inherit' });
  if (result.error) console.error(result.error.message);
  if (result.status !== 0) process.exit(result.status || 1);
}
// Frequent keyframes keep seeks cheap while retaining 1080p detail.
run(['-i', input, '-an', '-vf', 'scale=1920:-2,fps=24', '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'medium', '-crf', '22', '-pix_fmt', 'yuv420p', '-g', '5', '-bf', '0', '-movflags', '+faststart', 'public/media/hero-scrub-hd.next.mp4']);
renameSync('public/media/hero-scrub-hd.next.mp4', 'public/media/hero-scrub-hd.mp4');
run(['-ss', '0', '-i', input, '-frames:v', '1', '-vf', 'scale=1920:-2', '-q:v', '3', '-update', '1', 'public/media/hero-poster.next.jpg']);
renameSync('public/media/hero-poster.next.jpg', 'public/media/hero-poster.jpg');
