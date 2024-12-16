import { Day, getInput, runMultipleTimes, sumArray } from '@cheemcheem/adventofcode-common';
import { isMainThread, parentPort, Worker } from 'worker_threads';

const applyRuleToStone = (stone: number) => {
  if (stone === 0) {
    return [1];
  }
  const stoneString = String(stone);
  if (stoneString.length % 2 === 0) {
    return [
      Number(stoneString.substring(0, stoneString.length / 2)),
      Number(stoneString.substring(stoneString.length / 2)),
    ];
  }
  return [stone * 2024];
};

let runningTotalPart2 = 0;
const applyRuleToStoneRecursive = (stone: number, count: number): number => {
  // console.log('count', count);
  if (count === 0) {
    console.log('runningTotalPart2', ++runningTotalPart2);
    return 1;
  }

  const newStones = applyRuleToStone(stone);

  return sumArray(newStones.map(newStone => applyRuleToStoneRecursive(newStone, count - 1)));
};

const runningTotalMultiThreadPart2 = 0;
// This is dangerous
const applyRuleToStoneRecursiveMultiThread = async (stone: number, count: number): Promise<number> => {
  if (isMainThread) {
    console.log(__filename);
    const worker = new Worker(__filename);
    const result = await new Promise<number>((resolve) => {
      worker.on('message', (value: number) => resolve(value));
    });
    return result;
  } else {
    const result = applyRuleToStoneRecursive(stone, count);
    console.log('result', result);
    parentPort?.postMessage(result);
    return Promise.resolve(result);
  }
};

type StoneMap = Record<number, { countMap: Record<number, number> }>;
const applyRuleToStoneWithMap = (stone: number, count: number, stoneMap: StoneMap = {}): number => {
  if (stoneMap[stone] && stoneMap[stone].countMap[count]) {
    // console.log('caught', ++runningTotalPart2);
    return stoneMap[stone].countMap[count];
  }
  // console.log('count', count);
  if (count === 0) {
    // console.log('runningTotalPart2', ++runningTotalPart2, 'stone', stone, 'count', count);
    return 1;
  }

  const newStones = applyRuleToStone(stone);

  return sumArray(newStones.map((newStone) => {
    const result = applyRuleToStoneWithMap(newStone, count - 1, stoneMap);
    // console.log('stone', newStone, 'count', count - 1, 'result', result);
    if (!stoneMap[newStone]) {
      stoneMap[newStone] = {
        countMap: {
          [count - 1]: result,
        },
      };
    } else {
      stoneMap[newStone] = {
        ...stoneMap[newStone],
        countMap: {
          ...stoneMap[newStone].countMap,
          [count - 1]: result,
        },
      };
    }
    // console.log('stoneMap', stoneMap);
    return result;
  }));
};

const day: Day = {
  part1: async (dayNumber, example) => {
    const stones = (await getInput(dayNumber, example)).split(' ').map(Number);
    const result = runMultipleTimes({ initial: stones, count: 25, callback: stones => stones.flatMap(applyRuleToStone) });
    return result.length;
  },
  part2: async (dayNumber, example) => {
    const stones = (await getInput(dayNumber, example)).split(' ').map(Number);
    // const stones = ('0 0').split(' ').map(Number);

    // Creates an array that is too large
    // const result = runMultipleTimes({ initial: stones, count: 25, callback: stones => stones.flatMap(applyRuleToStone) });

    // Takes 3 million years
    // const result = sumArray((stones.map(stone => applyRuleToStoneRecursive(stone, 75))));

    // Runs random advent of code days in different worker threads
    // const result = sumArray(await Promise.all(stones.map(stone => applyRuleToStoneRecursiveMultiThread(stone, 75))));

    // instantaneous
    const stoneMap = {};
    const result = sumArray((stones.map(stone => applyRuleToStoneWithMap(stone, 75, stoneMap))));

    return result;
  },
};

export default day;
