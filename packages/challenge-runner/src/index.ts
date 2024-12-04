import { DayNumber, ERROR_MESSAGE, PartNumber } from '@cheemcheem/adventofcode-common';
import { days } from '@cheemcheem/adventofcode-challenge';
import { parseArgs } from './argParser';

const main = async (args?: string[]) => {
  if (!args) return;
  const result = await parseArgs(args);
  const day = result.day as DayNumber;
  const part = result.part as PartNumber | undefined;
  const example = result.example as PartNumber | undefined;

  await (day ? runOne(day, part, example) : runAll(example));
};

const getSolutions = async (example?: PartNumber) => {
  if (example) {
    return await Promise.all(
      days.flatMap(async (day, index) => [
        {
          part: example,
          answer: await (example === 1
            ? day.part1((index + 1) as DayNumber, example)
            : day.part2((index + 1) as DayNumber, example)),
        },
      ]),
    );
  }

  return await Promise.all(
    days.flatMap(async (day, index) => [
      { part: 1, answer: await day.part1((index + 1) as DayNumber, example) },
      { part: 2, answer: await day.part2((index + 1) as DayNumber, example) },
    ]),
  );
};

const runAll = async (hasExample?: boolean | 1 | 2) => {
  let solutions;
  if (hasExample) {
    const solutions1 = await getSolutions(1);
    const solutions2 = await getSolutions(2);

    if (solutions1.length !== solutions2.length) throw ERROR_MESSAGE;

    solutions = [];
    for (let i = 0; i < solutions1.length; i++) {
      solutions.push([...solutions1[i], ...solutions2[i]]);
    }
  } else {
    solutions = await getSolutions();
  }

  solutions.map((solution, day) => {
    day++;
    console.log({
      day,
      solution,
    });
  });
};

const runOne = async (dayNumber: DayNumber, part?: PartNumber, hasExample?: PartNumber) => {
  const solution = [];
  const day = days[dayNumber - 1];

  if (!part || part === 1) {
    solution.push({ part: 1, answer: await day.part1(dayNumber, hasExample) });
  }
  if (!part || part === 2) {
    solution.push({ part: 2, answer: await day.part2(dayNumber, hasExample) });
  }

  console.log({
    day: dayNumber,
    solution,
  });
};

void main(process.argv);