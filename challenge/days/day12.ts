import { addPositionToVector, countEdgesTouching, Day, getInputSplitByLine, getValue, Grid, GridVector, inputAsGrid, isOnGridBounds, isPositionUnique, isWithinGridBounds, matchesPosition, multiplyVector, Position, positionEquals, rotateUnitVector, searchNearby, sumNumbers, UNIT_VECTORS, UnitVector, vectorEquals, vectorToDisplacement } from '@cheemcheem/adventofcode-common';
import { Direction } from 'readline';

const discoverRegion = (grid: Grid<string>, position: Position, targetValue = getValue(grid, position), region: Position[] = []) => {
  if (region.some(matchesPosition(position))) {
    return region;
  }

  if (getValue(grid, position) !== targetValue) {
    return region;
  }

  region.push(position);

  const nearbyMatches = searchNearby({ grid, position, searchItems: [targetValue] });

  nearbyMatches.map(nearbyPosition => discoverRegion(grid, nearbyPosition, targetValue, region));

  return region;
};

const calculateRegions = (grid: Grid<string>): Position[][] => {
  const regions: Position[][] = [];

  // iterate through each position, and then if it is not visited, recurse through nearby positions
  for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
    const row = grid[rowIndex];
    for (let colIndex = 0; colIndex < row.length; colIndex++) {
      const position = { rowIndex, colIndex };
      if (regions.some(region => region.some(matchesPosition(position)))) {
        continue;
      }
      const region = discoverRegion(grid, position);
      regions.push(region);
      // console.log('discovered', position, getValue(grid, position), region);
    }
  }

  return regions;
};

const calculateArea = (positions: Position[]): number => {
  return positions.length;
};

const calculatePerimiter = (grid: Grid<string>, positions: Position[]): number => {
  let perimeter = 0;

  for (const position of positions) {
    const nearbyMatches = searchNearby({ grid, position, searchItems: [getValue(grid, position)] });
    // Every match is one side that is not bordering the edge or another region
    perimeter += 4 - nearbyMatches.length;
  }

  console.log('region', getValue(grid, positions[0]), 'perimeter', perimeter);
  return perimeter;
};

type Line = { direction: GridVector; positions: Position[] };
const attemptLine = (
  position: Position,
  direction: UnitVector,
  edges: Line[], positions:
  Position[], currentLine:
  Line = { direction, positions: [] },
) => {
  const existingLine = edges.find((line) => {
    const directionMatches = vectorEquals((line.direction), (direction));
    const positionMatches = line.positions.some(linePosition => positionEquals(linePosition, position));
    return directionMatches && positionMatches;
  });

  if (existingLine) {
    // console.log('existingLine     ', position);
    existingLine.positions.push(...currentLine.positions.filter(position => !existingLine.positions.find(linePosition => positionEquals(linePosition, position))));
    return;
  }

  const notAnEdgePosition = !positions.some(edgePosition => positionEquals(edgePosition, position));
  if (notAnEdgePosition) {
    // console.log('notAnEdgePosition', position);
    if (currentLine.positions.length > 1) {
      edges.push(currentLine);
    }
    return;
  }

  // console.log('continue         ', position);
  currentLine.positions.push(position);
  return attemptLine(addPositionToVector(position, direction), direction, edges, positions, currentLine);
};

const calculateSides = (grid: Grid<string>, positions: Position[]): number => {
  const positionsWithNearby = positions
    .map(position => ({ position, nearby: searchNearby({ grid, position, searchItems: [getValue(grid, position)] }) }));

  const edgePositions = positionsWithNearby.filter(({ nearby }) => nearby.length > 0 && nearby.length < 4).map(({ position }) => position);
  const edges: Line[] = [];

  for (const position of edgePositions) {
    for (const direction of UNIT_VECTORS) {
      attemptLine(position, direction, edges, edgePositions);
    }
  }

  // 4 neighbours = 0 edges
  // 3 neighbours = 1 edges
  // 2 neighbours = 2 edges
  // 1 neighbours = 3 edges
  // 0 neighbours = 4 edges

  // For lone tiles
  for (const { position } of positionsWithNearby.filter(({ nearby }) => nearby.length === 0)) {
    for (const direction of UNIT_VECTORS) {
      edges.push({ direction, positions: [position] });
    }
  }

  console.log(getValue(grid, positions[0]), edges.length);
  edges.forEach((edge) => {
    console.log(edge.direction, edge.positions);
  });

  return edges.length;
};

const day: Day = {
  /**
   * A = 4 * 10 = 40
   * B = 4 *  8 = 32
   * C = 4 * 10 = 40
   * D = 1 *  4 = 4
   * E = 3 *  8 = 24
   * = 140
   */
  part1: async (dayNumber, example) => {
    const grid = inputAsGrid(await getInputSplitByLine(dayNumber, example));

    const regions = calculateRegions(grid);

    const regionPricing = regions.map(region => calculateArea(region) * calculatePerimiter(grid, region));

    return sumNumbers(regionPricing);
  },

  /**
   * A = 4 *  4 = 16
   * B = 4 *  4 = 16
   * C = 4 *  8 = 32
   * D = 1 *  4 = 4
   * E = 3 *  4 = 12
   * = 80
   */
  part2: async (dayNumber, example) => {
    const grid = inputAsGrid(await getInputSplitByLine(dayNumber, example));

    const regions = calculateRegions(grid);

    const regionPricing = regions.map(region => calculateArea(region) * calculateSides(grid, region));

    return sumNumbers(regionPricing);
  },
};

export default day;
