export interface BasicReducer<T> {
  (prevState: T, newState: Partial<T>): T;
}

/**
 * A basic reducer function that merges the previous state with the new state.
 *
 * @template T - The type of the state object.
 * @param prevState - The previous state object.
 * @param newState - A partial state object containing updates to be merged with the `prevState`.
 * @returns The new state object which is a combination of `prevState` and `newState`.
 *
 * @example
 * const reducer = basicReducer<{ count: number }> ;
 * const initialState = { count: 0 };
 * const updatedState = reducer(initialState, { count: 1 });
 * // updatedState is { count: 1 }
 */
export const basicReducer = <T>(prevState: T, newState: Partial<T>): T => ({
  ...prevState,
  ...newState,
});
