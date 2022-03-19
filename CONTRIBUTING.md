# WIP

## Requirements

This project mainly uses Deno for various tasks. However, Node.js is still required for few places where Deno and its ecosystem cannot/does not deal with.
The following needs to be installed on your system:

- Deno v1.20 or later
- Node.js with [Corepack](https://github.com/nodejs/corepack) enabled

If you're using [asdf-vm](https://asdf-vm.com/), and installed both [asdf-nodejs](https://github.com/asdf-vm/asdf-nodejs) and [asdf-deno](https://github.com/asdf-community/asdf-deno), all you need to do is run this command on a repository root:

```sh
$ asdf install
```

## Initial setup

Before installing dependencies, I recommend you to check `package.json#scripts` field so you can get the idea what will happen before/after installation.

```sh
# Install dependencies
$ pnpm i
```

## Build files

Transpile TS files into `.js` files and `.d.ts` type definition files.

- This task requires Deno.
- This task requires Node.js.

```sh
# This builds JS files under esm/
$ deno run --unstable --allow-read=. --allow-write=. --allow-run=pnpm ./scripts/build.ts

# alias:
$ deno task build
$ pnpm build
```

## Run tests

Every test files have `.test.ts` extension. `src/testing` directory exports testing module from Deno standard library.

- This task requires Deno.

```sh
$ deno test
```

## Lint

Linting is done by Deno's lint feature.

- This task requires Deno.

```sh
$ deno lint
```

## Check runtime dependencies

This package is zero-dependency (no runtime dependencies).
`scripts/zero-deps` ensures runtime source codes does not include any external dependencies.

- This task requires Deno.

```sh
# root deno.json specifies `"lib": ["deno.ns", "dom"]` and this conflicts with imported standard libraries
$ deno info --json src/mod.ts | deno run --config ./scripts/deno.json ./scripts/zero-deps.ts

# alias:
$ deno task check-deps
```

## Format source code

This project uses Prettier as it supports various file types including HTML and CSS.
Do not run `deno fmt`, as it could possibly conflict with Prettier.

- This task requires Node.js.

```sh
$ pnpm prettier --write .

# alias:
$ deno task fmt
$ pnpm fmt
```
