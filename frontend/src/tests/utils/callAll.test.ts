import { callAll } from "../../lib/utils/callAll";

describe("callAll", () => {
  it("should call all provided functions with the given arguments", () => {
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();
    const mockFn3 = jest.fn();

    const combinedFn = callAll(mockFn1, mockFn2, mockFn3);
    const args = [1, 2, 3];

    combinedFn(...args);

    expect(mockFn1).toHaveBeenCalledWith(...args);
    expect(mockFn2).toHaveBeenCalledWith(...args);
    expect(mockFn3).toHaveBeenCalledWith(...args);
  });

  it("should call functions in the order they are provided", () => {
    const callOrder: number[] = [];
    const mockFn1 = () => callOrder.push(1);
    const mockFn2 = () => callOrder.push(2);
    const mockFn3 = () => callOrder.push(3);

    const combinedFn = callAll(mockFn1, mockFn2, mockFn3);

    combinedFn();

    expect(callOrder).toEqual([1, 2, 3]);
  });

  it("should handle no functions provided gracefully", () => {
    const combinedFn = callAll();

    // No functions to call, so this should not throw or produce any side effects
    expect(() => combinedFn()).not.toThrow();
  });
});
