import { Day, getInputSplitByDoubleLine, sumArray } from '@cheemcheem/adventofcode-common';
import { EOL } from 'os';

const matchPattern = (targetPattern: string, availablePatterns: string[], currentIndex: number = 0, badStartingIndices: number[] = []): boolean => {
  if (badStartingIndices.includes(currentIndex)) {
    console.log('bad start ind', currentIndex, targetPattern.length);
    return false;
  }

  // return false if out of bounds
  if (currentIndex >= targetPattern.length) {
    console.log('out of bounds', currentIndex, targetPattern.length);
    return false;
  }

  // if reached end then return true
  if (currentIndex === targetPattern.length - 1 && availablePatterns.includes(targetPattern[currentIndex])) {
    console.log('reached end  ', targetPattern[currentIndex], currentIndex, targetPattern.length);
    return true;
  }

  const possiblePatterns = availablePatterns.filter((availablePattern) => {
    // currentIndex + availablePattern.length + 1 <= targetPattern.length &&
    return availablePattern === targetPattern.substring(currentIndex, currentIndex + availablePattern.length);
  });

  const anyPossiblePatternsFinish = possiblePatterns.find(possiblePattern => currentIndex + possiblePattern.length === targetPattern.length);
  if (anyPossiblePatternsFinish) {
    // if any possible patterns take us to the end, return true
    console.log('reached end  ', targetPattern[currentIndex], currentIndex, anyPossiblePatternsFinish);
    return true;
  }

  console.log('iterating    ', targetPattern[currentIndex], currentIndex, possiblePatterns);
  const isPossible = possiblePatterns.some(possiblePattern => matchPattern(
    targetPattern,
    availablePatterns,
    currentIndex + possiblePattern.length,
    badStartingIndices,
  ));

  if (!isPossible) {
    badStartingIndices.push(currentIndex);
  }

  return isPossible;
};

const matchPatternCount = (targetPattern: string, availablePatterns: string[], currentIndex: number = 0, indexResultMap: Map<number, number> = new Map()): number => {
  if (indexResultMap.has(currentIndex)) {
    // console.log('bad start ind', currentIndex, targetPattern.length);
    return indexResultMap.get(currentIndex)!;
  }

  // return false if out of bounds
  if (currentIndex >= targetPattern.length) {
    // console.log('out of bounds', currentIndex, targetPattern.length);
    indexResultMap.set(currentIndex, 0);
    return 0;
  }

  // if reached end then return true
  if (currentIndex === targetPattern.length - 1 && availablePatterns.includes(targetPattern[currentIndex])) {
    // console.log('reached end  ', targetPattern[currentIndex], currentIndex, targetPattern.length);
    indexResultMap.set(currentIndex, 1);
    return 1;
  }

  const possiblePatterns = availablePatterns.filter((availablePattern) => {
    // currentIndex + availablePattern.length + 1 <= targetPattern.length &&
    return availablePattern === targetPattern.substring(currentIndex, currentIndex + availablePattern.length);
  });

  const anyPossiblePatternsFinish = possiblePatterns.filter(possiblePattern => currentIndex + possiblePattern.length === targetPattern.length);
  // if (anyPossiblePatternsFinish.length > 0) {
  //   // if any possible patterns take us to the end, return true
  //   console.log('reached end  ', targetPattern[currentIndex], currentIndex, anyPossiblePatternsFinish);
  //   return anyPossiblePatternsFinish.length;
  // }

  // console.log('iterating    ', targetPattern[currentIndex], currentIndex, possiblePatterns);
  const isPossible = possiblePatterns
    // .filter(possiblePattern => currentIndex + possiblePattern.length < targetPattern.length)
    .map(possiblePattern => matchPatternCount(
      targetPattern,
      availablePatterns,
      currentIndex + possiblePattern.length,
      indexResultMap,
    ));

  // isPossible.forEach(result => )

  // if (isPossible.every(index => index === 0)) {
  //   badStartingIndices.push(currentIndex);
  // }

  const result = sumArray(isPossible) + anyPossiblePatternsFinish.length;
  indexResultMap.set(currentIndex, result);
  return result;
};

const day: Day = {
  part1: async (dayNumber, example) => {
    const [availableString, targetsString] = await getInputSplitByDoubleLine(dayNumber, example);
    const availablePatterns = availableString.split(',').map(pattern => pattern.trim());
    const targetPatterns = targetsString.split(EOL);
    console.log(availablePatterns, targetPatterns);

    const possibleTargetPatterns = targetPatterns.filter((targetPattern) => {
      // if (targetPattern !== 'rgruurwubbgggwwuwwgurrwuugggbrbuwgwrubrgw') {
      //   return false;
      // }
      const isPossible = matchPattern(targetPattern, availablePatterns);
      console.log('targetPattern', targetPattern, isPossible);
      return isPossible;
    });

    // console.log('possibleTargetPatterns', possibleTargetPatterns);
    return possibleTargetPatterns.length;
  },
  part2: async (dayNumber, example) => {
    const [availableString, targetsString] = await getInputSplitByDoubleLine(dayNumber, example);
    const availablePatterns = availableString.split(',').map(pattern => pattern.trim());
    const targetPatterns = targetsString.split(EOL);
    console.log(availablePatterns, targetPatterns);

    const possibleTargetPatterns = targetPatterns.map((targetPattern) => {
      // if (targetPattern !== 'rgruurwubbgggwwuwwgurrwuugggbrbuwgwrubrgw') {
      //   return false;
      // }
      const isPossible = matchPatternCount(targetPattern, availablePatterns);
      console.log('targetPattern', targetPattern, isPossible);
      return isPossible;
    });

    // console.log('possibleTargetPatterns', possibleTargetPatterns);
    return sumArray(possibleTargetPatterns);
  },
};

export default day;
