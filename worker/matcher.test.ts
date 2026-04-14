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
  const moduleIrrelevant = {
    module: "k",
    repo: "https://github.com/ufukty/k",
    vcs: "git",
    visits: "0",
  };
  const modules = [moduleIrrelevant, moduleKask, moduleGonfique];
  const matcher = new Matcher(modules);

  it("returns undefined for root", () => {
    expect(matcher.Match("/")).toBeUndefined();
  });

  it("matches a module by exact path", () => {
    expect(matcher.Match("kask")).toEqual(moduleKask);
  });

  it("matches a versioned module by exact path", () => {
    expect(matcher.Match("kask/v2")).toEqual(moduleKask);
  });

  it("returns module root for contained packages", () => {
    expect(matcher.Match("kask/pkg/kask")).toEqual(moduleKask);
  });

  it("returns module root for contained packages of versioned module", () => {
    expect(matcher.Match("kask/v2/pkg/kask")).toEqual(moduleKask);
  });

  it("returns undefined for unknown modules", () => {
    expect(matcher.Match("unknown")).toBeUndefined();
  });
});
