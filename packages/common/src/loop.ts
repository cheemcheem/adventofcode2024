type RunMultipleTimesParams<T> = {
  count: number;
  initial: Readonly<T>;
  callback: (params: T) => T;
};
export const runMultipleTimes = <T>({ initial, count, callback }: RunMultipleTimesParams<T>) => {
  let current = initial;
  for (let i = 0; i < count; i++) {
    console.log('run ', i, 'out of', count,
      // , 'current value', current
    );
    current = callback(current);
  }
  return current;
};
