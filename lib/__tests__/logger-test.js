import { info } from '../logger';

describe('logger', () => {
  const write = process.stdout.write;

  let output = null;
  before(() => {
    process.stdout.write = (...args) => {
      output = args;
      write.apply(process.stdout, args);
    };
  });

  after(() => {
    process.stdout.write = write;
  });

  it('outputs to the console', () => {
    info('Gut check', { it: 'works' });
    expect(output).toEqual(["info: Gut check { it: \u001b[32m'works'\u001b[39m }\n"]);
  });
});
