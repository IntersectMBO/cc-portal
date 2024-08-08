"use server";
import { cookieStore } from "@/constants/cookies";
import { cookies } from "next/headers";

/**
 * Sets authentication cookies containing the access token and refresh token.
 *
 * This function stores the access token and refresh token in cookies for
 * managing user authentication. The cookies are used to maintain user
 * sessions and are typically set during login or token refresh operations.
 *
 * @param access_token - The access token to be stored in the cookie.
 * @param refresh_token - The refresh token to be stored in the cookie.
 *
 * @example
 * // Set authentication cookies
 * setAuthCookies('accessToken123', 'refreshToken456');
 */

export const setAuthCookies = (access_token: string, refresh_token: string) => {
  cookies().set({
    name: cookieStore.token,
    value: access_token,
  });
  cookies().set({
    name: cookieStore.refreshToken,
    value: refresh_token,
  });
};

/**
 * Retrieves the access token from the authentication cookies.
 *
 * This function reads the access token from the cookie store. It is used
 * to obtain the access token for making authenticated requests.
 *
 * @returns The access token stored in the cookie, or `undefined` if not set.
 *
 * @example
 * // Get the access token
 * const token = getAccessToken();
 */
export const getAccessToken = (): string => {
  const token = cookies().get(cookieStore.token)?.value;
  return token;
};

/**
 * Retrieves the authentication cookies containing the access token and refresh token.
 *
 * This function returns both the access token and refresh token from the cookie store.
 * It is useful for scenarios where both tokens are needed, such as during session
 * validation or token renewal.
 *
 * @returns An object containing the access token and refresh token.
 *
 * @example
 * // Get authentication cookies
 * const authCookies = getAuthCookies();
 */
export const getAuthCookies = (): {
  token: string;
  refresh_token: string;
} => {
  const refresh_token = cookies().get(cookieStore.refreshToken)?.value;
  return {
    token: getAccessToken(),
    refresh_token,
  };
};

/**
 * Removes the authentication cookies.
 *
 * This function deletes the cookies that store the access token and refresh token.
 * It is typically used during logout or when the user session needs to be cleared.
 *
 * @example
 * // Remove authentication cookies
 * removeAuthCookies();
 */
export const removeAuthCookies = () => {
  cookies().delete(cookieStore.token);
  cookies().delete(cookieStore.refreshToken);
};
