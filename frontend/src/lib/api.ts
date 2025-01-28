"use server";

import {
  ConstitutionByCid,
  ConstitutionMetadata,
  GovActionMetadata,
} from "@organisms";
import { getAccessToken, isEmpty, setAuthCookies } from "@utils";
import jwt from "jsonwebtoken";
import axiosInstance from "./axiosInstance";
import {
  AddReasoningRequestI,
  DecodedToken,
  FetchUserData,
  FetchUsersAdminI,
  GetGovernanceActionsI,
  GovernanceActionTableI,
  LoginResponse,
  PaginationMeta,
  Permissions,
  ReasoningResponseI,
  ResponseErrorI,
  UserAuthStatus,
  VotesTableI,
} from "./requests";

import { getTranslations } from "next-intl/server";
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";
const DEFAULT_PAGINATION_LIMIT = 7;

/**
 * Checks if the provided token is expired.
 *
 * This asynchronous function decodes the token to extract the expiration time (`exp` field) and compares it
 * with the current time to determine if the token has expired.
 *
 * If the token cannot be decoded or does not have an expiration time, the function assumes the token is expired.
 *
 * @param token - The token to check for expiration.
 * @returns A Promise that resolves to `true` if the token is expired, or `false` if it is still valid.
 *
 * @throws An error if the token does not contain an expiration time or if decoding fails.
 *
 */
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

/**
 * This function retrieves the access token from the authentication cookies and
 * then decodes it to extract user information.
 *
 * @returns A Promise that resolves to the decoded token object if the token is present and successfully decoded,
 *          or `undefined` if no token is found or if the token could not be decoded.
 */
export async function decodeUserToken(): Promise<DecodedToken | undefined> {
  const token = getAccessToken();

  if (token) {
    const decoded = jwt.decode(token);
    return decoded;
  }
  return;
}

/**
 * This function creates a URL by appending query parameters to a given base path.
 * It includes only those parameters that have defined and non-empty values.
 *
 * @param path - The base path of the API endpoint. This is the URL to which query parameters will be appended.
 * @param queryParams - An object where each key-value pair represents a query parameter.
 *                      The key is the parameter name and the value is the parameter value (either string or number).
 *                      Only parameters with defined and non-empty values are included in the final URL.
 * @returns The constructed URL with the query parameters appended in the query string format.
 *
 * @example
 * // Example usage:
 * buildApiUrl('/api/search', { query: 'test', page: 1, limit: null });
 * // Returns: "/api/search?query=test&page=1"
 */
