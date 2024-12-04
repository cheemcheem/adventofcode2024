import { readFile } from 'fs/promises';
import { EOL } from 'os';
import path from 'path';
import { InputHandler } from './types';

const fileCache = new Map<string, string>();

const getCacheKey: InputHandler<string> = (dayNumber, example) => {
  return `${dayNumber}${example ? `-${example}` : ''}`;
};

const getInputFromCache: InputHandler<string | undefined> = (dayNumber, example) => {
  const cacheKey = getCacheKey(dayNumber, example);
  return fileCache.get(cacheKey);
};

const getInputFromFile: InputHandler<Promise<string>> = async (dayNumber, example) => {
  const cacheKey = getCacheKey(dayNumber, example);
  const fileBuffer = await readFile(
    path.join(
      __dirname,
      `../../../challenge/inputs/day-${new Intl.NumberFormat(undefined, {
        minimumIntegerDigits: 2,
      }).format(dayNumber)}${example ? `-example-${example}` : ''}.txt`,
    ),
  );
  const input = fileBuffer.toString();
  fileCache.set(cacheKey, input);
  return input;
};

export const getInput: InputHandler<Promise<string>> = async (dayNumber, example) => {
  const cached = getInputFromCache(dayNumber, example);
  if (cached) {
    return cached;
  }
  return await getInputFromFile(dayNumber, example);
};

export const getInputSplitByLine: InputHandler<Promise<string[]>> = async (dayNumber, example) => {
  const input = await getInput(dayNumber, example);
  return input.split(EOL);
};

export const getInputSplitByDoubleLine: InputHandler<Promise<string[]>> = async (dayNumber, example) => {
  const input = await getInput(dayNumber, example);
  return input.split(EOL + EOL);
};
