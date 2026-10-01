import { readdir, readFile, stat, rename, createWriteStream } from "node:fs";
import { promisify } from "node:util";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const files = {
  readdir: promisify(readdir),
  readFile: promisify(readFile),
  stat: promisify(stat),
  rename: promisify(rename),
};
const directory = resolve(dirname(fileURLToPath(import.meta.url)), "../src/assets");
const base = "https://id-preview-1dc36e78--655b0a4a-f364-48bc-9bdd-152cff853202.lovable.app";
const metadata = (await files.readdir(directory)).filter((name) =>
  name.endsWith(".mp4.asset.json"),
);
const queue = [...metadata];
const failures = [];

async function download(name) {
  const asset = JSON.parse(await files.readFile(resolve(directory, name), "utf8"));
  if (!/^(m2-)?level[1-5]-cartoon\.mp4$/.test(asset.original_filename))
    throw new Error("Unexpected filename: " + name);
  const target = resolve(directory, asset.original_filename);
  const existing = await files.stat(target).catch(() => null);
  if (existing) {
    if (existing.size !== asset.size)
      throw new Error("Existing file has a different size; inspect it before replacing: " + target);
    console.log("Already downloaded:", asset.original_filename);
    return;
  }
  const response = await fetch(new URL(asset.url, base), { signal: AbortSignal.timeout(300000) });
  if (!response.ok || !response.headers.get("content-type")?.includes("video/mp4")) {
    throw new Error("Download failed: HTTP " + response.status + " for " + name);
  }
  const temporary = target + ".download";
  await pipeline(Readable.fromWeb(response.body), createWriteStream(temporary, { flags: "wx" }));
  const info = await files.stat(temporary);
  if (info.size !== asset.size) throw new Error("Size mismatch: " + temporary);
  const { open } = await import("node:fs/promises");
  const handle = await open(temporary, "r");
  const header = Buffer.alloc(12);
  try {
    await handle.read(header, 0, 12, 0);
  } finally {
    await handle.close();
  }
  if (header.toString("ascii", 4, 8) !== "ftyp")
    throw new Error("Invalid MP4 header: " + temporary);
  await files.rename(temporary, target);
  console.log("Downloaded:", asset.original_filename, info.size, "bytes");
}
await Promise.all(
  Array.from({ length: 3 }, async () => {
    while (queue.length) {
      const name = queue.shift();
      try {
        await download(name);
      } catch (error) {
        failures.push(name);
        console.error(error.message);
      }
    }
  }),
);
if (failures.length) {
  console.error(
    "Incomplete downloads:",
    failures.join(", "),
    "Inspect any .download files before retrying.",
  );
  process.exitCode = 1;
} else console.log("All", metadata.length, "mission videos are available in src/assets.");
