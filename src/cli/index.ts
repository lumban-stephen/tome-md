#!/usr/bin/env node
import chokidar from 'chokidar';
import open from 'open';
import { parseArgs } from './args.js';
import { startServer } from './server.js';

async function main() {
  try {
    const options = parseArgs(process.argv.slice(2));
    const server = await startServer(options);
    chokidar.watch(options.file, { ignoreInitial: true }).on('change', server.reload);

    console.log(`Tome reading ${options.file}`);
    console.log(server.url);

    if (options.open) await open(server.url);
  } catch (error) {
    console.error(`Tome: ${error instanceof Error ? error.message : 'Something went wrong'}`);
    process.exit(1);
  }
}

main();
