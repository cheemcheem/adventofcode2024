import { Day, getInput } from '@cheemcheem/adventofcode-common';

const isEven = (input: number) => input % 2 === 0;

const getNSymbols = (n: Readonly<string>, length: number) => {
  return Array.from({ length }).map(() => n);
};

/**
 * @param diskMap 12345
 * @returns [0..111....22222]
 */
const expandDiskMap = (diskMap: Readonly<string>) => {
  return diskMap.split('').flatMap((curr, index) => {
    if (isEven(index)) {
      return getNSymbols(`${Math.floor(index / 2)}`, Number(curr));
    }
    return getNSymbols('.', Number(curr));
  });
};

const getLastNumberIndex = (expandedDiskMap: Readonly<string[]>) => {
  for (let i = expandedDiskMap.length - 1; i >= 0; i--) {
    // console.log('searching for .', expandedDiskMap[i]);
    if (expandedDiskMap[i] !== '.') {
      return i;
    }
  }

  return -1;
};

/**
 * @param expandedDiskMap [0..111....22222]
 * @returns [022111222......]
 */
const fillDiskMapGaps = (expandedDiskMap: Readonly<string[]>) => {
  const currentExpandedDiskMap = [...expandedDiskMap];

  console.log('filling length:', currentExpandedDiskMap.length);
  while (true) {
    const lastNumberIndex = getLastNumberIndex(currentExpandedDiskMap);
    const firstDotIndex = currentExpandedDiskMap.indexOf('.');
    // console.log('firstDotIndex', firstDotIndex, 'lastNumberIndex', lastNumberIndex);
    if (lastNumberIndex <= firstDotIndex) {
      break;
    }

    currentExpandedDiskMap[firstDotIndex] = currentExpandedDiskMap[lastNumberIndex];
    currentExpandedDiskMap[lastNumberIndex] = '.';
  }

  return currentExpandedDiskMap;
};

const getLastNumberIndices = (expandedDiskMap: Readonly<string[]>, lastIndex: number) => {
  while (lastIndex >= 0) {
    // console.log('searching for .', expandedDiskMap[i]);
    if (expandedDiskMap[lastIndex] === '.') {
      lastIndex--;
      continue;
    }

    let firstIndex = lastIndex;
    // find earliest first index for number that matches last index
    while (firstIndex >= 0 && expandedDiskMap[firstIndex] === expandedDiskMap[lastIndex]) {
      firstIndex--;
    }
    firstIndex++;

    return { firstIndex, lastIndex };
  }

  return undefined;
};

const getFirstDotIndices = (expandedDiskMap: Readonly<string[]>, requiredLength: number) => {
  for (let firstIndex = 0; firstIndex < expandedDiskMap.length; firstIndex++) {
    // console.log('searching for .', expandedDiskMap[i]);
    if (expandedDiskMap[firstIndex] !== '.') {
      continue;
    }

    let lastIndex = firstIndex;
    // find earliest first index for number that matches last index
    while (lastIndex < expandedDiskMap.length && expandedDiskMap[lastIndex] === '.' && lastIndex - firstIndex < requiredLength) {
      lastIndex++;
    }
    lastIndex--;

    if (lastIndex - firstIndex === requiredLength - 1) {
      return { firstIndex, lastIndex };
    }

    firstIndex = lastIndex + 1;
  }

  return undefined;
};

/**
 * @param expandedDiskMap [0..111....22222]
 * @returns [022111222......]
 */
const fillDiskMapGapsWithWholeFiles = (expandedDiskMap: Readonly<string[]>) => {
  const currentExpandedDiskMap = [...expandedDiskMap];

  console.log('filling length:', currentExpandedDiskMap.length);
  for (let lastIndex = expandedDiskMap.length - 1; lastIndex >= 0; lastIndex--) {
    const lastNumberIndices = getLastNumberIndices(currentExpandedDiskMap, lastIndex);
    // console.log('lastNumberIndices', lastNumberIndices);
    if (!lastNumberIndices) {
      continue; // idk
    }

    // last index - first index will 1 off
    const requiredSize = 1 + lastNumberIndices.lastIndex - lastNumberIndices.firstIndex;
    // find gap that is below required size and move if possible
    const firstDotIndices = getFirstDotIndices(currentExpandedDiskMap, requiredSize);
    console.log('firstDotIndices', firstDotIndices, 'lastNumberIndices', lastNumberIndices);
    if (!firstDotIndices || firstDotIndices.firstIndex >= lastNumberIndices.firstIndex) {
      lastIndex = lastNumberIndices.firstIndex;
      continue;
    }

    for (let i = 0; i < requiredSize; i++) {
      currentExpandedDiskMap[firstDotIndices.firstIndex + i] = currentExpandedDiskMap[lastNumberIndices.firstIndex + i];
      currentExpandedDiskMap[lastNumberIndices.firstIndex + i] = '.';
    }
    // console.log('result', currentExpandedDiskMap);
    lastIndex = lastNumberIndices.firstIndex;
  }

  return currentExpandedDiskMap;
};

const calculateChecksum = (filledDiskMap: Readonly<string[]>) => {
  return filledDiskMap.reduce((prev, curr, index) => {
    if (curr === '.') {
      return prev;
    }
    return prev + (Number(curr) * index);
  }, 0);
};

const day: Day = {
  part1: async (dayNumber, example) => {
    const diskMap = await getInput(dayNumber, example);
    console.log('diskMap', diskMap.substring(0, 100), '...');

    const expandedDiskMap = expandDiskMap(diskMap);
    console.log('expandedDiskMap', expandedDiskMap, '...');

    const filledDiskMap = fillDiskMapGaps(expandedDiskMap);
    console.log('filledDiskMap', filledDiskMap, '...');

    return calculateChecksum(filledDiskMap);
  },
  part2: async (dayNumber, example) => {
    const diskMap = await getInput(dayNumber, example);
    console.log('diskMap', diskMap.substring(0, 100), '...');

    const expandedDiskMap = expandDiskMap(diskMap);
    console.log('expandedDiskMap', expandedDiskMap, '...');

    const filledDiskMap = fillDiskMapGapsWithWholeFiles(expandedDiskMap);
    console.log('filledDiskMap', filledDiskMap, '...');

    return calculateChecksum(filledDiskMap);
  },
};

export default day;
