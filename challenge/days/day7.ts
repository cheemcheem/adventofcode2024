import { Day, getInputSplitByLine } from '@cheemcheem/adventofcode-common';

const calculateAnswer = (restOfEquation: string, operatorRegex: RegExp) => {
  // console.log('calculating answer for', restOfEquation);
  const equationNumbers = restOfEquation.split(operatorRegex).map(Number).filter(Number.isInteger);
  // console.log('equationNumbers', equationNumbers);
  const equationOperators = restOfEquation.matchAll(operatorRegex).map(([operator]) => operator).toArray();
  // console.log('equationOperators', equationOperators);
  return equationNumbers.reduce((prev, curr, index) => {
    const operator = equationOperators[index - 1];
    // console.log('reduce', prev, operator, curr);
    switch (operator) {
      case '+': return curr + prev;
      case '*': return curr * prev;
      case '|': return Number(`${prev}${curr}`);
      default: return curr;
    }
  });
};

const getValue = (equation: string, operators: string[]) => {
  const operatorRegex = new RegExp(operators.reduce((prev, curr, index) => prev + `${index === 0 ? '' : '|'}(\\${curr})`, ''), 'g');

  const [expectedTotalString, restOfEquationOriginal] = equation.split(': ');
  const expectedTotal = Number(expectedTotalString);

  let restOfEquation = restOfEquationOriginal;
  const spaceIndices = restOfEquation.matchAll(/ /g).map(match => match.index).toArray();
  const total = Math.pow(operators.length, spaceIndices.length);

  const setIndex = (spaceIndex: number, operator: string) => {
    restOfEquation = restOfEquation.slice(0, spaceIndex) + operator + restOfEquation.slice(spaceIndex + 1);
  };

  const rotateIndex = (spaceIndexToChange: number) => {
    if (operators.length === 2) {
      switch (restOfEquation[spaceIndexToChange]) {
        case operators[0]: {
          setIndex(spaceIndexToChange, operators[1]);
          break;
        }
        case operators[1]: {
          setIndex(spaceIndexToChange, operators[0]);
          break;
        }
      }
    } else {
      switch (restOfEquation[spaceIndexToChange]) {
        case operators[0]: {
          setIndex(spaceIndexToChange, operators[1]);
          break;
        }
        case operators[1]: {
          setIndex(spaceIndexToChange, operators[2]);
          break;
        }
        case operators[2]: {
          setIndex(spaceIndexToChange, operators[0]);
          break;
        }
      }
    }
  };

  const chooseNextSolution = () => {
    // Treat operators like binary input
    for (let spaceIndicesIndex = spaceIndices.length - 1; spaceIndicesIndex >= 0; spaceIndicesIndex--) {
      const spaceIndex = spaceIndices[spaceIndicesIndex];
      if (restOfEquation[spaceIndex] === operators[0]) {
        rotateIndex(spaceIndex);
        break;
      }

      rotateIndex(spaceIndex);
      if (restOfEquation[spaceIndex] !== operators[0]) {
        break;
      }
    }
  };

  restOfEquation = restOfEquation.replaceAll(' ', operators[0]);
  for (let i = 0; i < total; i++) {
    const answer = calculateAnswer(restOfEquation, operatorRegex);
    // console.log('answer for', restOfEquation, '=', answer);
    if (answer === expectedTotal) {
      console.log('match:', equation);
      return expectedTotal;
    }
    chooseNextSolution();
  }
  return 0;
};

const day: Day = {
  part1: async (dayNumber, example) => {
    const operators = ['*', '+'];

    const equations = await getInputSplitByLine(dayNumber, example);
    const mapped = equations.map(equation => getValue(equation, operators));

    return mapped.reduce((a, b) => a + b);
  },
  part2: async (dayNumber, example) => {
    // using | instead of || as logic is based on single character
    const operators = ['*', '+', '|'];

    const equations = await getInputSplitByLine(dayNumber, example);
    const mapped = equations.map(equation => getValue(equation, operators));

    return mapped.reduce((a, b) => a + b);
  },
};

export default day;
