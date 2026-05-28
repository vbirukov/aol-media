#!/usr/bin/env node
import { readdir, rename, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const VIDEO_EXT = new Set([".mp4", ".m4v", ".mov", ".mkv", ".webm"]);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

function parseArgs(argv) {
  const args = {
    root: path.join(repoRoot, "media"),
    preset: "slow",
    crf: "20",
    overwrite: false,
    all: false,
    dryRun: false,
  };

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--root" && argv[i + 1]) args.root = path.resolve(argv[++i]);
    else if (a === "--preset" && argv[i + 1]) args.preset = argv[++i];
    else if (a === "--crf" && argv[i + 1]) args.crf = argv[++i];
    else if (a === "--overwrite") args.overwrite = true;
    else if (a === "--all") args.all = true;
    else if (a === "--dry-run") args.dryRun = true;
    else if (a === "-h" || a === "--help") {
      console.log(
        "Usage: node scripts/transcode-media.mjs [--root ./media] [--all] [--overwrite] [--preset slow] [--crf 20] [--dry-run]",
      );
      process.exit(0);
    }
  }

  return args;
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    p.stdout.on("data", (d) => {
      stdout += d.toString();
    });
    p.stderr.on("data", (d) => {
      stderr += d.toString();
    });
    p.on("error", reject);
    p.on("close", (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`${cmd} ${args.join(" ")}\n${stderr || stdout}`));
    });
  });
}

async function collectFiles(root) {
  const out = [];
  async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const ent of entries) {
      if (ent.name.startsWith(".")) continue;
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        await walk(full);
        continue;
      }
      if (!ent.isFile()) continue;
      const ext = path.extname(ent.name).toLowerCase();
      if (!VIDEO_EXT.has(ext)) continue;
      out.push(full);
    }
  }
  await walk(root);
  return out;
}

async function probeCodec(file) {
  const args = [
    "-v",
    "error",
    "-select_streams",
    "v:0",
    "-show_entries",
    "stream=codec_name",
    "-of",
    "default=nokey=1:noprint_wrappers=1",
    file,
  ];
  const video = (await run("ffprobe", args)).stdout.trim();
  const aArgs = [
    "-v",
    "error",
    "-select_streams",
    "a:0",
    "-show_entries",
    "stream=codec_name",
    "-of",
    "default=nokey=1:noprint_wrappers=1",
    file,
  ];
  let audio = "";
  try {
    audio = (await run("ffprobe", aArgs)).stdout.trim();
  } catch {
    audio = "";
  }
  return { video, audio };
}

function needsTranscode(codecs) {
  const videoOk = codecs.video === "h264";
  const audioOk = !codecs.audio || codecs.audio === "aac";
  return !(videoOk && audioOk);
}

function ffmpegArgs(input, output, preset, crf, overwrite) {
  return [
    "-hide_banner",
    "-loglevel",
    "error",
    ...(overwrite ? ["-y"] : ["-n"]),
    "-i",
    input,
    "-map",
    "0:v:0",
    "-map",
    "0:a?",
    "-c:v",
    "libx264",
    "-preset",
    preset,
    "-crf",
    crf,
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    "-c:a",
    "aac",
    "-b:a",
    "160k",
    output,
  ];
}

async function main() {
  const args = parseArgs(process.argv);
  const files = await collectFiles(args.root);
  if (!files.length) {
    console.log(`Видео не найдены: ${args.root}`);
    return;
  }

  let converted = 0;
  let skipped = 0;

  for (const file of files) {
    const codecs = await probeCodec(file);
    const mustConvert = args.all || needsTranscode(codecs);
    const rel = path.relative(args.root, file).split(path.sep).join("/");

    if (!mustConvert) {
      skipped++;
      console.log(`skip ${rel} (${codecs.video}${codecs.audio ? `/${codecs.audio}` : ""})`);
      continue;
    }

    console.log(`convert ${rel} (${codecs.video}${codecs.audio ? `/${codecs.audio}` : ""})`);
    if (args.dryRun) continue;

    const temp = `${file}.tmp.transcoded.mp4`;
    await run("ffmpeg", ffmpegArgs(file, temp, args.preset, args.crf, args.overwrite));
    await rename(temp, file);
    converted++;
  }

  if (!args.dryRun) {
    const leftovers = files.map((f) => `${f}.tmp.transcoded.mp4`);
    for (const p of leftovers) {
      await rm(p, { force: true });
    }
  }

  console.log(`Готово. converted=${converted}, skipped=${skipped}, total=${files.length}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
