# deno-react

React app bundled with Deno.

## Bundling

```sh
$ deno bundle index.ts index.js

# alias:
$ deno task bundle
```

## Serve files

Serve files at <http://localhost:8081>.

```sh
# You can replace `127.0.0.1` with other host address and `8081` with other port
deno run --allow-net=127.0.0.1:8081 --allow-read=. https://deno.land/std@0.130.0/http/file_server.ts . --port 8081 --host 127.0.0.1

# alias:
$ deno task serve
```
