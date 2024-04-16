"use server";

import axiosInstance from "./axiosInstance";
import jwt from "jsonwebtoken";
import { getAccessToken, removeAuthCookies, setAuthCookies } from "@utils";
import {
  DecodedToken,
  FetchUserData,
  LoginResponse,
  Permissions,
} from "./requests";

// Function to decode the user token stored in the authentication cookie
export async function decodeUserToken(): Promise<DecodedToken | undefined> {
  const token = getAccessToken();

  if (token) {
    const decoded = jwt.decode(token);
    return decoded;
  }
  return;
}

export async function login(email: FormDataEntryValue): Promise<LoginResponse> {
  try {
    const res: LoginResponse = await axiosInstance.post("/api/auth/login", {
      destination: email,
    });
    return res;
  } catch (error) {
    console.log("error login admin");
  }
}

// Function to handle the authentication callback after the user clicks on the login magic link
export async function loginAuthCallback(token: string) {
  try {
    const res = await axiosInstance.get<string, any>(
      `/api/auth/login/callback?token=${token}`
    );
    setAuthCookies(res.access_token, res.refresh_token);
    return res;
  } catch (error) {
    console.log("error login authCallback");
    throw error;
  }
}

// Function to handle the authentication callback after the user clicks on the register magic link
export async function registerAuthCallback(token: string) {
  try {
    const res = await axiosInstance.get<string, any>(
      `/api/auth/register/callback?token=${token}`
    );
    setAuthCookies(res.access_token, res.refresh_token);
    return res;
  } catch (error) {
    console.log("error register authCallback");
    throw error;
  }
}

export async function refreshToken(refresh_token: string) {
  try {
    const res = await axiosInstance.post<string, any>(`/api/auth/refresh`, {
      refresh_token,
    });
    setAuthCookies(res.access_token, res.refresh_token);

    return res;
  } catch (error) {
    console.error("error refresh token");
  }
}

export async function logout() {
  try {
    removeAuthCookies();
  } catch (error) {
    console.log("error logout", error);
  }
}

export async function getUser(id: string): Promise<FetchUserData> {
  try {
    const res: FetchUserData = await axiosInstance.get(`/api/users/${id}`);
    return res;
  } catch (error) {
    console.log("error fetching user");
  }
}

export async function getUsers() {
  try {
    const res = await axiosInstance.get("/api/users");
    return res;
  } catch (error) {
    console.log("error get users", error);
  }
}

export async function registerUser(email: string) {
  try {
    const token = getAccessToken();

    const res = await axiosInstance.post(
      "/api/auth/register-user",
      {
        destination: email,
      },
      {
        headers: {
          Authorization: `bearer ${token}`,
        },
      }
    );
    return res;
  } catch (error) {
    console.log("error register user", error);
  }
}

export async function registerAdmin(email: string, permissions: Permissions[]) {
  try {
    const token = getAccessToken();

    const res = await axiosInstance.post(
      "/api/auth/register-admin",
      {
        destination: email,
        permissions,
      },
      {
        headers: {
          Authorization: `bearer ${token}`,
        },
      }
    );
    return res;
  } catch (error) {
    console.log("error register admin");
  }
}
