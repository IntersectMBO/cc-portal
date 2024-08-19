import { createFormDataObject } from "../../lib/utils/forms";

describe("createFormDataObject", () => {
  it("should create a FormData object with non-empty properties", () => {
    const data = {
      name: "John Doe",
      email: "john@example.com",
      emptyField: "",
    };

    const formData = createFormDataObject(data);

    const formDataEntries = Array.from(formData.entries());
    const expectedEntries = Object.entries(data).filter(
      ([key, value]) => value !== ""
    );

    expect(formDataEntries).toEqual(expectedEntries);
  });

  it("should return an empty FormData object if all properties are empty", () => {
    const data = {
      name: "",
      email: "",
    };

    const formData = createFormDataObject(data);

    expect(Array.from(formData.entries())).toEqual([]);
  });

  it("should handle non-string values correctly", () => {
    const data = {
      number: 123,
      boolean: true,
      nullValue: null,
      undefinedValue: undefined,
    };

    const formData = createFormDataObject(data);

    expect(formData.has("number")).toBe(true);
    expect(formData.has("boolean")).toBe(true);
    expect(formData.has("nullValue")).toBe(false);
    expect(formData.has("undefinedValue")).toBe(false);

    expect(formData.get("number")).toBe("123");
    expect(formData.get("boolean")).toBe("true");
  });

  it("should handle File objects correctly", () => {
    const file = new File(["content"], "example.txt", { type: "text/plain" });
    const data = {
      file,
    };

    const formData = createFormDataObject(data);

    expect(formData.has("file")).toBe(true);
    expect(formData.get("file")).toBe(file);
  });
});
