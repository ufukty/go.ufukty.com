import { type Module } from "../models/module";
import data from "../modules.json";

function trimSlashes(pathname: string): string {
  return pathname.replace(/^\/+|\/+$/g, "");
}

const modules: Module[] = data;
const modulesByLength = [...modules].sort((a, b) => b.module.length - a.module.length);

// Compute the longest matching module prefix so that nested packages
// (e.g. golang.org/x/mod/module) resolve to the correct meta tags.
function find(path: string): Module | undefined {
  if (path === "") {
    return undefined;
  }
  return modulesByLength.find(({ module }) => path === module || path.startsWith(`${module}/`));
}

function render(m: Module): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta name="go-import" content="${m.module} ${m.vcs} ${m.repo}">
</head>
<body>
</body>
</html>`;
}

export default {
  async fetch(request: Request): Promise<Response> {
    const u = new URL(request.url);

    if (u.pathname !== "/") {
      const m = find(trimSlashes(u.pathname));
      
      if (m && u.searchParams.get("go-get") === "1") {
        return new Response(render(m), {
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      }
    }

    return Response.redirect("https://ufukty.com", 308);
  },
};
