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
  LatestUpdates,
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

export async function getLatestUpdates(): Promise<any[]> {
  try {
    const res: { data: VotesTableI[] } = {
      data: [
        {
          id: "7ceb9ab7-6427-40b7-be2e-37ba6742d5fd",
          user_name: "Maria",
          user_address: "longaddress@example.com",
          value: "yes",
          reasoning_title: "This proposal is good for the ecosystem",
          comment:
            "Here i elaborated why this proposal is good for the ecosystem",
          governance_proposal_title: "Random title",
          governance_proposal_type: "ParameterChange",
          governance_proposal_resolved: false,
          governance_proposal_end_time: "End time of a governance proposal",
        },
        {
          id: "7ceb9ab7-6427-40b7-be2e-37ba6742d5fd",
          user_name: "Thomas",
          user_address: "test@example.com",
          value: "yes",
          reasoning_title: "This proposal is good for the ecosystem",
          comment:
            "Lorem ipsum dolor sit amet consectetur. Amet orci adipiscing proin duis nibh. Sed id amet integer ultrices lobortis. Velit  Amet orci adipiscing proin duis nibh. Sed id amet integer ultrices lobortis, lorem ipsum dolor sit amet consectetur.             ",
          governance_proposal_title:
            "This title can have up to 88 characters amet orci adipiscing proin duis nibh sed id am.",
          governance_proposal_type: "ParameterChange",
          governance_proposal_resolved: false,
          governance_proposal_end_time: "End time of a governance proposal",
        },
        {
          id: "7ceb9ab7-6427-40b7-be2e-37ba6742d5fd",
          user_name: "James",
          user_address: "test@example.com",
          value: "no",
          reasoning_title: "This proposal is good for the ecosystem",
          comment:
            "Here i elaborated why this proposal is good for the ecosystem",
          governance_proposal_title: "Random title",
          governance_proposal_type: "ParameterChange",
          governance_proposal_resolved: false,
          governance_proposal_end_time: "End time of a governance proposal",
        },
        {
          id: "7ceb9ab7-6427-40b7-be2e-37ba6742d5fd",
          user_name: "Nicole",
          user_address: "test@example.com",
          value: "abstain",
          reasoning_title: "This proposal is good for the ecosystem",
          comment:
            "Here i elaborated why this proposal is good for the ecosystem",
          governance_proposal_title: "Random title",
          governance_proposal_type: "ParameterChange",
          governance_proposal_resolved: false,
          governance_proposal_end_time: "End time of a governance proposal",
        },
      ],
    };
    return res.data;
  } catch (error) {
    console.log("error get latest updates", error);
  }
}

export async function getUserVotes(): Promise<any[]> {
  try {
    const res: { data: VotesTableI[] } = {
      data: [
        {
          id: "7ceb9ab7-6427-40b7-be2e-37ba6742d5fd",
          user_name: "Maria",
          user_address: "longaddress@example.com",
          value: "yes",
          reasoning_title: "This proposal is good for the ecosystem",
          comment:
            "Here i elaborated why this proposal is good for the ecosystem",
          governance_proposal_title: "Random title",
          governance_proposal_type: "ParameterChange",
          governance_proposal_resolved: false,
          governance_proposal_end_time: "End time of a governance proposal",
        },
        {
          id: "7ceb9ab7-6427-40b7-be2e-37ba6742d5fd",
          user_name: "Maria",
          user_address: "test@example.com",
          value: "yes",
          reasoning_title: "This proposal is good for the ecosystem",
          comment:
            "Lorem ipsum dolor sit amet consectetur. Amet orci adipiscing proin duis nibh. Sed id amet integer ultrices lobortis. Velit  Amet orci adipiscing proin duis nibh. Sed id amet integer ultrices lobortis, lorem ipsum dolor sit amet consectetur.             ",
          governance_proposal_title:
            "This title can have up to 88 characters amet orci adipiscing proin duis nibh sed id am.",
          governance_proposal_type: "ParameterChange",
          governance_proposal_resolved: false,
          governance_proposal_end_time: "End time of a governance proposal",
        },
        {
          id: "7ceb9ab7-6427-40b7-be2e-37ba6742d5fd",
          user_name: "Maria",
          user_address: "test@example.com",
          value: "no",
          reasoning_title: "This proposal is good for the ecosystem",
          comment:
            "Here i elaborated why this proposal is good for the ecosystem",
          governance_proposal_title: "Random title",
          governance_proposal_type: "ParameterChange",
          governance_proposal_resolved: false,
          governance_proposal_end_time: "End time of a governance proposal",
        },
        {
          id: "7ceb9ab7-6427-40b7-be2e-37ba6742d5fd",
          user_name: "Maria",
          user_address: "test@example.com",
          value: "abstain",
          reasoning_title: "This proposal is good for the ecosystem",
          comment:
            "Here i elaborated why this proposal is good for the ecosystem",
          governance_proposal_title: "Random title",
          governance_proposal_type: "ParameterChange",
          governance_proposal_resolved: false,
          governance_proposal_end_time: "End time of a governance proposal",
        },
      ],
    };
    return res.data;
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