function buildApiUrl(
  path: string,
  queryParams: { [key: string]: string | number }
): string {
  const queryString = Object.keys(queryParams)
    .filter((key) => !isEmpty(queryParams[key]))
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`
    )
    .join("&");

  return `${path}?${queryString}`;
}

export async function login(
  email: FormDataEntryValue
): Promise<LoginResponse | ResponseErrorI> {
  try {
    const res: LoginResponse = await axiosInstance.post("/api/auth/login", {
      destination: email,
    });
    return res;
  } catch (error) {
    const t = await getTranslations();
    return {
      error: t("Modals.signIn.alerts.error"),
      statusCode: error.res?.statusCode || null,
    };
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
    const t = await getTranslations();
    return {
      error: t("General.errors.somethingWentWrong"),
      statusCode: error.res?.statusCode || null,
    };
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
    const t = await getTranslations();
    return {
      error: t("General.errors.somethingWentWrong"),
      statusCode: error.res?.statusCode || null,
    };
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

export async function getUser(
  id: string
): Promise<FetchUserData | ResponseErrorI> {
  try {
    const res: FetchUserData = await axiosInstance.get(`/api/users/${id}`);
    return res;
  } catch (error) {
    const t = await getTranslations();
    const customErrorMessage =
      error.res?.statusCode === 401 && t(`General.errors.sessionExpired`);
    return {
      error: customErrorMessage || t(`General.errors.somethingWentWrong`),
      statusCode: error.res?.statusCode || null,
    };
  }
}

export async function toggleUserStatus(
  user_id: string,
  status: Omit<UserAuthStatus, "pending">
): Promise<FetchUserData | ResponseErrorI> {
  const token = getAccessToken();
  const decodedToken = await decodeUserToken();
  try {
    const res: FetchUserData = await axiosInstance.patch(
      `/api/users/${decodedToken?.userId}/toggle-status`,
      {
        user_id,
        status,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
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
      error: customErrorMessage || t("Modals.deleteRole.alerts.error"),
      statusCode: error.res?.statusCode || null,
    };
  }
}

export async function getUsersAdmin({
  search,
  sortBy,
  page = 1,
  limit = DEFAULT_PAGINATION_LIMIT,
}: {
  search?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}): Promise<FetchUsersAdminI | ResponseErrorI> {
  const token = getAccessToken();
  const decodedToken = await decodeUserToken();
  try {
    const path = buildApiUrl(
      `/api/users/${decodedToken?.userId}/search-admin`,
      {
        search,
        sortBy,
        page,
        limit,
      }
    );
    const res: { data: FetchUserData[]; meta: PaginationMeta } =
      await axiosInstance.get(path, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      });
    return res;
  } catch (error) {
    const t = await getTranslations();
    const customErrorMessage =
      !token &&
      error.res?.statusCode === 401 &&
      t(`General.errors.sessionExpired`);
    return {
      error: customErrorMessage || t("General.errors.somethingWentWrong"),
      statusCode: error.res?.statusCode || null,
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
}): Promise<{ data: FetchUserData[]; meta: PaginationMeta } | ResponseErrorI> {
  try {
    const path = buildApiUrl(`/api/users/cc-member/search`, {
      search,
      sortBy,
      page,
      limit,
    });
    const res: { data: FetchUserData[]; meta: PaginationMeta } =
      await axiosInstance.get(path);
    return res;
  } catch (error) {
    const t = await getTranslations();
    return {
      error: t("General.errors.somethingWentWrong"),
      statusCode: error.res?.statusCode || null,
    };
  }
}

export async function getVotingUpdates({
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
}): Promise<{ data: VotesTableI[]; meta: PaginationMeta } | ResponseErrorI> {
  try {
    const path = buildApiUrl(`/api/governance/votes/search`, {
      page,
      limit,
      search,
      sortBy,
      "filter.govActionProposal.govActionType":
        govActionType && `$in:${govActionType}`,
      "filter.vote": vote && `$in:${vote}`,
    });
    const res: { data: VotesTableI[]; meta: PaginationMeta } =
      await axiosInstance.get(path);

    return res;
  } catch (error) {
    const t = await getTranslations();
    return {
      error: t("General.errors.somethingWentWrong"),
      statusCode: error.res?.statusCode || null,
    };
  }
}

export async function getUserVotes({
  page = 1,
  limit = DEFAULT_PAGINATION_LIMIT,
  search,
  govActionType,
  vote,
  sortBy,
  userId,
}: {
  page?: number;
  limit?: number;
  search?: string;
  govActionType?: string;
  vote?: string;
  sortBy?: string;
  userId?: string;
}): Promise<{ data: VotesTableI[]; meta: PaginationMeta } | ResponseErrorI> {
  try {
    const path = buildApiUrl(`/api/governance/votes/search`, {
      page,
      limit,
      search,
      sortBy,
      "filter.govActionProposal.govActionType":
        govActionType && `$in:${govActionType}`,
      "filter.vote": vote && `$in:${vote}`,
      "filter.userId": `$eq:${userId}`,
    });
    const res: { data: VotesTableI[]; meta: PaginationMeta } =
      await axiosInstance.get(path);
    return res;
  } catch (error) {
    const t = await getTranslations();
    return {
      error: t("General.errors.somethingWentWrong"),
      statusCode: error.res?.statusCode || null,
    };
  }
}

export async function getGovernanceMetadata(
  id: string
): Promise<GovActionMetadata | ResponseErrorI> {
  try {
    const res: GovActionMetadata = await axiosInstance.get(
      `/api/governance/proposals/${id}`
    );
    return res;
  } catch (error) {
    const t = await getTranslations();
    return {
      error: t("Modals.govActionModal.alerts.error"),
      statusCode: error.res?.statusCode || null,
    };
  }
}

export async function getGovernanceActions({
  page = 1,
  limit = DEFAULT_PAGINATION_LIMIT,
  search,
  govActionType,
  status,
  sortBy,
}: {
  page?: number;
  limit?: number;
  search?: string;
  govActionType?: string;
  status?: string;
  sortBy?: string;
}): Promise<GetGovernanceActionsI> {
  const token = getAccessToken();
  const user = await decodeUserToken();

  try {
    const path = buildApiUrl(
      `/api/governance/users/${user?.userId}/proposals/search`,
      {
        page,
        limit,
        search,
        sortBy,
        "filter.govActionType": govActionType && `$in:${govActionType}`,
        "filter.status": status && `$in:${status}`,
      }
    );
    const res: { data: GovernanceActionTableI[]; meta: PaginationMeta } =
      await axiosInstance.get(path, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      });

    return res;
  } catch (error) {
    const t = await getTranslations();
    const customErrorMessage =
      !token &&
      error.res?.statusCode === 401 &&
      t(`General.errors.sessionExpired`);
    return {
      error: customErrorMessage || t("General.errors.somethingWentWrong"),
      statusCode: error.res?.statusCode || null,
    };
  }
}

export async function addOrUpdateReasoning({
  proposalId,
  ...data
}: AddReasoningRequestI): Promise<ReasoningResponseI | ResponseErrorI> {
  const token = getAccessToken();
  const user = await decodeUserToken();
  try {
    const response: ReasoningResponseI = await axiosInstance.post(
      `/api/governance/users/${user?.userId}/proposals/${proposalId}/rationale`,
      data,
      {
        headers: {
          Authorization: `bearer ${token}`,
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
      error: customErrorMessage || t("General.errors.somethingWentWrong"),
      statusCode: error.res?.statusCode || null,
    };
  }
}

export async function getReasoningData(
  proposalId: string
): Promise<ReasoningResponseI | ResponseErrorI> {
  const token = getAccessToken();
  const user = await decodeUserToken();
  try {
    const response: ReasoningResponseI = await axiosInstance.get(
      `/api/governance/users/${user?.userId}/proposals/${proposalId}/rationale`,
      {
        headers: {
          Authorization: `bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    const t = await getTranslations();
    return {
      error: t("Modals.previewRationale.alerts.error"),
      statusCode: error.res?.statusCode || null,
    };
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
      statusCode: error.res?.statusCode || null,
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
      statusCode: error.res?.statusCode || null,
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
      statusCode: error.res?.statusCode || null,
    };
  }
}

