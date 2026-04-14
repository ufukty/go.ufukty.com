import { describe, expect, it } from "vitest";
import { Matcher } from "./matcher";

describe("Match", () => {
  const moduleKask = {
    module: "kask",
    repo: "https://github.com/ufukty/kask",
    vcs: "git",
    visits: "0",
  };
  const moduleGonfique = {
    module: "gonfique",
    repo: "https://github.com/ufukty/gonfique",
    vcs: "git",
    visits: "0",
  };
  const modules = [moduleKask, moduleGonfique];
  const matcher = new Matcher(modules);

  it("returns undefined for root", () => {
    expect(matcher.Match("/")).toBeUndefined();
  });

  it("matches a module by exact path", () => {
    expect(matcher.Match("kask")).toEqual(moduleKask);
  });

  it("matches after trimming leading and trailing slashes", () => {
    expect(matcher.Match("///lib///")).toBeUndefined();
  });

  it("does not resolve a package path to its module", () => {
    expect(matcher.Match("/gonfique/sub/pkg")).toBeUndefined();
  });

  it("does not resolve a package path under a versioned module", () => {
    expect(matcher.Match("/gonfique/v2/sub/pkg")).toBeUndefined();
  });

  it("does not infer unknown major versions", () => {
    expect(matcher.Match("/gonfique/v3")).toBeUndefined();
  });

  it("returns undefined for unknown modules", () => {
    expect(matcher.Match("/unknown")).toBeUndefined();
  });
});
