import { Day, getInput } from '@cheemcheem/adventofcode-common';

const day: Day = {
  part1: async (dayNumber, example) => {
    const input = await getInput(dayNumber, example);
    const instructions = input.matchAll(/mul\(\d\d?\d?,\d\d?\d?\)/g);
    const result = instructions.reduce((prev, [curr]) => {
      const commmaSeparated = curr.replaceAll(/(mul)|\(|\)/g, '');
      const [a, b] = commmaSeparated.split(',').map(Number);
      return prev + (a * b);
    }, 0);
    return result;
  },
  part2: async (dayNumber, example) => {
    const input = await getInput(dayNumber, example);
    const conditionals = input.matchAll(/do(n't)?\(\)/g).toArray().reverse();
    const instructions = input.matchAll(/mul\(\d\d?\d?,\d\d?\d?\)/g).toArray();
   
    const result = instructions.reduce((prev, {"0": curr, index}) => {
      const [mostRecentConditional] = conditionals.find(({index: conditionalIndex}) => {
        return conditionalIndex < index;
      }) ?? []

      if (mostRecentConditional === "don't()") {
        return prev;
      }

      const commmaSeparated = curr.replaceAll(/(mul)|\(|\)/g, '');
      const [a, b] = commmaSeparated.split(',').map(Number);
      return prev + (a * b);
    }, 0);
    
    return result;
  },
};

export default day;
