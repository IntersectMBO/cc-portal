import { MDXRemoteSerializeResult } from "next-mdx-remote";
import {
  AddReasoningResponseI,
  FetchUserData,
  GovActionProposalStatus,
  UserRole,
} from "@/lib/requests";
import { Vote } from "../atoms";

export interface ConstitutionMetadata {
  cid: string;
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
  description: string;
}

export interface CompareConstitutionModalState {
  base: ConstitutionMetadata;
  target: ConstitutionMetadata;
}

export interface SignOutModalState {
  homeRedirectionPath: string;
}

export interface GovActionModalState {
  id: string;
}

export interface OpenAddReasoningModalState {
  id: string;
  callback: (response: AddReasoningResponseI) => void;
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
  id: string;
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
