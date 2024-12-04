import yargs from 'yargs';

export const parseArgs = async (args: string[]) =>
  await yargs(args)
    .options({
      day: {
        type: 'number',
        nullable: false,
        describe: 'Commit for a day in the advent of code.',
        alias: 'd',
        choices: Array.from(Array(25)).map((_, day) => day + 1),
        demandOption: "Can't provide empty day option.",
      },
    })
    .version(false)
    .help()
    .usage('pnpm commit -d [day]')
    .showHelpOnFail(true, "This can't be run with these options.")
    .parse();
