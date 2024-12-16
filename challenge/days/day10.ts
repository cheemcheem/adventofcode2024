import { ALL_DIGITS, Day, getInputSplitByLine, getValue, Grid, inputAsGrid, Position, searchGrid, searchNearby, sumArray, uniquePositions } from '@cheemcheem/adventofcode-common';

const ALLOWED_INPUTS = ['.', ...ALL_DIGITS] as const;
type GridValue = typeof ALLOWED_INPUTS[number];

const navigateTrail = (grid: Grid<GridValue>, position: Position): Position[] => {
  // return number of trails that end from current position
  const value = getValue(grid, position);

  if (value === '.') {
    return [];
  }

  if (value === '9') {
    // console.log('current', position, 'Found 9.');
    return [position];
  }

  const trailPaths = searchNearby({ grid, position, searchItems: [`${Number(value) + 1}`] });

  // console.log('current', position, 'next', trailPaths);

  return trailPaths.flatMap(nextPosition => navigateTrail(grid, nextPosition));
};

const day: Day = {
  part1: async (dayNumber, example) => {
    const grid = inputAsGrid(await getInputSplitByLine(dayNumber, example), ALLOWED_INPUTS);
    const trailheads = searchGrid(grid, '0');
    // console.log(trailheads);
    return sumArray(trailheads.flatMap(position => uniquePositions(navigateTrail(grid, position)).length));
  },
  part2: async (dayNumber, example) => {
    const grid = inputAsGrid(await getInputSplitByLine(dayNumber, example), ALLOWED_INPUTS);
    const trailheads = searchGrid(grid, '0');
    // console.log(trailheads);
    return sumArray(trailheads.flatMap(position => navigateTrail(grid, position).length));
  },
};

export default day;
