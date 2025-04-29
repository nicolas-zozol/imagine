import './hello-ai.js';
import dotenv from 'dotenv';
import {BrowserManager} from "../puppets/browser/index.js";
import {Action, ActionOptions} from "../puppets/types/actions.js";
import { ActionFactory } from '../puppets/actions/factory.js';
import fs from 'node:fs/promises';

dotenv.config();

function parseLine(line: string): { action: Action; params: string[] } {
  const [actionName, ...rest] = line.trim().split(/\s+/);
  return { action: actionName as Action, params: rest };
}

async function runScript(script: string, keepOpenFlag = false) {
  const browserManager = new BrowserManager();
  const factory         = new ActionFactory(browserManager);

  await browserManager.launch();

  // sequential execution – for-of + await keeps order intact
  for (const rawLine of script.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;          // skip blank / comment

    const { action, params }  = parseLine(line);
    const options: ActionOptions = { keepOpen: keepOpenFlag };

    const handler = factory.createAction(action, options);
    console.log('▶', line);
    await handler.execute(params, options);
  }

  if (!keepOpenFlag) await browserManager.close();
}


async function main() {
  const [arg1, ...rest] = process.argv.slice(2);

  // Case A: user passed a filename → treat file content as the script
  if (arg1 && (arg1.endsWith('.txt')||arg1.endsWith('.md'))) {
    const script = await fs.readFile(arg1, 'utf8');
    const keepOpen = rest.includes('--keep-open');
    await runScript(script, keepOpen);
    return;
  }

  // Case B: fallback to previous single-action mode
  const { action, params, options } = parseArgs([arg1, ...rest]);
  const browserManager = new BrowserManager();
  const factory = new ActionFactory(browserManager);

  try {
    await browserManager.launch();
    await factory.createAction(action, options).execute(params, options);
  } finally {
    if (!options.keepOpen) await browserManager.close();
  }
}

main().catch(console.error);




function parseArgs(args: string[]): {
  action: Action;
  params: string[];
  options: ActionOptions;
} {
  const keepOpenIndex = args.indexOf('--keep-open');
  const keepOpen = keepOpenIndex !== -1;

  // Remove the --keep-open flag if present
  const filteredArgs = keepOpen
      ? args.filter((_, i) => i !== keepOpenIndex)
      : args;

  if (filteredArgs.length === 0) {
    console.log('Usage: yarn puppets <action> [params...] [--keep-open]');
    console.log('\nAvailable actions:');
    console.log(
        '  search <term1> [term2] ... - Search Google for terms (closes by default)',
    );
    console.log('  open <url> - Open a website (stays open by default)');
    console.log('\nOptions:');
    console.log('  --keep-open - Override the default behavior for the action');
    process.exit(1);
  }

  const [actionName, ...params] = filteredArgs;
  const action = actionName as Action;

  return {
    action,
    params,
    options: { keepOpen },
  };
}