import { cookieStore } from "../../constants/cookies";
import {
  setAuthCookies,
  getAccessToken,
  getAuthCookies,
  removeAuthCookies,
} from "../../lib/utils/cookies";

// Mock implementation of the cookies function
const mockSet = jest.fn();
const mockGet = jest.fn();
const mockDelete = jest.fn();

jest.mock("next/headers", () => ({
  cookies: jest.fn(() => ({
    set: mockSet,
    get: mockGet,
    delete: mockDelete,
  })),
}));

describe("Auth Cookie Helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should set auth cookies", () => {
    const accessToken = "access_token";
    const refreshToken = "refresh_token";

    setAuthCookies(accessToken, refreshToken);

    expect(mockSet).toHaveBeenCalledWith({
      name: cookieStore.token,
      value: accessToken,
    });
    expect(mockSet).toHaveBeenCalledWith({
      name: cookieStore.refreshToken,
      value: refreshToken,
    });
  });

  it("should get access token from cookies", () => {
    const token = "access_token";
    mockGet.mockReturnValueOnce({ value: token });

    const result = getAccessToken();

    expect(result).toBe(token);
    expect(mockGet).toHaveBeenCalledWith(cookieStore.token);
  });

  it("should return undefined if access token is not present", () => {
    mockGet.mockReturnValueOnce(undefined);

    const result = getAccessToken();
    expect(result).toBeUndefined;
    expect(mockGet).toHaveBeenCalledWith(cookieStore.token);
  });

  it("should get auth cookies", () => {
    const token = "access_token";
    const refreshToken = "refresh_token";
    mockGet.mockImplementation((name) => {
      if (name === cookieStore.token) {
        return { value: token };
      } else if (name === cookieStore.refreshToken) {
        return { value: refreshToken };
      }
    });
    const result = getAuthCookies();

    expect(result).toEqual({
      token,
      refresh_token: refreshToken,
    });
    expect(mockGet).toHaveBeenCalledWith(cookieStore.token);
    expect(mockGet).toHaveBeenCalledWith(cookieStore.refreshToken);
  });

  it("should return undefined for auth cookies if cookies are not present", () => {
    mockGet.mockReturnValueOnce(undefined);
    mockGet.mockReturnValueOnce(undefined);

    const result = getAuthCookies();
    expect(result).toEqual({
      token: undefined,
      refresh_token: undefined,
    });
  });

  it("should remove auth cookies", () => {
    removeAuthCookies();

    expect(mockDelete).toHaveBeenCalledWith(cookieStore.token);
    expect(mockDelete).toHaveBeenCalledWith(cookieStore.refreshToken);
  });
});
