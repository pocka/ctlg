# WIP

## Requirements

- Deno
- Node.js with Corepack enabled

## Initial setup

```sh
# Install dependencies
$ pnpm i
```

## Build files

```sh
# This builds JS files under esm/
$ deno run --unstable --allow-read --allow-write --allow-run ./scripts/build-nodejs.ts

# alias:
$ pnpm build
```

## Run tests

```sh
$ deno test
```

## Lint

```sh
$ deno lint
```

## Format source code

This project uses Prettier as it supports various file types including HTML and CSS.
Do not run `deno fmt`, as it could possibly conflict with Prettier.

```sh
$ pnpm fmt
```
