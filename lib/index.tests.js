import expect, { spyOn, restoreSpies } from 'expect';
// To test backward compatibility
import * as Logstar from './';

describe('index', () => {
  afterEach(() => {
    restoreSpies();
  });

  it('transaction logger', () => {
    const trans = Logstar.transactionLogger('ASDF-1234');
    spyOn(trans.winston, 'log').andReturn(true);

    trans.info('foo');
    expect(trans.winston.log).toHaveBeenCalledWith('info', 'foo', {
      transaction_id: 'ASDF-1234',
    });
  });

  it('exported logging methods', () => {
    spyOn(Logstar.default.winston.transports.console, 'log').andReturn(true);
    Logstar.info('testing');
    expect(Logstar.default.winston.transports.console.log).toHaveBeenCalled();
  });
});
