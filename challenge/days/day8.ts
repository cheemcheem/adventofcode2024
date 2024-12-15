import { Day, getInputSplitByLine } from '@cheemcheem/adventofcode-common';

type GridPosition = { rowIndex: number; colIndex: number };

const filterNonUniquePositions = (valuePosition: GridPosition, index: number, array: GridPosition[]) => {
  for (let i = 0; i < array.length; i++) {
    if (i <= index) {
      continue;
    }

    const { rowIndex, colIndex } = array[i];
    if (rowIndex === valuePosition.rowIndex && colIndex === valuePosition.colIndex) {
      return false;
    }
  }
  return true;
};

const generateResonantAntinodePositions = (valuePositions: GridPosition[], maxGridPosition: GridPosition) => {
  const antinodePositions: GridPosition[] = [];

  for (const valuePosition of valuePositions) {
    for (const otherValuePosition of valuePositions) {
      if (valuePosition === otherValuePosition) {
        continue;
      }

      const diff = {
        rowIndex: valuePosition.rowIndex - otherValuePosition.rowIndex,
        colIndex: valuePosition.colIndex - otherValuePosition.colIndex,
      };

      let newPosition = valuePosition;

      // console.log('newPosition', newPosition);

      while (checkIsOutOfBounds(newPosition, maxGridPosition)) {
        antinodePositions.push(newPosition);
        newPosition = {
          rowIndex: newPosition.rowIndex + diff.rowIndex,
          colIndex: newPosition.colIndex + diff.colIndex,
        };
        // console.log('newPositionInner', newPosition);
      }

      newPosition = valuePosition;
      while (checkIsOutOfBounds(newPosition, maxGridPosition)) {
        antinodePositions.push(newPosition);
        newPosition = {
          rowIndex: newPosition.rowIndex - diff.rowIndex,
          colIndex: newPosition.colIndex - diff.colIndex,
        };
        // console.log('newPositionInner', newPosition);
      }
    }
  }

  return antinodePositions;
};

const checkIsOutOfBounds = ({ rowIndex, colIndex }: GridPosition, maxGridPosition: GridPosition) => {
  return rowIndex >= 0 && colIndex >= 0 && rowIndex <= maxGridPosition.rowIndex && colIndex <= maxGridPosition.colIndex;
};

const filterOutOfBoundsPositions = (valuePositions: GridPosition[], maxGridPosition: GridPosition) => {
  return valuePositions.filter(position => checkIsOutOfBounds(position, maxGridPosition));
};

const generateAntinodePositions = (valuePositions: GridPosition[]) => {
  const antinodePositions: GridPosition[] = [];

  for (const valuePosition of valuePositions) {
    for (const otherValuePosition of valuePositions) {
      if (valuePosition === otherValuePosition) {
        continue;
      }

      antinodePositions.push({
        rowIndex: valuePosition.rowIndex + (valuePosition.rowIndex - otherValuePosition.rowIndex),
        colIndex: valuePosition.colIndex + (valuePosition.colIndex - otherValuePosition.colIndex),
      });
    }
  }

  return antinodePositions;
};

const getPositions = (grid: string[][]) => {
  const positions: Map<string, GridPosition[]> = new Map();

  for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
    const row = grid[rowIndex];
    for (let colIndex = 0; colIndex < row.length; colIndex++) {
      const col = row[colIndex];
      if (col === '.') {
        continue;
      }

      const colPositions = positions.has(col) ? positions.get(col) ?? [] : [];

      colPositions.push({ rowIndex, colIndex });

      positions.set(col, colPositions);
    }
  }

  return positions;
};

const day: Day = {
  part1: async (dayNumber, example) => {
    const grid = (await getInputSplitByLine(dayNumber, example)).map(row => row.split(''));

    const positions = getPositions(grid);

    console.log(positions);

    const antinodePositions = new Map(positions.entries().map(([value, positions]) => [value, generateAntinodePositions(positions)]));

    console.log(antinodePositions);

    const validAntinodePositions = new Map(antinodePositions.entries().map(([value, positions]) => [value, filterOutOfBoundsPositions(positions, { rowIndex: grid.length - 1, colIndex: grid[0].length - 1 })]));

    console.log(validAntinodePositions);

    return validAntinodePositions.entries().flatMap(([_, positions]) => positions).toArray().filter(filterNonUniquePositions).length;
  },
  part2: async (dayNumber, example) => {
    const grid = (await getInputSplitByLine(dayNumber, example)).map(row => row.split(''));

    const positions = getPositions(grid);

    // console.log(positions);

    const maxGridPosition = { rowIndex: grid.length - 1, colIndex: grid[0].length - 1 };

    const antinodePositions = new Map(positions.entries().map(([value, positions]) => [value, generateResonantAntinodePositions(positions, maxGridPosition)]));

    console.log(antinodePositions);

    const validAntinodePositions = new Map(antinodePositions.entries().map(([value, positions]) => [value, filterOutOfBoundsPositions(positions, maxGridPosition)]));

    // console.log(validAntinodePositions);

    return validAntinodePositions.entries().flatMap(([_, positions]) => positions).toArray().filter(filterNonUniquePositions).length;
  },
};

export default day;
