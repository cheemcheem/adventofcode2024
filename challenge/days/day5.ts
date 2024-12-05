import { Day, getInputSplitByDoubleLine } from '@cheemcheem/adventofcode-common';

const isValidUpdate = (update: number[], rules: number[][]) => {
  for (const [first, second] of rules) {
    const firstIndex = update.indexOf(first);
    const secondIndex = update.indexOf(second);
    if (firstIndex >= 0 && secondIndex >= 0 && firstIndex > secondIndex) {
      return false;
    }
  }
  return true;
};

const correctOrdering = (update: number[], rules: number[][]) => {
  // could be made more performant
  if (isValidUpdate(update, rules)) {
    return update;
  }

  for (const [first, second] of rules) {
    const firstIndex = update.indexOf(first);
    const secondIndex = update.indexOf(second);
    if (firstIndex >= 0 && secondIndex >= 0 && firstIndex > secondIndex) {
      const duplicate = [...update];
      return correctOrdering([
        ...duplicate.slice(0, secondIndex),
        ...duplicate.splice(firstIndex, 1),
        ...duplicate.slice(secondIndex, duplicate.length),
      ], rules);
    }
  }
  return update;
};

const day: Day = {
  part1: async (dayNumber, example) => {
    const [ruleStrings, updateStrings] = await getInputSplitByDoubleLine(dayNumber, example);

    const rules = ruleStrings.split('\n').map(rule => rule.split('|').map(Number));
    const updates = updateStrings.split('\n').map(update => update.split(',').map(Number));

    const validUpdates = updates.filter(update => isValidUpdate(update, rules));

    return validUpdates.reduce((prev, curr) => {
      return prev + curr[Math.floor(curr.length / 2)];
    }, 0);
  },
  part2: async (dayNumber, example) => {
    const [ruleStrings, updateStrings] = await getInputSplitByDoubleLine(dayNumber, example);

    const rules = ruleStrings.split('\n').map(rule => rule.split('|').map(Number));
    const updates = updateStrings.split('\n').map(update => update.split(',').map(Number));

    const invalidUpdates = updates.filter(update => !isValidUpdate(update, rules));
    const correctedUpdates = invalidUpdates.map(update => correctOrdering(update, rules));

    return correctedUpdates.reduce((prev, curr) => {
      return prev + curr[Math.floor(curr.length / 2)];
    }, 0);
  },
};

export default day;
