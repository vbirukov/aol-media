#!/usr/bin/env node
/**
 * Сканирует папку media/ и пишет catalog.json для VITE_MEDIA_BASE.
 *
 * Структура:
 *   media/
 *     catalog.json
 *     Беседы/
 *       Подпапка/
 *         file.mp3
 *     Медитации/
 *       file.mp3          ← плоско: folder = имя раздела
 *
 * Usage:
 *   node scripts/generate-catalog.mjs
 *   node scripts/generate-catalog.mjs --root ./media
 *   node scripts/generate-catalog.mjs --root D:/aol-content/media --dry-run
 */

import { createHash } from "node:crypto";
import { readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const AUDIO_EXT = new Set([".mp3", ".m4a", ".ogg", ".wav", ".aac", ".flac"]);
const VIDEO_EXT = new Set([".mp4", ".webm", ".mov", ".m4v", ".mkv"]);
const TEXT_EXT = new Set([".md", ".txt", ".html", ".htm", ".markdown"]);

const MIME = {
  ".mp3": "audio/mpeg",
  ".m4a": "audio/mp4",
  ".ogg": "audio/ogg",
  ".wav": "audio/wav",
  ".aac": "audio/aac",
  ".flac": "audio/flac",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".m4v": "video/mp4",
  ".mkv": "video/x-matroska",
  ".md": "text/markdown",
  ".txt": "text/plain",
  ".html": "text/html",
  ".htm": "text/html",
  ".markdown": "text/markdown",
};

const EXPECTED_SECTIONS = [
  "Беседы",
  "Серии знаний",
  "Медитации",
  "Тексты",
  "Баджаны",
  "Мантры",
];

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

function parseArgs(argv) {
  const args = { root: path.join(repoRoot, "media"), dryRun: false, title: "Искусство Жизни" };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") args.dryRun = true;
    else if (a === "--root" && argv[i + 1]) args.root = path.resolve(argv[++i]);
    else if (a === "--title" && argv[i + 1]) args.title = argv[++i];
    else if (a === "-h" || a === "--help") {
      console.log(`Usage: node scripts/generate-catalog.mjs [--root ./media] [--title "…"] [--dry-run]`);
      process.exit(0);
    }
  }
  return args;
}

function inferKind(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  if (VIDEO_EXT.has(ext)) return "video";
  if (TEXT_EXT.has(ext)) return "text";
  if (AUDIO_EXT.has(ext)) return "audio";
  return null;
}

function isMediaFile(name) {
  return inferKind(name) !== null;
}

function trackId(diskPath) {
  return createHash("sha256").update(diskPath).digest("hex").slice(0, 16);
}

function titleFromFileName(fileName) {
  const base = path.basename(fileName, path.extname(fileName));
  return base.replace(/[_-]+/g, " ").trim() || fileName;
}

/** @returns {Promise<Array<{ section: string, folder: string, fileName: string, relPath: string }>>} */
async function collectTracks(mediaRoot) {
  const out = [];

  async function walk(dir, section, folder) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.name.startsWith(".") || ent.name === "catalog.json") continue;

      if (ent.isDirectory()) {
        if (!section) {
          await walk(full, ent.name, null);
        } else if (!folder) {
          await walk(full, section, ent.name);
        } else {
          await walk(full, section, `${folder}/${ent.name}`);
        }
        continue;
      }

      if (!ent.isFile() || !isMediaFile(ent.name)) continue;

      const rel = path.relative(mediaRoot, full).split(path.sep).join("/");
      const diskPath = "/" + rel;
      const parts = rel.split("/");

      let sec = section;
      let fol = folder;
      if (!sec && parts.length >= 2) {
        sec = parts[0];
        fol = parts.length > 2 ? parts.slice(1, -1).join("/") : parts[0];
      } else if (sec && !fol) {
        fol = sec;
      }

      out.push({
        section: sec ?? "Каталог",
        folder: fol ?? sec ?? "Каталог",
        fileName: ent.name,
        relPath: diskPath,
      });
    }
  }

  await walk(mediaRoot, null, null);
  return out;
}

async function main() {
  const { root, dryRun, title } = parseArgs(process.argv);

  try {
    const st = await stat(root);
    if (!st.isDirectory()) throw new Error("not a directory");
  } catch {
    console.error(`Папка не найдена: ${root}`);
    process.exit(1);
  }

  const raw = await collectTracks(root);
  if (raw.length === 0) {
    console.warn(`Медиафайлы не найдены в ${root}`);
  }

  const tracks = raw
    .map((t) => {
      const folderPath = `/${t.section}/${t.folder}`.replace(/\/+/g, "/");
      const kind = inferKind(t.fileName);
      const ext = path.extname(t.fileName).toLowerCase();
      return {
        id: trackId(t.relPath),
        title: titleFromFileName(t.fileName),
        fileName: t.fileName,
        folder: t.folder,
        folderPath,
        path: t.relPath,
        section: t.section,
        kind,
        mimeType: MIME[ext],
      };
    })
    .sort((a, b) => a.path.localeCompare(b.path, "ru"));

  const sections = [...new Set(tracks.map((t) => t.section))].sort((a, b) =>
    a.localeCompare(b, "ru"),
  );
  const folders = [...new Set(tracks.map((t) => t.folder))].sort((a, b) =>
    a.localeCompare(b, "ru"),
  );

  const catalog = {
    sourceTitle: title,
    sections,
    folders,
    tracks,
  };

  const missing = EXPECTED_SECTIONS.filter((s) => !sections.includes(s));
  if (missing.length) {
    console.warn("Нет папок разделов (ожидались с главной):", missing.join(", "));
  }

  const outFile = path.join(root, "catalog.json");
  const json = JSON.stringify(catalog, null, 2) + "\n";

  console.log(`Треков: ${tracks.length}`);
  console.log(`Разделов: ${sections.length} → ${sections.join(", ")}`);
  console.log(`Выход: ${outFile}`);

  if (dryRun) {
    console.log("\n--- preview (first track) ---");
    console.log(JSON.stringify(tracks[0] ?? null, null, 2));
    return;
  }

  await writeFile(outFile, json, "utf8");
  console.log("catalog.json записан.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
