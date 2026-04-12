import data from "../modules.json";

const home = "https://ufukty.com";

function trimSlashes(pathname: string): string {
  return pathname.replace(/^\/+|\/+$/g, "");
}

interface Module {
  module: string;
  repo: string;
  vcs: string;
  visits: string;
}

const file: Module[] = data;

async function renderGoImportResponse(proxy: string, m: Module): Promise<Response> {
  return new Response(
    `<!DOCTYPE html>
<html>
<head>
<meta name="go-import" content="${proxy}/${m.module} ${m.vcs} ${m.repo}">
<meta http-equiv="refresh" content="0;URL='${home}'">
</head>
<body>
Redirecting...
</body>
</html>`,
    {
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
    },
  );
}

async function notFound(): Promise<Response> {
  return new Response(
    `<!DOCTYPE html>
<html>
<head>
</head>
<body>
<h1>Not found</h1>
<p>Want to return <a href="${home}">home</a>?</p>
</body>
</html>`,
    {
      status: 404,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
      },
    },
  );
}

function match(target: string): Module | undefined {
  if (target === "/") return undefined;
  target = trimSlashes(target);
  return file.find((m) => target === m.module);
}

export default async function fetch(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const target = match(url.pathname);
  const isGoTools = url.searchParams.get("go-get") === "1";

  if (target) {
    if (isGoTools) return renderGoImportResponse(url.hostname, target);
    else return Response.redirect(target.visits, 302);
  } else {
    return notFound();
  }
}
