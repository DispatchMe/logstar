import { argumentsToString } from '../format';

describe('format', () => {
  describe('argumentsToString', () => {
    const format = (...args) => {
      return argumentsToString(args);
    };

    it('supports errors', () => {
      expect(format(new Error('Battery dead'))).toEqual('[Error: Battery dead]');
    });

    it('supports nested objects', () => {
      expect(format({
        temperature: {
          farenheit: 30,
        },
        location: {
          name: 'Dispatch HQ',
          address: {
            city: 'Boston',
            state: 'MA',
          },
        },
      })).toEqual("{ temperature: { farenheit: \u001b[33m30\u001b[39m },\n  location: \n   { name: \u001b[32m'Dispatch HQ'\u001b[39m,\n     address: { city: \u001b[32m'Boston'\u001b[39m, state: \u001b[32m'MA'\u001b[39m } } }");
    });

    it('supports multiple arguments', () => {
      expect(format(1, false, 'hi')).toEqual('1 false hi');
    });

    describe('server', () => {
      it('uses yellow for numbers', () => {
        expect(format({
          num: 25,
        })).toEqual('{ num: \u001b[33m25\u001b[39m }');
      });

      it('uses green for strings', () => {
        expect(format({
          foo: 'bar',
        })).toEqual('{ foo: \u001b[32m\'bar\'\u001b[39m }');
      });
    });
  });
});
