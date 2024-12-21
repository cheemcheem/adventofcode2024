import { createGrid, Day, getGridBounds, getInputSplitByLine, getValue, Grid, GridVector, inputAsGrid, isOnGridBounds, logGrid, MIN_POSITION, Position, positionEquals, searchNearby } from '@cheemcheem/adventofcode-common';

type GridValue = '.' | '#';

const crawlGridTracked = <T extends string>(
  grid: Grid<T>,
  pathBlocks: T[],
  targetPosition = getGridBounds(grid),
  position = { rowIndex: 0, colIndex: 0 },
  visited = [position],
  minCrawlMap = createGrid<Position[][]>(grid.length, [], grid[0].length),
): Position[][] => {
  // if (getValue(minCrawlMap, position).length !== 0) {
  //   console.log('returning early', position);
  //   return getValue(minCrawlMap, position);
  // }

  if (positionEquals(position, targetPosition)) {
    console.log('found end', position);
    // minCrawlMap[position.rowIndex][position.colIndex] = [visited];
    return [visited];
  }

  const nextPositions = searchNearby({ grid, position, searchItems: pathBlocks }).filter((nearbyPosition) => {
    return !visited.some(visitedPosition => positionEquals(nearbyPosition, visitedPosition));
  });
  const crawledNextPositions = nextPositions.map((nextPosition) => {
    return crawlGridTracked(grid, pathBlocks, targetPosition, nextPosition, [...visited, position], minCrawlMap);
  });
  const crawls = crawledNextPositions.filter(crawl => crawl.length > 0).flatMap(crawl => crawl);

  minCrawlMap[position.rowIndex][position.colIndex] = crawls;
  // console.log('returning crawls', position);
  return crawls;
};

const crawlGridNotWorking = <T extends string>(
  grid: Grid<T>,
  pathBlocks: T[],
  targetPosition = getGridBounds(grid),
  position = { rowIndex: 0, colIndex: 0 },
  visited = [position],
  minCrawlMap = createGrid<number | undefined>(grid.length, undefined, grid[0].length),
): number | undefined => {
  const existingValue = getValue(minCrawlMap, position);
  if (existingValue !== undefined) {
    console.log('returning early in', existingValue, 'from', position);
    return existingValue;
  }

  if (positionEquals(position, targetPosition)) {
    console.log('found end', position, visited.length);
    // minCrawlMap[position.rowIndex][position.colIndex] = [visited];
    return visited.length;
  }

  const nextPositions = searchNearby({ grid, position, searchItems: pathBlocks }).filter((nearbyPosition) => {
    return !visited.some(visitedPosition => positionEquals(nearbyPosition, visitedPosition));
  });
  const crawledNextPositions = nextPositions
    .map((nextPosition) => {
      return crawlGridNotWorking(grid, pathBlocks, targetPosition, nextPosition, [...visited, position], minCrawlMap);
    })
    .filter(crawlLength => crawlLength !== 0)
    .filter(crawlLength => crawlLength !== undefined)
  ;

  if (crawledNextPositions.length === 0) {
    console.log('no crawls from', position);
    return undefined;
  }

  const smallestCrawlFromHere = crawledNextPositions.reduce((prev, curr) => prev < curr ? prev : curr);
  minCrawlMap[position.rowIndex][position.colIndex] = smallestCrawlFromHere;
  console.log('smallest crawl from', position, 'is', smallestCrawlFromHere);
  return smallestCrawlFromHere;
};

const calculateStepsFromTarget = <T extends string>(
  grid: Readonly<Grid<T>>,
  pathBlocks: T[],
  targetPosition = getGridBounds(grid),
  position = targetPosition,
  stepCount = 0,
  stepsFromTarget = createGrid<number | undefined>(grid.length, undefined),
) => {
  const existingValue = getValue(stepsFromTarget, position);

  if (existingValue && existingValue < stepCount) {
    return stepsFromTarget;
  }

  const lowestValue = (existingValue !== undefined && existingValue < stepCount) ? existingValue : stepCount;
  stepsFromTarget[position.rowIndex][position.colIndex] = lowestValue;
  // console.log(position, existingValue, stepCount);

  if (positionEquals(position, MIN_POSITION)) {
    return stepsFromTarget;
  }

  const nextPositions = searchNearby({ grid, position, searchItems: pathBlocks })
    .filter((nearbyPosition) => {
      // unvisited positions
      // return stepsFromTarget[nearbyPosition.rowIndex][nearbyPosition.colIndex] === undefined;
      const nearbyPositionValue = getValue(stepsFromTarget, nearbyPosition);

      if (!nearbyPositionValue) {
        return true;
      }
      return nearbyPositionValue > lowestValue + 1;
    });

  nextPositions.forEach((nextPosition) => {
    calculateStepsFromTarget(grid, pathBlocks, targetPosition, nextPosition, stepCount + 1, stepsFromTarget);
  });

  return stepsFromTarget;
};

const attemptGrid = (grid: Readonly<Grid<GridValue>>, coordinates: Position[], coordinateIndex: number) => {
  coordinates
    .slice(0, coordinateIndex)
    .forEach(({ rowIndex, colIndex }) => grid[rowIndex][colIndex] = '#');
  // logGrid(grid);

  const stepGrid = calculateStepsFromTarget(grid, ['.']);
  // logGrid(stepGrid);
  return getValue(stepGrid, MIN_POSITION);
};

const day: Day = {
  part1: async (dayNumber, example) => {
    const gridSize = example === 1 ? 7 : 71;
    const firstCoordsToUse = example === 1 ? 12 : 1024;

    const coordinatesString = await getInputSplitByLine(dayNumber, example);
    const coordinates = coordinatesString.map(coord => coord.split(',').map(Number)).map(([colIndex, rowIndex]) => ({ rowIndex, colIndex } satisfies Position));
    const grid = createGrid<GridValue>(gridSize, '.');
    coordinates
      .slice(0, firstCoordsToUse)
      .forEach(({ rowIndex, colIndex }) => grid[rowIndex][colIndex] = '#');
    logGrid(grid);

    const stepGrid = calculateStepsFromTarget(grid, ['.']);
    logGrid(stepGrid);
    return getValue(stepGrid, MIN_POSITION) ?? 0;
  },
  part2: async (dayNumber, example) => {
    const gridSize = example === 1 ? 7 : 71;
    const firstCoordsToUse = example === 1 ? 12 : 1024;

    const coordinatesString = await getInputSplitByLine(dayNumber, example);
    const coordinates = coordinatesString.map(coord => coord.split(',').map(Number)).map(([colIndex, rowIndex]) => ({ rowIndex, colIndex } satisfies Position));

    for (let i = firstCoordsToUse + 1; i < coordinates.length; i++) {
      const grid = createGrid<GridValue>(gridSize, '.');
      console.log(coordinates[i - 1]);
      if (attemptGrid(grid, coordinates, i) === undefined) {
        break;
      }
    }
    return 0;
  },
};

export default day;
