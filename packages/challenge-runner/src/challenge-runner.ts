import { DayNumber, ERROR_MESSAGE, PartNumber } from '@cheemcheem/adventofcode-common';
import { days } from '@cheemcheem/adventofcode-challenge';

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

export const runAll = async (hasExample?: boolean | 1 | 2) => {
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

export const runOne = async (dayNumber: DayNumber, part?: PartNumber, hasExample?: PartNumber) => {
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
