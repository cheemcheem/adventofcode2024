export type Grid<T> = T[][];
export type Position = { rowIndex: number; colIndex: number };

export const getValue = <T>(grid: Readonly<Grid<T>>, position: Position) => {
  return grid[position.rowIndex][position.colIndex];
};

export const positionEquals = (p1: Position, p2: Position) => p1.rowIndex === p2.rowIndex && p1.colIndex === p2.colIndex;

export const uniquePositions = (positions: Position[]) => {
  return positions.filter((position, index) => !positions.find((searchPosition, searchIndex) => {
    return searchIndex > index && positionEquals(position, searchPosition);
  }));
};

const isValidRowIndex = <T>(rowIndex: number, grid: Readonly<Grid<T>>) => {
  return rowIndex >= 0 && rowIndex < grid.length;
};

const isValidColIndex = <T>(colIndex: number, grid: Readonly<Grid<T>>) => {
  return colIndex >= 0 && colIndex < grid[0].length;
};

export const isWithinGridBounds = <T>(grid: Readonly<Grid<T>>, { rowIndex, colIndex }: Position) => {
  return isValidRowIndex(rowIndex, grid) && isValidColIndex(colIndex, grid);
};

type SearchNearbyParams<T> = {
  grid: Readonly<Grid<T>>;
  diagonal?: boolean;
  position: Position;
  searchItems: Readonly<T[]>;
};

type ValueAtParams<T> = {
  colIncrement: -1 | 0 | 1;
  rowIncrement: -1 | 0 | 1;
  rowIndex: number;
  colIndex: number;
  searchItems: Readonly<T[]>;
  grid: Readonly<Grid<T>>;
};

const findNearbyMatch = <T>({ colIncrement, colIndex, rowIncrement, rowIndex, searchItems, grid }: ValueAtParams<T>) => {
  const newPosition = { rowIndex: rowIndex + rowIncrement, colIndex: colIndex + colIncrement };
  if (isWithinGridBounds(grid, newPosition) && searchItems.includes(getValue(grid, newPosition))) {
    return newPosition;
  }
  return undefined;
};

export const searchNearby = <T>({ grid, diagonal, position: { rowIndex, colIndex }, searchItems }: SearchNearbyParams<T>) => {
  const positions: (Position | undefined)[] = [];

  /* eslint-disable @stylistic/key-spacing */
  positions.push(findNearbyMatch({ rowIncrement:  0, rowIndex, colIncrement: -1, colIndex, searchItems, grid }));
  positions.push(findNearbyMatch({ rowIncrement:  0, rowIndex, colIncrement:  1, colIndex, searchItems, grid }));
  positions.push(findNearbyMatch({ rowIncrement: -1, rowIndex, colIncrement:  0, colIndex, searchItems, grid }));
  positions.push(findNearbyMatch({ rowIncrement:  1, rowIndex, colIncrement:  0, colIndex, searchItems, grid }));
  /* eslint-enable @stylistic/key-spacing */

  if (!diagonal) {
    return positions.filter(position => position !== undefined);
  }

  /* eslint-disable @stylistic/key-spacing */
  positions.push(findNearbyMatch({ rowIncrement:  1, rowIndex, colIncrement: -1, colIndex, searchItems, grid }));
  positions.push(findNearbyMatch({ rowIncrement: -1, rowIndex, colIncrement: -1, colIndex, searchItems, grid }));
  positions.push(findNearbyMatch({ rowIncrement:  1, rowIndex, colIncrement:  1, colIndex, searchItems, grid }));
  positions.push(findNearbyMatch({ rowIncrement: -1, rowIndex, colIncrement:  1, colIndex, searchItems, grid }));
  /* eslint-enable @stylistic/key-spacing */

  return positions.filter(position => position !== undefined);
};

export const logGrid = <T>(grid: Readonly<Grid<T>>) => {
  grid.map(row => row.join('')).forEach(row => process.stdout.write(row + '\n'));
  process.stdout.write('\n');
};

export const copyGrid = <T>(grid: Readonly<Grid<T>>) => {
  return [...grid].map(gridRow => [...gridRow]);
};

export const searchGrid = <T>(grid: Readonly<Grid<T>>, ...searchItems: Readonly<T[]>) => {
  const positions: Position[] = [];
  for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
    const row = grid[rowIndex];
    for (let colIndex = 0; colIndex < row.length; colIndex++) {
      const value = row[colIndex];
      if (searchItems.includes(value)) {
        positions.push({ rowIndex, colIndex });
      }
    }
  }
  return positions;
};

export const ALL_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

export const inputAsGrid = <T = string>(input: string[], allowedValues?: Readonly<T[]>): Grid<T> => {
  const mapped = input.map(row => row.split(''));

  if (allowedValues && mapped.flatMap(row => row).find(value => !allowedValues.includes(value as T))) {
    throw new Error('Input contains illegal characters.', { cause: new Set(mapped.flatMap(row => row).filter(value => !allowedValues.includes(value as T))) });
  }

  return mapped as Grid<T>;
};
