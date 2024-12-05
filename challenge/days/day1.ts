import { Day, getInputSplitByLine } from '@cheemcheem/adventofcode-common';

const day: Day = {
  part1: async (dayNumber, example) => {
    const input = await getInputSplitByLine(dayNumber, example);

    const { left, right } = input.reduce((prev, curr) => {
      const [currLeft, currRight] = curr.split('  ');
      prev.left.push(Number(currLeft));
      prev.right.push(Number(currRight));
      return prev;
    }, { left: [] as number[], right: [] as number[] });

    left.sort();
    right.sort();

    const totalDistance = input.reduce((prev, _, index) => {
      return prev + Math.abs(left[index] - right[index]);
    }, 0);

    return totalDistance;
  },
  part2: async (dayNumber, example) => {
    const input = await getInputSplitByLine(dayNumber, example);

    const { left, right } = input.reduce((prev, curr) => {
      const [currLeft, currRight] = curr.split('  ');
      prev.left.push(Number(currLeft));
      prev.right.push(Number(currRight));
      return prev;
    }, { left: [] as number[], right: [] as number[] });

    const countInRight = (leftValue: number) => {
      return right.filter(rightValue => rightValue === leftValue).length;
    };

    const similaritySum = input.reduce((prev, _, index) => {
      return prev + Math.abs(left[index] * countInRight(left[index]));
    }, 0);

    return similaritySum;
  },
};

export default day;
