import {
  isEmpty,
  countSelectedFilters,
  isResponseErrorI,
} from "../../lib/utils/helpers";
import { ResponseErrorI } from "../../lib/requests";

// Mock `ResponseErrorI` for testing
const mockResponseError: ResponseErrorI = {
  error: "Sample error message",
};

describe("Helpers", () => {
  describe("isEmpty", () => {
    it("should return true for null", () => {
      expect(isEmpty(null)).toBe(true);
    });

    it("should return true for undefined", () => {
      expect(isEmpty(undefined)).toBe(true);
    });

    it("should return true for empty array", () => {
      expect(isEmpty([])).toBe(true);
    });

    it("should return true for empty object", () => {
      expect(isEmpty({})).toBe(true);
    });

    it("should return false for non-empty array", () => {
      expect(isEmpty([1])).toBe(false);
    });

    it("should return false for non-empty object", () => {
      expect(isEmpty({ key: "value" })).toBe(false);
    });

    it("should return false for non-object and non-array types", () => {
      expect(isEmpty(0)).toBe(false);
      expect(isEmpty("string")).toBe(false);
      expect(isEmpty(true)).toBe(false);
    });
  });

  describe("countSelectedFilters", () => {
    it("should return 0 for an empty filters object", () => {
      expect(countSelectedFilters({})).toBe(0);
    });

    it("should return the correct count for a filters object with multiple categories", () => {
      const filters = {
        category1: ["filter1", "filter2"],
        category2: ["filter3"],
        category3: [],
      };
      expect(countSelectedFilters(filters)).toBe(3);
    });

    it("should return the correct count for a filters object with some empty arrays", () => {
      const filters = {
        category1: ["filter1"],
        category2: [],
        category3: ["filter2", "filter3"],
      };
      expect(countSelectedFilters(filters)).toBe(3);
    });

    it("should return 0 for a filters object with only empty arrays", () => {
      const filters = {
        category1: [],
        category2: [],
      };
      expect(countSelectedFilters(filters)).toBe(0);
    });
  });

  describe("isResponseErrorI", () => {
    it('should return true for an object with an "error" property', () => {
      expect(isResponseErrorI(mockResponseError)).toBe(true);
    });

    it('should return false for an object without an "error" property', () => {
      const nonErrorObj = { message: "Sample message" };
      expect(isResponseErrorI(nonErrorObj)).toBe(false);
    });

    it("should return false for non-object types", () => {
      expect(isResponseErrorI(null)).toBe(false);
      expect(isResponseErrorI(undefined)).toBe(false);
      expect(isResponseErrorI(123)).toBe(false);
      expect(isResponseErrorI("string")).toBe(false);
      expect(isResponseErrorI([])).toBe(false);
    });
  });
});
