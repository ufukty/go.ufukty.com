import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the modules.json your file imports so tests are deterministic.
// NOTE: This path ("../modules.json") should match exactly how it's imported in index.ts.
// If your test file lives elsewhere, adjust this path accordingly.
vi.mock("../modules.json", () => {
  return {
    default: [
      {
        module: "foo/bar",
        vcs: "git",
        repo: "https://example.com/acme/repo",
      },
    ],
  };
});

// Import the worker/app AFTER the mock is defined
// If this test file is next to index.ts, "./index" is correct.
// Otherwise, adjust the path as needed.
import app from "./index";

describe("index.ts fetch handler", () => {
  // Some environments may reuse state; keep a clean slate each test.
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns an HTML response for matching module with ?go-get=1", async () => {
    const req = new Request("https://proxy.test/foo/bar?go-get=1");
    const res = await (app as { fetch: (r: Request) => Promise<Response> }).fetch(req);

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toMatch(/text\/html/i);

    const body = await res.text();
    // Your render() returns an HTML document (starts with <!DOCTYPE html> in your code)
    expect(body).toMatch(/<!DOCTYPE html>/i);
  });

  it("handles trailing slashes using trimSlashes (still matches module) with ?go-get=1", async () => {
    const req = new Request("https://proxy.test/foo/bar/?go-get=1");
    const res = await (app as { fetch: (r: Request) => Promise<Response> }).fetch(req);

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toMatch(/text\/html/i);

    const body = await res.text();
    expect(body.length).toBeGreaterThan(0);
  });

  it("redirects to the homepage for root path '/'", async () => {
    const req = new Request("https://proxy.test/");
    const res = await (app as { fetch: (r: Request) => Promise<Response> }).fetch(req);

    expect(res.status).toBe(308);
    expect(res.headers.get("location")).toBe("https://ufukty.com");
  });

  it("redirects when ?go-get is missing even if module matches", async () => {
    const req = new Request("https://proxy.test/foo/bar");
    const res = await (app as { fetch: (r: Request) => Promise<Response> }).fetch(req);

    expect(res.status).toBe(308);
    expect(res.headers.get("location")).toBe("https://ufukty.com");
  });

  it("redirects when the module does not match", async () => {
    const req = new Request("https://proxy.test/not/a/module?go-get=1");
    const res = await (app as { fetch: (r: Request) => Promise<Response> }).fetch(req);

    expect(res.status).toBe(308);
    expect(res.headers.get("location")).toBe("https://ufukty.com");
  });
});
