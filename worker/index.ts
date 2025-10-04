import data from "../modules.json";

const home = "https://ufukty.com";

function trimSlashes(pathname: string): string {
  return pathname.replace(/^\/+|\/+$/g, "");
}

interface Module {
  module: string;
  vcs: string;
  repo: string;
}

const file: Module[] = data;

function render(proxy: string, m: Module): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta name="go-import" content="${proxy}/${m.module} ${m.vcs} ${m.repo}">
<meta http-equiv="refresh" content="0;URL='${home}'">
</head>
<body>
Redirecting...
</body>
</html>`;
}

export default {
  async fetch(request: Request): Promise<Response> {
    const u = new URL(request.url);

    if (u.pathname !== "/") {
      const p = trimSlashes(u.pathname);
      const m = file.find((m) => p === m.module);
      if (m && u.searchParams.get("go-get") === "1") {
        return new Response(render(u.hostname, m), {
          headers: { "content-type": "text/html; charset=utf-8" },
        });
      }
    }

    return Response.redirect(home, 308);
  },
};
