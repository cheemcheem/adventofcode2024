export type Grid<T> = T[][];
export type Position = { rowIndex: number; colIndex: number };
export type GridVector<Limit = number> = { rowIncrement: Limit; colIncrement: Limit };

/* --------- POSITIONS --------- */

export const positionEquals = (p1: Position, p2: Position) => p1.rowIndex === p2.rowIndex && p1.colIndex === p2.colIndex;

export const isPositionUnique = (position: Position, index: number, positions: Position[]) => {
  return !positions.some((searchPosition, searchIndex) => {
    return searchIndex > index && positionEquals(position, searchPosition);
  });
};

export const matchesPosition = (position: Position) => (searchPosition: Position) => positionEquals(position, searchPosition);

export const isWithinGridBounds = <T>(grid: Readonly<Grid<T>>, { rowIndex, colIndex }: Position) => {
  return rowIndex >= 0 && rowIndex < grid.length && colIndex >= 0 && colIndex < grid[0].length;
};

export const getGridBounds = <T>(grid: Readonly<Grid<T>>): Position => {
  return { rowIndex: grid.length - 1, colIndex: grid[0].length - 1 };
};
export const isOnGridBounds = <T>(grid: Readonly<Grid<T>>, { rowIndex, colIndex }: Position) => {
  return rowIndex === 0 || rowIndex === grid.length - 1 || colIndex === 0 || colIndex === grid[0].length - 1;
};

export const countEdgesTouching = <T>(grid: Readonly<Grid<T>>, { rowIndex, colIndex }: Position) => {
  const isOnTopOrBottom = (rowIndex === 0 || rowIndex === grid.length - 1);
  const isOnLeftOrRight = (colIndex === 0 || colIndex === grid[0].length - 1);

  return (isOnTopOrBottom && isOnLeftOrRight)
    ? 2
    : (isOnTopOrBottom || isOnLeftOrRight)
        ? 1
        : 0;
};

/* ---------- VECTORS ---------- */

export const UNIT_VECTORS = ([[0, -1], [0, 1], [1, 0], [-1, 0]] as const).map(([rowIncrement, colIncrement]) => ({ rowIncrement, colIncrement }) satisfies GridVector);

export type UnitVector = typeof UNIT_VECTORS[number];

export const UNIT_VECTORS_DIAGONAL = ([[-1, -1], [1, 1], [1, -1], [-1, 1]] as const).map(([rowIncrement, colIncrement]) => ({ rowIncrement, colIncrement }) satisfies GridVector);

export const vectorEquals = (v1: GridVector, v2: GridVector) => v1.rowIncrement === v2.rowIncrement && v1.colIncrement === v2.colIncrement;

export const addPositionToVector = (position: Position, vector: GridVector) => {
  return { rowIndex: position.rowIndex + vector.rowIncrement, colIndex: position.colIndex + vector.colIncrement } satisfies Position;
};

export const calculateVector = (position1: Position, position2: Position) => {
  return ({ rowIncrement: position1.rowIndex - position2.rowIndex, colIncrement: position1.colIndex - position2.colIndex }) satisfies GridVector;
};

export const multiplyVector = (vector: GridVector, multiple: number) => {
  return { rowIncrement: vector.rowIncrement * multiple, colIncrement: vector.colIncrement * multiple } satisfies GridVector;
};

export const vectorToDisplacement = (vector: GridVector) => {
  // Convert to positive
  return multiplyVector(vector, vector.rowIncrement < 0 || vector.colIncrement < 0 ? -1 : 1);
};

export const rotateUnitVector = (vector: UnitVector): UnitVector => {
  switch (vector.colIncrement) {
    case 0: return vector.rowIncrement === 1 ? { rowIncrement: 0, colIncrement: 1 } : { rowIncrement: 0, colIncrement: -1 };
    case 1: return { rowIncrement: -1, colIncrement: 0 };
    case -1: return { rowIncrement: 1, colIncrement: 0 };
  }
};

/* ----------- GRIDS ----------- */

export const getValue = <T>(grid: Readonly<Grid<T>>, position: Position) => {
  return grid[position.rowIndex][position.colIndex];
};

type FindNearbyMatchParams<T> = {
  searchItems?: Readonly<T[]>;
  grid: Readonly<Grid<T>>;
} & Position & GridVector<-1 | 0 | 1>;
const findNearbyMatch = <T>({ colIncrement, colIndex, rowIncrement, rowIndex, searchItems, grid }: FindNearbyMatchParams<T>) => {
  const newPosition = addPositionToVector({ rowIndex, colIndex }, { rowIncrement, colIncrement });
  if (isWithinGridBounds(grid, newPosition) && (!searchItems || searchItems.includes(getValue(grid, newPosition)))) {
    return newPosition;
  }
  return undefined;
};

type SearchNearbyParams<T> = {
  grid: Readonly<Grid<T>>;
  diagonal?: boolean;
  position: Position;
  searchItems?: Readonly<T[]>;
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

export const logGrid = <T>(grid: Readonly<Grid<T>>, reverse = false) => {
  (reverse ? grid.toReversed() : grid)
    .map(row => (reverse ? row.toReversed() : row)
      .map(row => String(row ?? '').padStart(2))
      .join(' '))
    .forEach(row => process.stdout.write(row + '\n'));
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

export const MIN_POSITION = { rowIndex: 0, colIndex: 0 } as const satisfies Position;

export const ALL_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

export const inputAsGrid = <T = string>(input: string[], allowedValues?: Readonly<T[]>): Grid<T> => {
  const mapped = input.map(row => row.split(''));

  if (allowedValues && mapped.flatMap(row => row).find(value => !allowedValues.includes(value as T))) {
    throw new Error('Input contains illegal characters.', { cause: new Set(mapped.flatMap(row => row).filter(value => !allowedValues.includes(value as T))) });
  }

  return mapped as Grid<T>;
};

export const createGrid = <T>(rowCount: number, initialValue: T, colCount = rowCount) => {
  return Array.from({ length: rowCount }).map(() => Array.from({ length: colCount }).map(() => initialValue));
};
