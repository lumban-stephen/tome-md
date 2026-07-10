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
  markdown: string;
  pages: TomePage[];
};
