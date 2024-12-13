import { Day, getInputSplitByLine } from '@cheemcheem/adventofcode-common';

type Direction = '^' | 'v' | '<' | '>';
type GridValue = '.' | '#' | 'X' | Direction;

const isDirection = (value: GridValue): value is Direction => {
  const directions = ['^', 'v', '<', '>'] satisfies Direction[];
  return directions.includes(value as Direction);
};

const findGuard = (grid: Readonly<GridValue[][]>) => {
  for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
    const row = grid[rowIndex];
    for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
      const direction = row[columnIndex];
      if (isDirection(direction)) {
        return { rowIndex, columnIndex, status: 'traversable', direction } as const;
      }
    }
  }
  return { status: 'finished' } as const;
};

const copyGrid = (grid: Readonly<GridValue[][]>) => [...grid].map(gridRow => [...gridRow]);

const traverse = (grid: Readonly<GridValue[][]>) => {
  const { rowIndex, columnIndex, status, direction } = findGuard(grid);
  const newGrid = copyGrid(grid);

  if (status === 'finished') {
    return {
      grid: newGrid,
      status: 'finished',
    } as const;
  }

  const traversable = ['.', 'X'];

  const { nextRowAdjustment, nextColumnAdjustment, nextDirection } = calculateNextMovementAttempt(direction);
  const nextRowIndex = rowIndex + nextRowAdjustment, nextColumnIndex = columnIndex + nextColumnAdjustment;

  if (nextRowIndex < 0 || nextColumnIndex < 0 || nextRowIndex >= newGrid.length || nextColumnIndex >= newGrid[nextRowIndex].length) {
    newGrid[rowIndex][columnIndex] = 'X';

    return {
      grid: newGrid,
      status: 'finished',
    } as const;
  }

  if (traversable.includes(newGrid[nextRowIndex][nextColumnIndex])) {
    newGrid[nextRowIndex][nextColumnIndex] = direction;
    newGrid[rowIndex][columnIndex] = 'X';
  } else {
    newGrid[rowIndex][columnIndex] = nextDirection;
  }
  return {
    grid: newGrid,
    status: 'traversable',
  } as const;
};

const calculateNextMovementAttempt = (direction: Direction) => {
  switch (direction) {
    case '<': {
      return {
        nextRowAdjustment: 0,
        nextColumnAdjustment: -1,
        nextDirection: '^' as const,
      };
    }
    case '>': {
      return {
        nextRowAdjustment: 0,
        nextColumnAdjustment: 1,
        nextDirection: 'v' as const,
      };
    }
    case '^': {
      return {
        nextRowAdjustment: -1,
        nextColumnAdjustment: 0,
        nextDirection: '>' as const,
      };
    }
    case 'v': {
      return {
        nextRowAdjustment: 1,
        nextColumnAdjustment: 0,
        nextDirection: '<' as const,
      };
    }
    default: {
      const notPossible = {} as never;
      return notPossible;
    }
  }
};

const countTraversed = (grid: Readonly<GridValue[][]>) => {
  return grid.flatMap(value => value).filter(value => value === 'X').length;
};

const logGrid = (grid: Readonly<GridValue[][]>) => {
  const { status, rowIndex, columnIndex } = findGuard(grid);
  console.log(countTraversed(grid), status, rowIndex, columnIndex, status === 'traversable' && grid[rowIndex][columnIndex]);
  grid.map(row => row.join('')).forEach(row => process.stdout.write(row + '\n'));
  process.stdout.write('\n');
};

type Position = { rowIndex: number; columnIndex: number; direction: Direction };
const positionEquals = (p1: Position, p2: Position) => p1.rowIndex === p2.rowIndex && p1.columnIndex === p2.columnIndex && p1.direction === p2.direction;

const gridContainsLoop = (grid: Readonly<GridValue[][]>) => {
  let lastGrid = traverse(grid);
  const positions: Position[] = [];
  const lastGuard = findGuard(lastGrid.grid);
  while (lastGrid.status === 'traversable') {
    const guard = findGuard(lastGrid.grid);

    if (guard.status === 'finished') {
      break;
    }

    if (positions.find(position => positionEquals(position, guard))) {
      return true;
    }

    positions.push(guard);

    lastGrid = traverse(lastGrid.grid);
  };
  return false;
};

// WIP on more efficient method with less finding the guard and no going over the same position
// const traverseForLoops = (grid: Readonly<GridValue[][]>, positions: Position[], guard: Position, loopCount = 0) => {
//   if (positionEquals(guard, positions[0])) {
//     if (gridContainsLoop(grid))
//   }
//   // else traverseForLoops(traverse(grid))
// }

const day: Day = {
  part1: async (dayNumber, example) => {
    const grid = (await getInputSplitByLine(dayNumber, example)).map(row => row.split('') as GridValue[]);
    logGrid(grid);
    let lastGrid = traverse(grid);
    while (lastGrid.status === 'traversable') {
      logGrid(lastGrid.grid);
      lastGrid = traverse(lastGrid.grid);
    };
    logGrid(lastGrid.grid);
    return countTraversed(lastGrid.grid);
  },
  part2: async (dayNumber, example) => {
    const grid: Readonly<GridValue[][]> = (await getInputSplitByLine(dayNumber, example)).map(row => row.split('') as GridValue[]);

    // Get list of positions and directions that the guard takes
    let lastGrid = traverse(grid);
    const positions: Position[] = [];
    while (lastGrid.status === 'traversable') {
      const guard = findGuard(lastGrid.grid);
      if (guard.status === 'traversable' && !positions.find(position => positionEquals(position, { ...guard, direction: position.direction }))) {
        positions.push(guard);
      }

      lastGrid = traverse(lastGrid.grid);
    };

    // Determine if any point on the positions path can be blocked to create a loop
    const loopingPositions = positions.filter(({ rowIndex, columnIndex }, index, array) => {
      const gridCopy = copyGrid(grid);
      gridCopy[rowIndex][columnIndex] = '#';
      const containsLoop = gridContainsLoop(gridCopy);
      console.log(`loopingPositions(total: ${array.length})`, index, containsLoop);
      return containsLoop;
    });

    return loopingPositions.length;
  },
};

export default day;
