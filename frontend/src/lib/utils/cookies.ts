"use server";
import { cookieStore } from "@consts";
import { cookies } from "next/headers";

// Function to set authentication cookies containing access token and refresh token
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

// Function to get the access token from the authentication cookies
export const getAccessToken = (): string => {
  const token = cookies().get(cookieStore.token)?.value;
  return token;
};

// Function to get the authentication cookies containing access token and refresh token
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

// Function to remove authentication cookies
export const removeAuthCookies = () => {
  cookies().delete(cookieStore.token);
  cookies().delete(cookieStore.refreshToken);
};
