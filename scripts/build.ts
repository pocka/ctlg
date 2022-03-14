// This script transpiles TypeScript file inside `src/` directory to JavaScript
import { copy, emptyDir, walk } from "https://deno.land/std@0.130.0/fs/mod.ts";

try {
  const srcDir = new URL("../src", import.meta.url);
  const tmpDir = new URL("../esm.tmp", import.meta.url);
  const outDir = new URL("../esm", import.meta.url);

  // Clean output directory
  await emptyDir(outDir.pathname);

  // Empty temporary directory in order to prevent gabarge files to be compiled
  await emptyDir(tmpDir.pathname);

  // Copy src directory, so we can safely rewrite `.ts` file extension to `.js`
  await copy(srcDir.pathname, tmpDir.pathname, {
    overwrite: true,
  });

  // Collect files to be rewritten
  const files: string[] = [];
  for await (const entry of walk(tmpDir.pathname)) {
    if (entry.isDirectory) {
      continue;
    }

    if (/\.ts$/.test(entry.path)) {
      files.push(entry.path);
    }
  }

  // Replace every ".ts" import to ".js"
  await Promise.all(
    files.map(async (file) => {
      const contents = await Deno.readTextFile(file);

      const code = contents.replace(/(from\s+"[^"]+)\.ts(")/g, "$1.js$2");

      await Deno.writeTextFile(file, code);
    })
  );

  // Compile with tsc
  const process = Deno.run({
    cmd: ["pnpm", "tsc"],
  });

  const status = await process.status();
  if (status.code !== 0) {
    throw new Error(`Process exit with ${status.code}`);
  }

  // Remove temporary directory
  await Deno.remove(tmpDir, {
    recursive: true,
  });
} catch (err) {
  console.error(err);
}
