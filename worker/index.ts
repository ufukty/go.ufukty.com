export interface ModuleMirror {
  /**
   * Module import path prefix handled by this worker.
   * e.g. `golang.org/x/mod`.
   */
  module: string;
  /**
   * Version control system type.
   * Common values: `git`, `hg`, `svn`.
   */
  vcs: string;
  /**
   * Remote repository URL.
   */
  repo: string;
  /**
   * Optional source browser information for go-source meta tags.
   */
  source?: {
    /** Base URL for browsing documentation. */
    home: string;
    /** Base URL for directory listings. */
    dir: string;
    /** Base URL for files. */
    file: string;
  };
  /** Optional friendly landing page to redirect human visitors. */
  homepage?: string;
}

const MODULE_MIRRORS: ModuleMirror[] = [
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
  },
  {
    module: "golang.org/x/tools",
    vcs: "git",
    repo: "https://go.googlesource.com/tools",
    source: {
      home: "https://cs.opensource.google/go/x/tools",
      dir: "https://cs.opensource.google/go/x/tools/+/refs/heads/master/{dir}",
      file: "https://cs.opensource.google/go/x/tools/+/refs/heads/master/{dir}/{file}#L{line}",
    },
    homepage: "https://pkg.go.dev/golang.org/x/tools",
  },
];

const MODULE_MIRRORS_BY_LENGTH = [...MODULE_MIRRORS].sort(
  (a, b) => b.module.length - a.module.length,
);

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = trimSlashes(url.pathname);
    const moduleMirror = findModuleMirror(path);

    if (!moduleMirror) {
      return new Response(renderNotFound(path), {
        status: 404,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }

    if (url.searchParams.get("go-get") === "1") {
      return new Response(renderGoGetMeta(moduleMirror), {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }

    if (moduleMirror.homepage) {
      return Response.redirect(moduleMirror.homepage, 302);
    }

    return new Response(renderLandingPage(moduleMirror), {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  },
};

function trimSlashes(pathname: string): string {
  return pathname.replace(/^\/+|\/+$/g, "");
}

function findModuleMirror(path: string): ModuleMirror | undefined {
  if (path === "") {
    return undefined;
  }

  // Compute the longest matching module prefix so that nested packages
  // (e.g. golang.org/x/mod/module) resolve to the correct meta tags.
  return MODULE_MIRRORS_BY_LENGTH.find(
    ({ module }) => path === module || path.startsWith(`${module}/`),
  );
}

function renderGoGetMeta({ module, vcs, repo, source }: ModuleMirror): string {
  const goImport = `<meta name="go-import" content="${module} ${vcs} ${repo}">`;
  const goSource = source
    ? `<meta name="go-source" content="${module} ${source.home} ${source.dir} ${source.file}">`
    : "";

  return `<!DOCTYPE html><html lang="en"><head>${goImport}${goSource}</head><body></body></html>`;
}

function renderLandingPage(moduleMirror: ModuleMirror): string {
  const { module, repo, homepage } = moduleMirror;
  const description = `Redirects Go tooling to ${repo}.`;
  const links = [
    { href: repo, label: "Repository" },
    homepage ? { href: homepage, label: "Documentation" } : undefined,
  ].filter(Boolean) as { href: string; label: string }[];

  const linksHtml = links
    .map((link) => `<li><a href="${link.href}">${link.label}</a></li>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${module}</title>
    <style>
      body { font-family: system-ui, sans-serif; margin: 3rem auto; max-width: 40rem; padding: 0 1.5rem; color: #1f2933; }
      h1 { font-size: 2rem; margin-bottom: 0.5rem; }
      p { margin-bottom: 1.5rem; }
      ul { list-style: none; padding: 0; }
      li { margin-bottom: 0.5rem; }
      a { color: #0b69a3; text-decoration: none; }
      a:hover { text-decoration: underline; }
    </style>
  </head>
  <body>
    <h1>${module}</h1>
    <p>${description}</p>
    <ul>${linksHtml}</ul>
  </body>
</html>`;
}

function renderNotFound(path: string): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Module Not Found</title>
    <style>
      body { font-family: system-ui, sans-serif; margin: 3rem auto; max-width: 40rem; padding: 0 1.5rem; color: #1f2933; }
      a { color: #0b69a3; }
    </style>
  </head>
  <body>
    <h1>Module Not Found</h1>
    <p>No module mapping was found for <code>${path}</code>.</p>
    <p>Update <code>MODULE_MIRRORS</code> in <code>src/index.ts</code> to register a new module.</p>
  </body>
</html>`;
}
