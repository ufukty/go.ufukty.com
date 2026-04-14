export interface Module {
  module: string;
  repo: string;
  vcs: string;
  visits: string;
  major: number;
}

function trimSlashes(pathname: string): string {
  return pathname.replace(/^\/+|\/+$/g, "");
}

export class Matcher {
  modules: Module[];

  constructor(modules: Module[]) {
    this.modules = modules;
  }

  Match(target: string): Module | undefined {
    if (target === "/") return undefined;
    target = trimSlashes(target);
    return this.modules.find((m) => target === m.module);
  }
}
