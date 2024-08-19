import { getShortenedGovActionId } from "../../lib/utils/getGovActionId";

describe("getShortenedGovActionId", () => {
  it("should return the txHash as is when its length is less than or equal to sliceTo", () => {
    expect(getShortenedGovActionId("123456")).toBe("123456");
    expect(getShortenedGovActionId("1234")).toBe("1234");
  });

  it("should shorten the txHash when its length is greater than sliceTo", () => {
    expect(getShortenedGovActionId("1234567890")).toBe("1234...7890");
    expect(getShortenedGovActionId("abcdefghij", 3)).toBe("abc...hij");
  });

  it("should use default sliceTo value of 4 if not specified", () => {
    expect(getShortenedGovActionId("abcdefghij")).toBe("abcd...ghij");
  });

  it("should handle edge case where sliceTo is greater than txHash length", () => {
    expect(getShortenedGovActionId("abc", 10)).toBe("abc");
  });

  it("should handle empty txHash", () => {
    expect(getShortenedGovActionId("")).toBe("");
  });
});
