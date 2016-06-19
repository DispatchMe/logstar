import expect, { spyOn, restoreSpies } from 'expect';
import Logger from './Logger';
describe('Logger', () => {
  afterEach(() => {
    restoreSpies();
  });

  describe('server', () => {
    it('should instantiate with loggly', () => {
      const logger = new Logger({
        loggly: {
          subdomain: 'foo',
          token: 'bar',
          tags: 'baz,bing',
        },
      });

      expect(Object.keys(logger.winston.transports)).toEqual(['console', 'loggly']);
    });

    it('should not instantiate with loggly if missing config', () => {
      const logger = new Logger();
      expect(Object.keys(logger.winston.transports)).toEqual(['console']);
    });

    it('should make call to winston with correct args', () => {
      const logger = new Logger({
        meta: {
          boop: 'scoop',
        },
        loggly: {
          subdomain: 'foo',
          token: 'bar',
          tags: 'baz,bing',
        },
      });
      spyOn(logger.winston.transports.console, 'log').andReturn(true);
      spyOn(logger.winston.transports.loggly, 'log').andReturn(true);
      logger.log('info', 'foo');
      expect(logger.winston.transports.console.log).toHaveBeenCalled();
      const args = logger.winston.transports.console.log.calls[0].arguments;
      expect(args[0]).toEqual('info');
      expect(args[1]).toEqual('foo');
      expect(args[2]).toEqual({
        boop: 'scoop',
      });

      expect(logger.winston.transports.loggly.log).toHaveBeenCalled();
    });
  });

  describe('client', () => {
    it('should make call to console with correct args', () => {
      const logger = new Logger({
        meta: {
          boop: 'scoop',
        },
      });
      logger.isServer = false;

      spyOn(console, 'info').andReturn(true);
      logger.info('foo');
      expect(console.info).toHaveBeenCalledWith('info: foo', {
        boop: 'scoop',
      });
    });
  });

  describe('formatting/levels', () => {
    let logger;
    beforeEach(() => {
      logger = new Logger();
      spyOn(logger, 'log').andReturn(true);
    });

    const params = [
      ['infof', ['foo %s %d', 'bar', 10], ['info', 'foo bar 10']],
      ['info', ['foo', 'boop', 'scoop'], ['info', ['foo', 'boop', 'scoop']]],
      ['debugf', ['foo %s %d', 'bar', 10], ['debug', 'foo bar 10']],
      ['debug', ['foo', 'boop', 'scoop'], ['debug', ['foo', 'boop', 'scoop']]],
      ['warnf', ['foo %s %d', 'bar', 10], ['warn', 'foo bar 10']],
      ['warn', ['foo', 'boop', 'scoop'], ['warn', ['foo', 'boop', 'scoop']]],
      ['errorf', ['foo %s %d', 'bar', 10], ['error', 'foo bar 10']],
      ['error', ['foo', 'boop', 'scoop'], ['error', ['foo', 'boop', 'scoop']]],
    ];

    params.forEach((param, idx) => {
      it(`should work with param ${idx}`, () => {
        const func = param[0];
        const args = param[1];
        const expectation = param[2];
        logger[func](...args);
        expect(logger.log).toHaveBeenCalledWith(...expectation);
      });
    });
  });
});
