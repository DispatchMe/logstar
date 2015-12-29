import { info, tags } from '../logger';

describe('logger', () => {
  const write = process.stdout.write;

  let output = '';
  before(() => {
    process.stdout.write = (...args) => {
      output += args[0].toString();
      write.apply(process.stdout, args);
    };
  });

  afterEach(() => {
    output = '';
  });

  after(() => {
    process.stdout.write = write;
  });

  it('outputs to the console', () => {
    info('Gut check', { it: 'works' });
    expect(output).toEqual("info: Gut check { it: \u001b[32m'works'\u001b[39m }\n");
  });

  it('supports tags', () => {
    tags('tagA', 'tagB');
    info('Test 123');
    expect(output).toEqual('info: Test 123\n');
    output = '';
    tags();
    info('Test 123');
    expect(output).toEqual('info: Test 123\n');
  });
});