export async function getConstitutionMetadata(): Promise<
  ConstitutionMetadata[] | ResponseErrorI
> {
  try {
    const response: ConstitutionMetadata[] = await axiosInstance.get(
      "/api/constitution"
    );
    return response;
  } catch (error) {
    const t = await getTranslations();
    return {
      error: t("General.errors.somethingWentWrong"),
      statusCode: error.res?.statusCode || null,
    };
  }
}

export async function getConstitutionByCid(
  cid: string
): Promise<ConstitutionByCid | ResponseErrorI> {
  try {
    const response: ConstitutionByCid = await axiosInstance.get(
      `/api/constitution/cid/${cid}`
    );
    return response;
  } catch (error) {
    const t = await getTranslations();
    return {
      error: t("General.errors.somethingWentWrong"),
      statusCode: error.res?.statusCode || null,
    };
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
      statusCode: error.res?.statusCode || null,
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
      error:
        customErrorMessage || t("Modals.signUp.alerts.errorUploadProfilePhoto"),
      statusCode: error.res?.statusCode || null,
    };
  }
}

export async function resendRegisterEmail(email: string) {
  try {
    const token = getAccessToken();
    const res = await axiosInstance.post(
      `/api/auth/resend-register-invite`,
      {
        destination: email,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res;
  } catch (error) {
    const t = await getTranslations();
    return {
      error: t("UsersList.resendAlerts.error"),
      statusCode: error.res?.statusCode || null,
    };
  }
}
export async function deleteUser(sAdminId: string, userId: string) {
  const token = getAccessToken();
  try {
    const res = await axiosInstance.delete(`/api/users/${sAdminId}`, {
      data: {
        user_id: userId,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    const t = await getTranslations();
    return {
      error: t("Modals.deleteUser.alerts.error"),
      statusCode: error.res?.statusCode || null,
    };
  }
}
