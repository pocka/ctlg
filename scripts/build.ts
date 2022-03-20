import { build, emptyDir } from "https://deno.land/x/dnt@0.22.0/mod.ts";
import { version } from "../version.ts";

const root = new URL("../", import.meta.url);
const dist = new URL("npm", root).pathname;

await emptyDir(dist);

await build({
  entryPoints: [new URL("mod.ts", root).pathname],
  outDir: dist,
  test: false,
  shims: {},
  // Disable CJS output
  scriptModule: false,
  package: {
    name: "ctlg",
    version,
    license: "Apache-2.0",
    author: {
      email: "pockawoooh@gmail.com",
      name: "Shota FUJI",
      url: "https://github.com/pocka",
    },
    repository: {
      type: "git",
      url: "https://github.com/pocka/ctlg",
    },
    bugs: {
      url: "https://github.com/pocka/ctlg/issues",
    },
  },
});

const filesToCopy: readonly string[] = ["LICENSE", "README.md"];

Promise.all(
  filesToCopy.map(async (file) => {
    const src = new URL(file, root);
    const dist = new URL("npm/" + file, root);

    return await Deno.copyFile(src, dist);
  }),
);
