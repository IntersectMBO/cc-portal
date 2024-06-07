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
import {
  ConstitutionByCid,
  ConstitutionMetadata,
  GovActionMetadata,
  VotesTableI,
} from "@/components/organisms";

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

export async function getUsersAdmin(): Promise<FetchUserData[]> {
  try {
    const token = getAccessToken();
    const { userId } = await decodeUserToken();

    const res: { data: FetchUserData[] } = await axiosInstance.get(
      `/api/users/${userId}/search-admin`,
      {
        headers: {
          Authorization: `bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.log("error get users admin", error);
  }
}

export async function getMembers(): Promise<any[]> {
  try {
    const res: { data: FetchUserData[] } = await axiosInstance.get(
      "/api/users/cc-member/search"
    );
    return res.data;
  } catch (error) {
    console.log("error get members", error);
  }
}

export async function getLatestUpdates({
  search,
  govActionType,
  vote,
  sortBy,
}: {
  search?: string;
  govActionType?: string;
  vote?: string;
  sortBy?: string;
}): Promise<VotesTableI[]> {
  try {
    const res: { data: VotesTableI[] } = await axiosInstance.get(
      `/api/governance/votes/search?${search ? `search=${search}` : ""}&${
        govActionType ? `filter.govActionType=$in:${govActionType}` : ""
      }&${vote ? `filter.vote=$in:${vote}` : ""}&${
        sortBy ? `sortBy=${sortBy}` : ""
      }`
    );
    return res.data;
  } catch (error) {
    console.log("error get latest updates", error);
  }
}

export async function getUserVotes(id: string): Promise<VotesTableI[]> {
  try {
    const res: { data: VotesTableI[] } = await axiosInstance.get(
      `/api/governance/votes/search?filter.userId=$eq:${id}`
    );
    return res.data;
  } catch (error) {
    console.log("error get latest updates", error);
  }
}

export async function getGovernanceMetadata(id: string): Promise<any> {
  try {
    const res: GovActionMetadata = await axiosInstance.get(
      `/api/governance/${id}`
    );
    return res;
  } catch (error) {
    console.log("error get latest updates", error);
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
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.log("ERROREDIT", error, "ERROREDIT");
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

export async function getConstitutionByCid(
  cid: string
): Promise<ConstitutionByCid> {
  try {
    const response: any = await axiosInstance.get(
      `/api/constitution/cid/${cid}`
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export async function uploadConstitution(data: FormData) {
  try {
    const token = getAccessToken();

    const response = await axiosInstance.post("/api/constitution", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function uploadUserPhoto(userId: string, data: FormData) {
  try {
    const response = await axiosInstance.patch(
      `/api/users/${userId}/profile-photo`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}
