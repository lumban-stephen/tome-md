#!/usr/bin/env node
import chokidar from 'chokidar';
import open from 'open';
import { statSync } from 'node:fs';
import { dirname, extname } from 'node:path';
import { parseArgs } from './args.js';
import { startServer } from './server.js';

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2));
    const server = await startServer(options);
    const docRoot = statSync(options.file).isDirectory() ? options.file : dirname(options.file);
    chokidar
      .watch(docRoot, { ignoreInitial: true, ignored: /(^|[/\\])(node_modules|\.git|dist)([/\\]|$)/ })
      .on('all', (_event, path) => {
        if (['.md', '.markdown'].includes(extname(path).toLowerCase())) server.reload();
      });

    console.log(`Tome reading ${options.file}`);
    console.log(server.url);

    if (options.open) await open(server.url);
  } catch (error) {
    console.error(`Tome: ${error instanceof Error ? error.message : 'Something went wrong'}`);
    process.exit(1);
  }
}

main();
