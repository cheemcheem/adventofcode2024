import { InputHandler } from './types';

export interface Day {
  part1: InputHandler<Promise<string | number>>;
  part2: InputHandler<Promise<string | number>>;
}
