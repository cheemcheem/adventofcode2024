import { Day } from '@cheemcheem/adventofcode-common';

type GridValue = '.' | '#' | '^' | 'v' | '<' | '>';

const findGuard = (grid: Readonly<GridValue[][]>) => {
  return [0, 0];
};

const traverse = (grid: Readonly<GridValue[][]>) => {
  const [row, column] = findGuard(grid);
  const direction = grid[row][column];

  const newGrid = [...grid].map(gridRow => [...gridRow]);

  switch (direction) {
    case '<': {
      if (grid[row][column - 1] === '.') {
        newGrid[row][column - 1] = direction;
      } else {
        newGrid[row][column] = '^';
      }
    }
  }
};

const day: Day = {
  part1: async (dayNumber, example) => {
    return 0;
  },
  part2: async (dayNumber, example) => {
    return 0;
  },
};

export default day;
