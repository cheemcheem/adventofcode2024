import { DayNumber, PartNumber } from '@cheemcheem/adventofcode-common';
import { parseArgs } from './argParser.js';
import { runOne, runAll } from './challenge-runner.js';

const main = async () => {
  const result = await parseArgs(process.argv);
  const day = result.day as DayNumber;
  const part = result.part as PartNumber | undefined;
  const example = result.example as PartNumber | undefined;

  await (day ? runOne(day, part, example) : runAll(example));
};

void main();
