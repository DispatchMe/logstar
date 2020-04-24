import expect, { spyOn, restoreSpies } from 'expect';
// To test backward compatibility
import * as Logstar from '.';

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

  describe('exported logging methods', () => {
    beforeEach(() => {
      Logstar.default.initForServer();
      spyOn(Logstar.default.consoleTransport, 'log').andReturn(true);
    });

    it('should not call debug since default is info', () => {
      Logstar.debug('testing');
      expect(Logstar.default.consoleTransport.log).toNotHaveBeenCalled();
    });

    ['info', 'warn', 'error'].forEach((method) => {
      it(`should work with method ${method}`, () => {
        Logstar[method]('testing');
        expect(Logstar.default.consoleTransport.log).toHaveBeenCalled();
        restoreSpies();
      });
    });
  });
});
