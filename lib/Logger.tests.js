import expect, { spyOn, restoreSpies } from 'expect';
import util from 'util';
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

      expect(logger.winston.transports.map((t) => t.name)).toEqual(['console', 'loggly']);
    });

    it('should not instantiate with loggly if missing config', () => {
      const logger = new Logger();
      expect(logger.winston.transports.map((t) => t.name)).toEqual(['console']);
    });

    describe('meta data interpretation', () => {
      it('should make correct call when logging strings + global meta', () => {
        const logger = new Logger({
          globalMeta: {
            boop: 'scoop',
          },
          loggly: {
            subdomain: 'foo',
            token: 'bar',
            tags: 'baz,bing',
          },
        });
        const consoleTransport = logger.winston.transports.find((t) => t.name === 'console');
        const logglyTransport = logger.winston.transports.find((t) => t.name === 'loggly');
        spyOn(consoleTransport, 'log').andReturn(true);
        spyOn(logglyTransport, 'log').andReturn(true);
        logger.log('info', 'foo');
        expect(consoleTransport.log).toHaveBeenCalled();
        const args = consoleTransport.log.calls[0].arguments[0];
        expect(args.level).toEqual('info');
        expect(args.message).toEqual('foo');
        expect(args.boop).toEqual('scoop');

        expect(logglyTransport.log).toHaveBeenCalled();
      });

      it('should make correct call when logging msg + object + global meta', () => {
        const logger = new Logger({
          globalMeta: {
            boop: 'scoop',
          },
          loggly: {
            subdomain: 'foo',
            token: 'bar',
            tags: 'baz,bing',
          },
        });
        const consoleTransport = logger.winston.transports.find((t) => t.name === 'console');
        const logglyTransport = logger.winston.transports.find((t) => t.name === 'loggly');
        spyOn(consoleTransport, 'log').andReturn(true);
        spyOn(logglyTransport, 'log').andReturn(true);
        logger.log('info', 'foo', {
          bar: 'baz',
        });
        expect(consoleTransport.log).toHaveBeenCalled();
        const args = consoleTransport.log.calls[0].arguments[0];
        expect(args.level).toEqual('info');
        expect(args.message).toEqual('foo');
        expect(args.boop).toEqual('scoop');
        expect(args.bar).toEqual('baz');

        expect(logglyTransport.log).toHaveBeenCalled();
      });
    });
  });

  describe('client', () => {
    it('should make call to console with correct args', () => {
      const logger = new Logger({
        globalMeta: {
          boop: 'scoop',
        },
      });
      logger.isServer = false;

      spyOn(console, 'info').andReturn(true);
      logger.info('foo');
      expect(console.info).toHaveBeenCalledWith('info:', 'foo', util.inspect({
        boop: 'scoop',
      }));
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
      ['info', ['foo', 'boop', 'scoop'], ['info', 'foo', 'boop', 'scoop']],
      ['debugf', ['foo %s %d', 'bar', 10], ['debug', 'foo bar 10']],
      ['debug', ['foo', 'boop', 'scoop'], ['debug', 'foo', 'boop', 'scoop']],
      ['warnf', ['foo %s %d', 'bar', 10], ['warn', 'foo bar 10']],
      ['warn', ['foo', 'boop', 'scoop'], ['warn', 'foo', 'boop', 'scoop']],
      ['errorf', ['foo %s %d', 'bar', 10], ['error', 'foo bar 10']],
      ['error', ['foo', 'boop', 'scoop'], ['error', 'foo', 'boop', 'scoop']],
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
