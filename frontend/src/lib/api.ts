"use server";

import axiosInstance from "./axiosInstance";
import jwt from "jsonwebtoken";
import { getAccessToken, removeAuthCookies, setAuthCookies } from "@utils";
import {
  DecodedToken,
  FetchUserData,
  LoginResponse,
  PaginationMeta,
  Permissions,
  ResponseErrorI,
  FetchUsersAdminI,
} from "./requests";
import {
  ConstitutionByCid,
  ConstitutionMetadata,
  GovActionMetadata,
  GovernanceActionTableI,
  VotesTableI,
  GovActionStatus,
  PreviewReasoningModalState,
} from "@/components/organisms";

import { getTranslations } from "next-intl/server";
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
const DEFAULT_PAGINATION_LIMIT = 2;

export async function isTokenExpired(token: string): Promise<boolean> {
  try {
    // Decode the token without verifying the signature to get the payload
    const decodedToken = jwt.decode(token) as { exp: number };

    if (!decodedToken || !decodedToken.exp) {
      throw new Error("Token does not have an expiration time");
    }

    // Get the current time in seconds
    const currentTime = Math.floor(Date.now() / 1000);

    // Check if the token is expired
    return currentTime > decodedToken.exp;
  } catch (error) {
    console.error("Error decoding token:");
    return true; // Assume the token is expired if there's an error
  }
}

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
    const res = await fetch(`${baseURL}/api/auth/refresh`, {
      method: "POST",
      body: JSON.stringify({ refresh_token }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const responseData = await res.json();
    return responseData;
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

export async function getUsersAdmin({
  search,
  page = 1,
  limit = DEFAULT_PAGINATION_LIMIT,
  searchParams,
}: {
  search?: string;
  page?: number;
  limit?: number;
  searchParams?: URLSearchParams;
}): Promise<FetchUsersAdminI> {
  const token = getAccessToken();

  try {
    const decodedToken = await decodeUserToken();
    const res: { data: FetchUserData[]; meta: PaginationMeta } =
      await axiosInstance.get(
        `/api/users/${decodedToken?.userId}/search-admin?${
          search ? `search=${search}` : ""
        }&${page ? `page=${page}` : ""}&limit=${limit}`,
        {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      );
    return res;
  } catch (error) {
    const t = await getTranslations();
    const customErrorMessage =
      !token &&
      error.res?.statusCode === 401 &&
      t(`General.errors.sessionExpired`);
    return {
      error: customErrorMessage || t("General.errors.somethingWentWrong"),
      statusCode: error.res.statusCode || null,
    };
  }
}

export async function getMembers({
  search,
  sortBy,
  page = 1,
  limit = DEFAULT_PAGINATION_LIMIT,
}: {
  search?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
  searchParams?: any;
}): Promise<{ data: FetchUserData[]; meta: PaginationMeta }> {
  try {
    const res: { data: FetchUserData[]; meta: PaginationMeta } =
      await axiosInstance.get(
        `/api/users/cc-member/search?${search ? `search=${search}` : ""}&${
          sortBy ? `sortBy=${sortBy}` : ""
        }&${page ? `page=${page}` : ""}&limit=${limit}`
      );
    return res;
  } catch (error) {
    console.log("error get members", error);
  }
}

export async function getLatestUpdates({
  page = 1,
  limit = DEFAULT_PAGINATION_LIMIT,
  search,
  govActionType,
  vote,
  sortBy,
}: {
  page?: number;
  limit?: number;
  search?: string;
  govActionType?: string;
  vote?: string;
  sortBy?: string;
}): Promise<{ data: VotesTableI[]; meta: PaginationMeta }> {
  try {
    const res: { data: VotesTableI[]; meta: PaginationMeta } =
      await axiosInstance.get(
        `/api/governance/votes/search?${search ? `search=${search}` : ""}&${
          govActionType ? `filter.govActionType=$in:${govActionType}` : ""
        }&${vote ? `filter.vote=$in:${vote}` : ""}&${
          sortBy ? `sortBy=${sortBy}` : ""
        }&${page ? `page=${page}` : ""}&limit=${limit}`
      );
    return res;
  } catch (error) {
    console.log("error get latest updates", error);
  }
}

export async function getUserVotes({
  search,
  govActionType,
  vote,
  sortBy,
  userId,
}: {
  search?: string;
  govActionType?: string;
  vote?: string;
  sortBy?: string;
  userId?: string;
}): Promise<VotesTableI[]> {
  try {
    const res: { data: VotesTableI[] } = await axiosInstance.get(
      `/api/governance/votes/search?filter.userId=$eq:${userId}&${
        search ? `search=${search}` : ""
      }&${govActionType ? `filter.govActionType=$in:${govActionType}` : ""}&${
        vote ? `filter.vote=$in:${vote}` : ""
      }&${sortBy ? `sortBy=${sortBy}` : ""}`
    );
    console.log("res", res.data);
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

export async function getGovernanceActions({
  search,
  govActionType,
  status,
  sortBy,
  userId,
}: {
  search?: string;
  govActionType?: string;
  status?: string;
  sortBy?: string;
  userId?: string;
}): Promise<GovernanceActionTableI[]> {
  try {
    const res: GovernanceActionTableI[] = [
      {
        gov_action_proposal_id: "2",
        gov_action_proposal_title: "Title name",
        gov_action_proposal_type: "HardForkInitiation",
        gov_action_proposal_status: "PENDING" as GovActionStatus,
        abstract:
          "Lorem ipsum dolor sit amet consectetur. Amet orci adipiscing proin duis nibh. Sed id amet integer ultrices lobortis. Velit.",
      },
      {
        gov_action_proposal_id: "2",
        gov_action_proposal_title: "Title name",
        gov_action_proposal_type: "HardForkInitiation",
        gov_action_proposal_status: "VOTED" as GovActionStatus,
        abstract:
          "Lorem ipsum dolor sit amet consectetur. Amet orci adipiscing proin duis nibh. Sed id amet integer ultrices lobortis. Velit. ",
      },
      {
        gov_action_proposal_id: "16",
        gov_action_proposal_title: "Title name",
        gov_action_proposal_type: "HardForkInitiation",
        gov_action_proposal_status: "UNVOTED" as GovActionStatus,
        abstract:
          "Lorem ipsum dolor sit amet consectetur. Amet orci adipiscing proin duis nibh. Sed id amet integer ultrices lobortis. Velit.",
      },
      {
        gov_action_proposal_id: "16",
        gov_action_proposal_title: "Title name",
        gov_action_proposal_type: "HardForkInitiation",
        gov_action_proposal_status: "UNVOTED" as GovActionStatus,
        abstract:
          "Lorem ipsum dolor sit amet consectetur. Amet orci adipiscing proin duis nibh. Sed id amet integer ultrices lobortis. Velit.",
      },
    ];
    return res;
  } catch (error) {
    console.log("error get governance actions", error);
  }
}

export async function getReasoningData(id: string) {
  try {
    const response: PreviewReasoningModalState = {
      title: "Reasoning title 1",
      description:
        "Lorem ipsum dolor sit amet consectetur. Neque eleifend sed sit elementum vulputate. At diam orci mauris sit in nulla. Dui id urna aliquet et tempor est mattis. Sit ornare.",

      gov_action_proposal_id: "g_77788675",
      gov_action_proposal_title: "Title name",
      gov_action_proposal_type: "HardForkInitiation",
      abstract:
        "Lorem ipsum dolor sit amet consectetur. Amet orci adipiscing proin duis nibh. Sed id amet integer ultrices lobortis. Velit.",

      vote: "yes",
      submission_date: "2024-05-19T12:49:10.631Z",
      expiry_date: "2024-06-19T12:49:10.631Z",
    };
    return response;
  } catch (error) {
    console.log("error get reasoning data", error);
    throw error;
  }
}

export async function registerUser(email: string) {
  const token = getAccessToken();

  try {
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
    const t = await getTranslations();
    const customErrorMessage =
      !token &&
      error.res?.statusCode === 401 &&
      t(`General.errors.sessionExpired`);
    return {
      error: customErrorMessage || t("Modals.addMember.alerts.error"),
      statusCode: error.res.statusCode || null,
    };
  }
}

export async function registerAdmin(email: string, permissions: Permissions[]) {
  const token = getAccessToken();

  try {
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
    const t = await getTranslations();
    const customErrorMessage =
      !token &&
      error.res?.statusCode === 401 &&
      t(`General.errors.sessionExpired`);
    return {
      error: customErrorMessage || t("Modals.addMember.alerts.error"),
      statusCode: error.res.statusCode || null,
    };
  }
}

export async function editUser(
  id: string,
  data: FormData
): Promise<ResponseErrorI | FetchUserData> {
  const token = getAccessToken();
  try {
    const response: FetchUserData = await axiosInstance.patch(
      `/api/users/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    const t = await getTranslations();
    const customErrorMessage =
      !token &&
      error.res?.statusCode === 401 &&
      t(`General.errors.sessionExpired`);
    return {
      error: customErrorMessage || t("Modals.signUp.alerts.error"),
      statusCode: error.res.statusCode || null,
    };
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
  const token = getAccessToken();

  try {
    const response = await axiosInstance.post("/api/constitution", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const t = await getTranslations();
    let errorMessage = t("Modals.uploadConstitution.alerts.error");
    if (token && error.res?.statusCode === 401) {
      errorMessage = t(`General.errors.sessionExpired`);
    } else if (error.res?.statusCode === 409) {
      errorMessage = t(`Modals.uploadConstitution.alerts.409`);
    }

    return {
      error: errorMessage,
      statusCode: error.res.statusCode || null,
    };
  }
}

export async function uploadUserPhoto(
  userId: string,
  data: FormData
): Promise<ResponseErrorI | FetchUserData> {
  const token = getAccessToken();
  try {
    const response: FetchUserData = await axiosInstance.patch(
      `/api/users/${userId}/profile-photo`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    const t = await getTranslations();
    const customErrorMessage =
      !token &&
      error.res?.statusCode === 401 &&
      t(`General.errors.sessionExpired`);
    return {
      error: customErrorMessage || t("Modals.signUp.alerts.error"),
      statusCode: error.res.statusCode || null,
    };
  }
}
