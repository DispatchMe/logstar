import util from 'util';

// pass in function arguments object and returns string with whitespaces
export function argumentsToString(v) {
  // convert arguments object to real array
  const args = Array.prototype.slice.call(v);
  for (const k in args) {
    if (typeof args[k] === 'object') {
      if (util.inspect) {
        args[k] = util.inspect(args[k], false, null, true);
      } else {
        args[k] = JSON.stringify(args[k]);
      }
    }
  }

  const str = args.join(' ');
  return str;
}
