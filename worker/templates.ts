import type { Module } from "./module";

const baseStyles = `
  body { font-family: system-ui, sans-serif; margin: 3rem auto; max-width: 40rem; padding: 0 1.5rem; color: #1f2933; }
`;

const linkStyles = `
  a { color: #0b69a3; text-decoration: none; }
  a:hover { text-decoration: underline; }
`;

export function renderGoGetMeta({ module, vcs, repo, source }: Module): string {
  const goImport = `<meta name="go-import" content="${module} ${vcs} ${repo}">`;
  const goSource = source
    ? `<meta name="go-source" content="${module} ${source.home} ${source.dir} ${source.file}">`
    : "";

  return `<!DOCTYPE html><html lang="en"><head>${goImport}${goSource}</head><body></body></html>`;
}

export function renderLandingPage(moduleMirror: Module): string {
  const { module, repo, homepage } = moduleMirror;
  const description = `Redirects Go tooling to ${repo}.`;
  const links = [
    { href: repo, label: "Repository" },
    homepage ? { href: homepage, label: "Documentation" } : undefined,
  ].filter(Boolean) as { href: string; label: string }[];

  const linksHtml = links.map((link) => `<li><a href="${link.href}">${link.label}</a></li>`).join("");

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${module}</title>
    <style>
      ${baseStyles}
      ${linkStyles}
      h1 { font-size: 2rem; margin-bottom: 0.5rem; }
      p { margin-bottom: 1.5rem; }
      ul { list-style: none; padding: 0; }
      li { margin-bottom: 0.5rem; }
    </style>
  </head>
  <body>
    <h1>${module}</h1>
    <p>${description}</p>
    <ul>${linksHtml}</ul>
  </body>
</html>`;
}

export function renderNotFound(path: string): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Module Not Found</title>
    <style>
      ${baseStyles}
      ${linkStyles}
    </style>
  </head>
  <body>
    <h1>Module Not Found</h1>
    <p>No module mapping was found for <code>${path}</code>.</p>
    <p>Update <code>MODULE_MIRRORS</code> in <code>worker/module-mirrors.ts</code> to register a new module.</p>
  </body>
</html>`;
}
