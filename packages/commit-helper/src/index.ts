import { execSync } from 'child_process';
import { parseArgs } from './argParser';

const main = async (args?: string[]) => {
  if (!args) return;
  const result = await parseArgs(args);
  const day = result.day;

  execSync('git add --all');
  execSync(`git commit -m "Day ${day}"`);
  execSync('git push');
};

void main(process.argv);
