# adventofcode

https://adventofcode.com

#### set up

```shell script
$ pnpm install
```

Now you can write code in `./challenge/days` and add inputs to `./challenge/inputs`.

#### run all days

```shell script
$ pnpm start
```

#### run the example for a specific part of a specific day

```shell script
$ pnpm start -d 1 -p 2 -e
```

#### commit and push changes for a specific day

```shell script
$ pnpm commit -d 2
```

#### help output

```shell script
$ pnpm start --help

pnpm start
pnpm start -e
pnpm start -d [day]
pnpm start -d [day] -e
pnpm start -d [day] -p [part]
pnpm start -d [day] -p [part] -e
pnpm start -d [day] -p [part] -e [ex]

Options:
  -d, --day      Run a day in the advent of code.
   [number] [choices: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                                                 18, 19, 20, 21, 22, 23, 24, 25]
  -p, --part     Run part 1 or part 2 of a day.         [number] [choices: 1, 2]
  -e, --example  Run example input (usually 1 or 2) rather than real input for t
                 he given part/day.                                     [number]
      --help     Show help                                             [boolean]
```
