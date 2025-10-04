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
  /** Optional friendly landing page to redirect human visitors. */
  homepage?: string;
}
