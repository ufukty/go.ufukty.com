import { type Module } from "../models/module";
import data from "../modules.json";

function trimSlashes(pathname: string): string {
  return pathname.replace(/^\/+|\/+$/g, "");
}

const modules: Module[] = data;
const modulesByLength = [...modules].sort((a, b) => b.module.length - a.module.length);

// Compute the longest matching module prefix so that nested packages
// (e.g. golang.org/x/mod/module) resolve to the correct meta tags.
function findModuleMirror(path: string): Module | undefined {
  if (path === "") {
    return undefined;
  }
  return modulesByLength.find(({ module }) => path === module || path.startsWith(`${module}/`));
}

export function renderGoGetMeta(m: Module): string {
  const goImport = `<meta name="go-import" content="${m.module} ${m.vcs} ${m.repo}">`;
  const goSource = m.source
    ? `<meta name="go-source" content="${module} ${m.source.home} ${m.source.dir} ${m.source.file}">`
    : "";

  return `<!DOCTYPE html>
<html>
<head>
${goImport}
${goSource}
</head>
<body>
</body>
</html>`;
}

export default {
  async fetch(request: Request): Promise<Response> {
    const u = new URL(request.url);
    const p = trimSlashes(u.pathname);
    const m = findModuleMirror(p);

    if (!m) {
      return new Response(``, {
        status: 404,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }

    if (u.searchParams.get("go-get") === "1") {
      return new Response(renderGoGetMeta(m), {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }

    return Response.redirect("https://ufukty.com", 308);
  },
};
