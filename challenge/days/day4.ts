import { Day, getInputSplitByLine } from '@cheemcheem/adventofcode-common';

const isValidRowIndex = (rowIndex: number, rows: string[]) => {
  return rowIndex >= 0 && rowIndex < rows.length;
};

const isValidColIndex = (colIndex: number, rows: string[]) => {
  return colIndex >= 0 && colIndex < rows[0].length;
};

type AttemptXMASOptions = { colIncrement: -1 | 0 | 1; rowIncrement: -1 | 0 | 1; rowIndex: number; colIndex: number; rows: string[] };
const attempXMAS = ({ colIncrement, colIndex, rowIncrement, rowIndex, rows }: AttemptXMASOptions) => {
  const mRowIndex = rowIndex + (rowIncrement);
  const mColIndex = colIndex + (colIncrement);
  if (!isValidRowIndex(mRowIndex, rows) || !isValidColIndex(mColIndex, rows) || rows[mRowIndex][mColIndex] !== 'M') {
    return 0;
  }

  const aRowIndex = rowIndex + (rowIncrement * 2);
  const aColIndex = colIndex + (colIncrement * 2);
  if (!isValidRowIndex(aRowIndex, rows) || !isValidColIndex(aColIndex, rows) || rows[aRowIndex][aColIndex] !== 'A') {
    return 0;
  }

  const sRowIndex = rowIndex + (rowIncrement * 3);
  const sColIndex = colIndex + (colIncrement * 3);
  if (!isValidRowIndex(sRowIndex, rows) || !isValidColIndex(sColIndex, rows) || rows[sRowIndex][sColIndex] !== 'S') {
    return 0;
  }
  return 1;
};

type AttemptMASOptions = AttemptXMASOptions;
const attempMAS = ({ colIncrement, colIndex, rowIncrement, rowIndex, rows }: AttemptMASOptions) => {
  const mRowIndex = rowIndex;
  const mColIndex = colIndex;
  if (!isValidRowIndex(mRowIndex, rows) || !isValidColIndex(mColIndex, rows) || rows[mRowIndex][mColIndex] !== 'M') {
    return 0;
  }

  const aRowIndex = rowIndex + (rowIncrement);
  const aColIndex = colIndex + (colIncrement);
  if (!isValidRowIndex(aRowIndex, rows) || !isValidColIndex(aColIndex, rows) || rows[aRowIndex][aColIndex] !== 'A') {
    return 0;
  }

  const sRowIndex = rowIndex + (rowIncrement * 2);
  const sColIndex = colIndex + (colIncrement * 2);
  if (!isValidRowIndex(sRowIndex, rows) || !isValidColIndex(sColIndex, rows) || rows[sRowIndex][sColIndex] !== 'S') {
    return 0;
  }
  return 1;
};

const day: Day = {
  part1: async (dayNumber, example) => {
    const rows = await getInputSplitByLine(dayNumber, example);

    let count = 0;

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      for (let colIndex = 0; colIndex < rows.length; colIndex++) {
        const letter = rows[rowIndex][colIndex];
        if (letter !== 'X') {
          continue;
        }

        count += attempXMAS({ rowIncrement: 0, rowIndex, colIncrement: -1, colIndex, rows });
        count += attempXMAS({ rowIncrement: 0, rowIndex, colIncrement: 1, colIndex, rows });

        count += attempXMAS({ rowIncrement: -1, rowIndex, colIncrement: 0, colIndex, rows });
        count += attempXMAS({ rowIncrement: 1, rowIndex, colIncrement: 0, colIndex, rows });

        count += attempXMAS({ rowIncrement: 1, rowIndex, colIncrement: -1, colIndex, rows });
        count += attempXMAS({ rowIncrement: -1, rowIndex, colIncrement: -1, colIndex, rows });

        count += attempXMAS({ rowIncrement: 1, rowIndex, colIncrement: 1, colIndex, rows });
        count += attempXMAS({ rowIncrement: -1, rowIndex, colIncrement: 1, colIndex, rows });
      }
    }
    return count;
  },
  part2: async (dayNumber, example) => {
    const rows = await getInputSplitByLine(dayNumber, example);

    let count = 0;

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      for (let colIndex = 0; colIndex < rows.length; colIndex++) {
        const letter = rows[rowIndex][colIndex];
        if (letter !== 'A') {
          continue;
        }

        let masCount = 0;
        masCount += attempMAS({ rowIncrement: 1, rowIndex: rowIndex - 1, colIncrement: 1, colIndex: colIndex - 1, rows });
        masCount += attempMAS({ rowIncrement: 1, rowIndex: rowIndex - 1, colIncrement: -1, colIndex: colIndex + 1, rows });
        masCount += attempMAS({ rowIncrement: -1, rowIndex: rowIndex + 1, colIncrement: -1, colIndex: colIndex + 1, rows });
        masCount += attempMAS({ rowIncrement: -1, rowIndex: rowIndex + 1, colIncrement: 1, colIndex: colIndex - 1, rows });
        if (masCount === 2) {
          count++;
        }
      }
    }
    return count;
  },
};

export default day;
