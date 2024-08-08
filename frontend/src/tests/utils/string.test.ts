import { truncateText } from "../../lib/utils/string";

describe("truncateText", () => {
  it("should return the text itself if it's shorter than the limit", () => {
    const text = "Short text";
    const limit = 20;
    expect(truncateText(text, limit)).toBe(text);
  });

  it("should truncate the text and add '...' if it's longer than the limit", () => {
    const text = "This is a very long text that needs truncation";
    const limit = 20;
    expect(truncateText(text, limit)).toBe("This is a very long ...");
  });

  it("should handle text exactly at the limit", () => {
    const text = "ExactLength";
    const limit = 11;
    expect(truncateText(text, limit)).toBe(text);
  });

  it("should return undefined if the text is empty", () => {
    const text = "";
    const limit = 10;
    expect(truncateText(text, limit)).toBeUndefined();
  });

  it("should return undefined if the text is null", () => {
    const text = null as unknown as string;
    const limit = 10;
    expect(truncateText(text, limit)).toBeUndefined();
  });
});
