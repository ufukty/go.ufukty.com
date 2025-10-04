import data from "../modules.json";

export interface Module {
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

export const MODULE_MIRRORS: Module[] = data;

export const MODULE_MIRRORS_BY_LENGTH = [...MODULE_MIRRORS].sort((a, b) => b.module.length - a.module.length);
