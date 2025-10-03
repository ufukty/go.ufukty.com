# Go Module Proxy

A Cloudflare Workers project that provides Go module metadata for selected modules
and redirects `go get` requests to mirror repositories.

## Features

- Serves `<meta name="go-import">` and `<meta name="go-source">` tags for
  configured modules so that `go` tooling fetches code from mirrored hosts.
- Redirects human visitors to module documentation or repository pages.
- Returns a helpful 404 page when a module mapping is missing.

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start a local development server:

   ```bash
   npm run dev
   ```

3. Deploy to Cloudflare Workers:

   ```bash
   npm run deploy
   ```

## Configure Module Mirrors

Edit `MODULE_MIRRORS` in [`src/index.ts`](src/index.ts) to add, remove, or update
module redirect rules. Each entry defines the Go import path prefix, the
VCS/repository pair used by Go tooling, and optional source browsing and
homepage URLs.

Example entry:

```ts
{
  module: "golang.org/x/mod",
  vcs: "git",
  repo: "https://go.googlesource.com/mod",
  source: {
    home: "https://cs.opensource.google/go/x/mod",
    dir: "https://cs.opensource.google/go/x/mod/+/refs/heads/master/{dir}",
    file: "https://cs.opensource.google/go/x/mod/+/refs/heads/master/{dir}/{file}#L{line}",
  },
  homepage: "https://pkg.go.dev/golang.org/x/mod",
}
```

Requests such as
`https://example.com/golang.org/x/mod?go-get=1` will receive the appropriate
meta tags so that the Go toolchain downloads from `https://go.googlesource.com/mod`.
Human visitors (without the `go-get=1` query parameter) will be redirected to the
configured `homepage` URL when present.
