import { Day, getInputSplitByLine } from '@cheemcheem/adventofcode-common';

const isSafeGap = (level1: number, level2: number) => {
  const diff = Math.abs(level1 - level2);
  return diff > 0 && diff < 4;
}

const isSafe = (report: number[]) => {
  const isIncreasing = report.every((level, index) => index === 0 || level < report[index - 1]);
  const isDecreasing = report.every((level, index) => index === 0 || level > report[index - 1]);
  const hasSafeGaps = report.every((level, index) => index === 0 || isSafeGap(level, report[index - 1]));
  return (isIncreasing || isDecreasing) && hasSafeGaps;
}

const isSafeWithDampener = (report: number[]) => {
  return report.find((_, index) => {
    const duplicate = [...report];
    duplicate.splice(index, 1);
    return isSafe(duplicate);
  })
}

const day: Day = {
  part1: async (dayNumber, example) => {
    const reportStrings = await getInputSplitByLine(dayNumber, example);
    const reports = reportStrings.map((report) => report.split(' ').map(Number));
    const safeReports = reports.filter(isSafe);
    return safeReports.length;
  },
  part2: async (dayNumber, example) => {
    const reportStrings = await getInputSplitByLine(dayNumber, example);
    const reports = reportStrings.map((report) => report.split(' ').map(Number));
    const safeReports = reports.filter(isSafeWithDampener);
    return safeReports.length;
  },
};

export default day;
