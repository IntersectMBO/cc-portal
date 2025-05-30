import {
  FetchUserData,
  GovActionProposalStatus,
  GovernanceActionTableI,
  ReasoningResponseI,
  UserAuthStatus,
  UserRole
} from "@/lib/requests";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { UserStatus, Vote } from "../atoms";

export interface ConstitutionMetadata {
  cid: string;
  url: string;
  blake2b: string;
  title: string;
  version: string;
  created_date: string;
}

export interface ConstitutionByCid {
  cid: string;
  version: string;
  contents: string;
}

export interface ConstitutionProps {
  constitution: MDXRemoteSerializeResult;
  metadata: ConstitutionMetadata[];
}

export interface HeroProps {
  children: React.ReactElement;
}

export interface HeroActionsProps {
  role?: UserRole;
}

export interface UserListItem extends FetchUserData {}

export interface SignupModalState {
  showCloseButton?: boolean;
  title: string;
  description?: string;
}

export type TargetConstitutionState = Pick<
  ConstitutionMetadata,
  "title" | "created_date" | "cid"
>;

export interface CompareConstitutionState {
  base: ConstitutionMetadata;
  target: TargetConstitutionState;
}

export interface SignOutModalState {
  homeRedirectionPath: string;
}

export interface GovActionModalState {
  id: string;
}

export interface OpenAddReasoningModalState {
  id: string;
  callback: (response: ReasoningResponseI) => void;
}

export interface OpenDeleteRoleModalState {
  userId: string;
  status: UserAuthStatus;
}

export interface OpenDeleteUserModalState {
  sAdminId: string;
  userId: string;
}

export interface OpenSwitchStatusModalState {
  newStatus: Omit<UserStatus, "pending">;
  userId: string;
}
export interface OpenReasoningLinkModalState {
  hash: string;
  link: string;
}

export interface GovActionMetadata {
  id: string;
  tx_hash: string;
  title: string;
  abstract: string;
  metadata_url: string;
  status: GovActionProposalStatus;
  type: string;
  submit_time: string;
  end_time?: string;
}

export interface OpenPreviewReasoningModal {
  govAction: Partial<GovernanceActionTableI> & {
    vote?: Vote;
    vote_submit_time?: string;
    reasoning_title?: string;
    rationale_url?: string;
  };
  onActionClick?: (id: string) => void;
  actionTitle?: string;
}

export interface PreviewReasoningModalState extends ReasoningI {
  gov_action_proposal_id: string;
  gov_action_proposal_title: string;
  gov_action_proposal_type: string;
  abstract: string;
  vote: Vote;
  submission_date: string;
  expiry_date: string;
}

export interface ReasoningI {
  title: string;
  description: string;
  link?: string;
  hash?: string;
}

export interface TabI {
  value: string;
  title: string;
}
