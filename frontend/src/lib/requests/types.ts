import { Vote } from "@atoms";

export type UserRole = "super_admin" | "admin" | "user" | "alumni" | null;

export interface RoleListObject {
  value: UserRole;
  label: string;
}

export type Permissions =
  | "manage_admins"
  | "manage_cc_members"
  | "add_constitution_version";

export interface PermissionsListObject {
  value: Permissions;
  label: string;
}

export interface DecodedToken {
  userId: string;
  email: string;
  role: UserRole;
  permissions: Permissions[];
  iat: number;
  exp: number;
}

export interface LoginResponse {
  success: boolean;
}

export type UserAuthStatus = "pending" | "active" | "inactive";

export interface FetchUserData {
  id: string;
  name: string | null;
  email: string;
  description: string | null;
  hot_addresses?: string | null;
  profile_photo_url: string | null;
  status: UserAuthStatus;
  role: UserRole;
  permissions: Permissions;
  created_at: Date;
  updated_at: Date;
}

export interface VotesTableI {
  user_name: string;
  user_address: string;
  user_photo_url?: string;
  value: Vote;
  reasoning_title?: string;
  reasoning_comment?: string;
  gov_action_proposal_id: string;
  gov_action_proposal_tx_hash: string;
  gov_action_proposal_title?: string;
  gov_action_proposal_type: string;
  gov_action_proposal_status: GovActionProposalStatus;
  gov_action_proposal_end_time: string;
  vote_submit_time: string;
}

export enum GovActionProposalStatus {
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
  RATIFIED = "RATIFIED",
  ENACTED = "ENACTED",
  DROPPED = "DROPPED",
}

export enum GovActionStatus {
  PENDING = "PENDING",
  VOTED = "VOTED",
  UNVOTED = "UNVOTED",
}

export interface GovernanceActionTableI {
  id: string;
  tx_hash: string;
  title: string;
  type: string;
  metadata_url: string;
  status: GovActionProposalStatus;
  has_reasoning: false;
  vote_status: GovActionStatus;
  submit_time: string;
  end_time?: string;
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  item_count: number;
  page_count: number;
  has_previous_page: boolean;
  has_next_page: boolean;
}

export interface ResponseErrorI {
  error?: string;
  statusCode?: number;
}

export interface FetchUsersAdminI {
  data?: FetchUserData[];
  meta?: PaginationMeta;
}

export interface GetGovernanceActionsI extends ResponseErrorI {
  data?: GovernanceActionTableI[];
  meta?: PaginationMeta;
}

export interface GetReasoningResponseI {
  title: string;
  content: string;
}

export interface AddReasoningRequestI extends GetReasoningResponseI {
  proposalId: string;
}

export interface ReasoningContentsI {
  content: string;
  govActionProposalTxHash: string;
  title: string;
}

export interface ReasoningResponseI {
  cid: string;
  url: string;
  blake2b: string;
  contents: string;
}
