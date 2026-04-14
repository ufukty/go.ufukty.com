export interface Module {
  module: string;
  repo: string;
  vcs: string;
  visits: string;
}

function trimLeadingSlashes(pathname: string): string {
  return pathname.replace(/^\/+/g, "");
}

function sort(modules: Module[]) {
  modules.sort((a, b) => {
    if (a === b) return 0;
    if (a.module.startsWith(b.module.toString())) return -1;
    if (b.module.startsWith(a.module.toString())) return 1;
    if (a < b) return -1;
    return 1;
  });
}

export class Matcher {
  modules: Module[];

  constructor(modules: Module[]) {
    this.modules = modules;
    sort(this.modules);
  }

  Match(target: string): Module | undefined {
    if (target === "/") return undefined;
    target = trimLeadingSlashes(target);
    for (const module of this.modules) {
      if (target.startsWith(module.module.toString())) {
        return module;
      }
    }
    return undefined;
  }
}
