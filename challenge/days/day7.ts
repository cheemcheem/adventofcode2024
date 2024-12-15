import { Day, getInputSplitByLine } from '@cheemcheem/adventofcode-common';

const operators = ['*', '+'];
const operatorRegex = new RegExp(operators.reduce((prev, curr, index) => prev + `${index === 0 ? '' : '|'}(\\${curr})`, ''), 'g');

// console.log('operatorRegex', operatorRegex);
const calculateAnswer = (restOfEquation: string) => {
  // console.log('restOfEquation', restOfEquation);
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
      default: return curr;
    }
  });
};

const getValue = (equation: string) => {
  // for each space, convert to + - / *,
  // if equation works, return value

  // console.log('equation', equation);
  const [expectedTotalString, restOfEquationOriginal] = equation.split(': ');
  const expectedTotal = Number(expectedTotalString);
  // left to right not precedence
  let restOfEquation = restOfEquationOriginal;
  const spaceIndices = restOfEquation.matchAll(/ /g).map(match => match.index).toArray();
  // console.log('spaceIndices', spaceIndices);
  const total = Math.pow(operators.length, spaceIndices.length);
  // console.log('total', total);
  // 2 operators, 3 spaces
  // operator index = i % operators.length
  // space index = i floordiv operators.length
  // i = 0, space index = 0; operator index = 0
  // i = 1, space index = 0; operator index = 1
  // i = 2, space index = 1; operator index = 0
  // i = 3, space index = 1; operator index = 1
  // i = 4, space index = 2; operator index = 0
  // i = 5, space index = 2; operator index = 1

  // i = 0, space index = 0, i%si = -; operator index = 0, flip = true
  // i = 0, space index = 1, i%si = 0; operator index = 0, flip = true
  // i = 0, space index = 2, i%si = 0; operator index = 0, flip = true

  // i = 1, space index = 0, i%si = -; operator index = 0, flip = false
  // i = 1, space index = 1, i%si = ; operator index = 0, flip = false
  // i = 1, space index = 2, i%si = ; operator index = 1, flip = true

  // i = 2, space index = 0, i%si = ; operator index = 0, flip = false
  // i = 2, space index = 1, i%si = ; operator index = 1, flip = true
  // i = 2, space index = 2, i%si = ; operator index = 0, flip = true

  // i = 3, space index = 0, i%si = ; operator index = 0, flip = false
  // i = 3, space index = 1, i%si = ; operator index = 1, flip = false
  // i = 3, space index = 2, i%si = ; operator index = 1, flip = true

  // i = 4, space index = 0, i%si = ; operator index = 1, flip = true
  // i = 4, space index = 1, i%si = ; operator index = 0, flip = true
  // i = 4, space index = 2, i%si = ; operator index = 0, flip = true

  // i = 5, space index = 0, i%si = ; operator index = 1, flip = false
  // i = 5, space index = 1, i%si = ; operator index = 0, flip = true
  // i = 5, space index = 2, i%si = ; operator index = 1, flip = false

  // i = 6, space index = 0, i%si = ; operator index = 1, flip = false
  // i = 6, space index = 1, i%si = ; operator index = 1, flip = true
  // i = 6, space index = 2, i%si = ; operator index = 0, flip = true

  // i = 7, space index = 0, i%si = ; operator index = 1, flip = false
  // i = 7, space index = 1, i%si = ; operator index = 1, flip = false
  // i = 7, space index = 2, i%si = ; operator index = 1, flip = true

  const setIndex = (spaceIndex: number, operator: string) => {
    restOfEquation = restOfEquation.slice(0, spaceIndex) + operator + restOfEquation.slice(spaceIndex + 1);
  };

  const rotateIndex = (spaceIndexToChange: number) => {
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
  };

  // first run
  restOfEquation = restOfEquation.replaceAll(' ', operators[0]);
  for (let i = 0; i < total; i++) {
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

    const spaceIndexToChange = spaceIndices[i % spaceIndices.length];
    // console.log({ i, spaceIndexToChange, restOfEquation });

    // const spaceIndex = spaceIndices[Math.floor(i / operators.length)];
    // const operator = operators[i % operators.length];
    // // console.log('restOfEquation.slice(0, spaceIndex)', restOfEquation.slice(0, spaceIndex));
    // console.log('i', i);
    // console.log('operator', operator);
    // console.log('spaceIndex', spaceIndex);
    // // console.log('restOfEquation.slice(spaceIndex + 1)', restOfEquation.slice(spaceIndex + 1));
    // restOfEquation = restOfEquation.slice(0, spaceIndex) + operator + restOfEquation.slice(spaceIndex + 1);
    // console.log('restOfEquation', restOfEquation);
    // if (restOfEquation.includes(' ')) {
    //   continue;
    // }
    const answer = calculateAnswer(restOfEquation);
    // console.log(restOfEquation, ' = ', answer);
    if (answer === expectedTotal) {
      console.log('match:', equation);
      return expectedTotal;
    }
  }
  // for (const plusIndex of spaceIndices) {
  //   console.log('before +', restOfEquation);
  //   restOfEquation = restOfEquation.slice(0, plusIndex) + '+' + restOfEquation.slice(plusIndex + 1);
  //   for (const multiplyIndex of spaceIndices) {
  //     if (plusIndex === multiplyIndex) {
  //       continue;
  //     }
  //     console.log('before *', restOfEquation);
  //     restOfEquation = restOfEquation.slice(0, multiplyIndex) + '*' + restOfEquation.slice(multiplyIndex + 1);
  //     console.log('after +*', restOfEquation);
  //     if (restOfEquation.includes(' ')) {
  //       continue;
  //     }
  //     const answer = calculateAnswer(restOfEquation);
  //     console.log(restOfEquation, ' = ', answer);
  //     if (answer === expectedTotal) {
  //       console.log('match:', equation);
  //       return expectedTotal;
  //     }
  //   }
  // }

  return 0;
};

const day: Day = {
  part1: async (dayNumber, example) => {
    const equations = await getInputSplitByLine(dayNumber, example);
    const mapped = equations.map(getValue);

    return mapped.reduce((a, b) => a + b);
  },
  part2: async (dayNumber, example) => {
    return 0;
  },
};

export default day;
