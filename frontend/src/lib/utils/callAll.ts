/**
 * Creates a function that calls all provided functions with the given arguments.
 *
 * @param fns - A list of functions to be called. These functions are executed in the order they are provided.
 * @returns A new function that, when invoked, will call each of the provided functions with the given arguments.
 *
 * @example
 * const fn1 = (a: number) => console.log('fn1', a);
 * const fn2 = (a: number) => console.log('fn2', a);
 *
 * const combinedFn = callAll(fn1, fn2);
 * combinedFn(42);
 * // Output:
 * // "fn1 42"
 * // "fn2 42"
 */
export const callAll =
  (...fns: any[]) =>
  (...args: any[]) =>
    fns.forEach((fn) => fn && fn(...args));
