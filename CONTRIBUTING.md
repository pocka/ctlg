# WIP

## Requirements

This project uses Deno for development. To build a npm package, Node.js is also required.

- Deno v1.20 or later
- Node.js (optional)

If you're using [asdf-vm](https://asdf-vm.com/), and installed both [asdf-nodejs](https://github.com/asdf-vm/asdf-nodejs) and [asdf-deno](https://github.com/asdf-community/asdf-deno), all you need to do is run this command on a repository root:

```sh
$ asdf install
```

## Build files

Build Node.js package using [dnt](https://github.com/denoland/dnt). This task produces `npm/` directory.

```sh
# dnt is still in v0.x and permission scope is not optimized.
$ deno run --config ./scripts/deno.json --allow-read --allow-write=npm,/home --allow-run=npm --allow-env=HOME,XDG_CACHE_HOME,DENO_DIR,DENO_AUTH_TOKENS ./scripts/build.ts

# alias:
$ deno task build
```

## Run tests

Every test files have `.test.ts` extension. `src/testing` directory exports testing module from Deno standard library.

```sh
# --quiet test suppress console warning emitted by aria-keyshortcuts parser
$ deno test --quiet
```

## Lint

Linting is done by Deno's lint feature.

```sh
$ deno lint
```

## Check runtime dependencies

This package is zero-dependency (no runtime dependencies).
`scripts/zero-deps` ensures runtime source codes does not include any external dependencies.

```sh
# root deno.json specifies `"lib": ["deno.ns", "dom"]` and this conflicts with imported standard libraries
$ deno info --json mod.ts | deno run --config ./scripts/deno.json ./scripts/zero-deps.ts

# alias:
$ deno task check-deps
```

## Format source code

Just run Deno's default formatter. You need to manually format CSS strings inside a tagged template literal, as the formatter does not support it.

```sh
$ deno fmt
```
