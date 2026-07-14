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
  fileName: string;
  /** Path relative to the served root directory, posix-separated. Used to resolve links between documents. */
  path: string;
  markdown: string;
  pages: TomePage[];
};
