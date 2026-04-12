import data from "../modules.json";

export interface Module {
  module: string;
  repo: string;
  vcs: string;
  visits: string;
}

const file: Module[] = data;

function trimSlashes(pathname: string): string {
  return pathname.replace(/^\/+|\/+$/g, "");
}

export function Match(target: string): Module | undefined {
  if (target === "/") return undefined;
  target = trimSlashes(target);
  return file.find((m) => target === m.module);
}
