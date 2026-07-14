export type Mode = 'pages' | 'scroll';

export type TomeOptions = {
  file: string;
  mode: Mode;
  theme: string;
  port: number;
  open: boolean;
};

export type TomePage = {
  title: string;
  level: number;
  content: string;
};

export type TomeDocument = {
  kind: 'document';
  fileName: string;
  /** Path relative to the served root directory, posix-separated. Used to resolve links between documents. */
  path: string;
  markdown: string;
  pages: TomePage[];
};

export type TomeIndexEntry = {
  /** Path relative to the served root directory, posix-separated. */
  path: string;
  title: string;
};

export type TomeIndex = {
  kind: 'index';
  /** Path of this directory relative to the served root directory, posix-separated ('' for the root). */
  path: string;
  dirName: string;
  entries: TomeIndexEntry[];
};

export type TomeEntry = TomeDocument | TomeIndex;
