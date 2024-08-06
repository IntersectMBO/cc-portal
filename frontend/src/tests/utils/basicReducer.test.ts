import { basicReducer } from "../../lib/utils/basicReducer";

interface State {
  name: string;
  age: number;
  email: string;
}

describe("basicReducer", () => {
  it("should return a new state with updated properties", () => {
    const prevState: State = {
      name: "John Doe",
      age: 30,
      email: "john.doe@example.com",
    };

    const newState: Partial<State> = {
      age: 31,
      email: "john.new@example.com",
    };

    const expectedState: State = {
      name: "John Doe",
      age: 31,
      email: "john.new@example.com",
    };

    expect(basicReducer(prevState, newState)).toEqual(expectedState);
  });

  it("should retain the previous state properties if not updated", () => {
    const prevState: State = {
      name: "John Doe",
      age: 30,
      email: "john.doe@example.com",
    };

    const newState: Partial<State> = {
      name: "Jane Doe",
    };

    const expectedState: State = {
      name: "Jane Doe",
      age: 30,
      email: "john.doe@example.com",
    };

    expect(basicReducer(prevState, newState)).toEqual(expectedState);
  });

  it("should handle an empty new state", () => {
    const prevState: State = {
      name: "John Doe",
      age: 30,
      email: "john.doe@example.com",
    };

    const newState: Partial<State> = {};

    const expectedState: State = {
      name: "John Doe",
      age: 30,
      email: "john.doe@example.com",
    };

    expect(basicReducer(prevState, newState)).toEqual(expectedState);
  });

  it("should handle an empty previous state", () => {
    const prevState: State = {
      name: "",
      age: 0,
      email: "",
    };

    const newState: Partial<State> = {
      name: "John Doe",
      age: 30,
      email: "john.doe@example.com",
    };

    const expectedState: State = {
      name: "John Doe",
      age: 30,
      email: "john.doe@example.com",
    };

    expect(basicReducer(prevState, newState)).toEqual(expectedState);
  });

  it("should handle an empty previous state and new state", () => {
    const prevState: State = {
      name: "",
      age: 0,
      email: "",
    };

    const newState: Partial<State> = {};

    const expectedState: State = {
      name: "",
      age: 0,
      email: "",
    };

    expect(basicReducer(prevState, newState)).toEqual(expectedState);
  });
});
