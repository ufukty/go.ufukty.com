export interface ModuleMirror {
  /**
   * Module import path prefix handled by this worker.
   * e.g. `golang.org/x/mod`.
   */
  module: string;
  /**
   * Version control system type.
   * Common values: `git`, `hg`, `svn`.
   */
  vcs: string;
  /**
   * Remote repository URL.
   */
  repo: string;
  /**
   * Optional source browser information for go-source meta tags.
   */
  source?: {
    /** Base URL for browsing documentation. */
    home: string;
    /** Base URL for directory listings. */
    dir: string;
    /** Base URL for files. */
    file: string;
  };
  /** Optional friendly landing page to redirect human visitors. */
  homepage?: string;
}

export const MODULE_MIRRORS: ModuleMirror[] = [
  {
    module: "golang.org/x/mod",
    vcs: "git",
    repo: "https://go.googlesource.com/mod",
    source: {
      home: "https://cs.opensource.google/go/x/mod",
      dir: "https://cs.opensource.google/go/x/mod/+/refs/heads/master/{dir}",
      file: "https://cs.opensource.google/go/x/mod/+/refs/heads/master/{dir}/{file}#L{line}",
    },
    homepage: "https://pkg.go.dev/golang.org/x/mod",
  },
  {
    module: "golang.org/x/tools",
    vcs: "git",
    repo: "https://go.googlesource.com/tools",
    source: {
      home: "https://cs.opensource.google/go/x/tools",
      dir: "https://cs.opensource.google/go/x/tools/+/refs/heads/master/{dir}",
      file: "https://cs.opensource.google/go/x/tools/+/refs/heads/master/{dir}/{file}#L{line}",
    },
    homepage: "https://pkg.go.dev/golang.org/x/tools",
  },
];

export const MODULE_MIRRORS_BY_LENGTH = [...MODULE_MIRRORS].sort(
  (a, b) => b.module.length - a.module.length,
);
