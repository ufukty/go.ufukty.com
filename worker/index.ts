import { ModulesByLength, type Module } from "./module";
import { renderGoGetMeta, renderLandingPage, renderNotFound } from "./templates";

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

function findModuleMirror(path: string): Module | undefined {
  if (path === "") {
    return undefined;
  }

  // Compute the longest matching module prefix so that nested packages
  // (e.g. golang.org/x/mod/module) resolve to the correct meta tags.
  return ModulesByLength.find(({ module }) => path === module || path.startsWith(`${module}/`));
}
