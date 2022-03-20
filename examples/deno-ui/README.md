# deno-ui

This example just mounts `<ctlg-*>` components without any application logic.

## Bundling

```sh
$ deno bundle index.ts index.js

# alias:
$ deno task bundle
```

## Serve files

Serve files at <http://localhost:8080>.

```sh
# You can replace `127.0.0.1` with other host address and `8080` with other port
deno run --allow-net=127.0.0.1:8080 --allow-read=. https://deno.land/std@0.130.0/http/file_server.ts . --port 8080 --host 127.0.0.1

# alias:
$ deno task serve
```
