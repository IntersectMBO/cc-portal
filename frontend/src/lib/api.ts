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
import { ConstitutionMetadata } from "@/components/organisms";
import { cookies } from "next/headers";

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
    console.log("LOGIN SUCCESS");
    return res;
  } catch (error) {
    throw error;
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

export async function getUsers(): Promise<FetchUserData[]> {
  try {
    const res: FetchUserData[] = await axiosInstance.get("/api/users");
    return res;
  } catch (error) {
    console.log("error get users", error);
  }
}

export async function getUsersPublic(): Promise<FetchUserData[]> {
  try {
    const res: FetchUserData[] = await axiosInstance.get("/api/users/cc-member/search");
    return res;
  } catch (error) {
    console.log("error get users public", error);
  }
}

export async function getUsersAdmin(userId: string): Promise<FetchUserData[]> {
  try {
    const token = getAccessToken();

    const res: FetchUserData[] = await axiosInstance.get(`/api/users/${userId}/search-admin`, {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    console.log("error get users admin", error);
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

export async function editUser(id: string, data: FormData) {
  try {
    const token = getAccessToken();
    const response = await axiosInstance.patch(`/api/users/${id}`, data, {
      headers: {
        Authorization: `bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export async function getConstitutionMetadata(): Promise<
  ConstitutionMetadata[]
> {
  try {
    const response: ConstitutionMetadata[] = await axiosInstance.get(
      "/api/constitution"
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export async function getConstitutionByCid(cid: string) {
  try {
    const response: any = await axiosInstance.get(
      `/api/constitution/cid/${cid}`
    );
    return response;
  } catch (error) {
    throw error;
  }
}
