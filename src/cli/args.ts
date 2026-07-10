import { existsSync, statSync } from 'node:fs';
import { extname, resolve } from 'node:path';
import type { TomeOptions } from '../shared/types.js';

export function parseArgs(argv: string[]): TomeOptions {
  const file = positional(argv);
  if (!file) fail('Usage: tome <file.md> [--mode pages|scroll] [--theme light|dark|system] [--port 4321] [--no-open]');

  const options: TomeOptions = {
    file: resolve(file),
    mode: value(argv, '--mode', 'pages') as TomeOptions['mode'],
    theme: value(argv, '--theme', 'system'),
    port: Number(value(argv, '--port', '4321')),
    open: !argv.includes('--no-open')
  };

  if (!['pages', 'scroll'].includes(options.mode)) fail('--mode must be pages or scroll');
  if (!['light', 'dark', 'system'].includes(options.theme)) fail('--theme must be light, dark, or system');
  if (!Number.isInteger(options.port) || options.port < 1) fail('--port must be a positive number');
  if (!existsSync(options.file)) fail(`File not found: ${options.file}`);
  if (!statSync(options.file).isFile()) fail(`Not a file: ${options.file}`);
  if (!['.md', '.markdown'].includes(extname(options.file).toLowerCase())) fail('Unsupported extension. Use .md or .markdown');

  return options;
}

function value(argv: string[], flag: string, fallback: string) {
  const index = argv.indexOf(flag);
  return index === -1 ? fallback : argv[index + 1] ?? fail(`Missing value for ${flag}`);
}

function positional(argv: string[]) {
  const valuedFlags = new Set(['--mode', '--theme', '--port']);
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    if (valuedFlags.has(arg)) index++;
    else if (!arg.startsWith('-')) return arg;
  }
}

function fail(message: string): never {
  console.error(`Tome: ${message}`);
  process.exit(1);
}
