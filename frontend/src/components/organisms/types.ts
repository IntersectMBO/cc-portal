import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { FetchUserData, UserRole } from "@/lib/requests";
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
  governance_proposal_title: string;
}

export interface ReasoningI {
  title: string;
  description: string;
  link: string;
  hash: string;
}

export interface VotesTableI {
  id: string;
  user_name: string;
  user_address: string;
  profile_photo_url?: string;
  value: Vote;
  reasoning_title: string;
  comment: string;
  governance_proposal_title: string;
  governance_proposal_type: string;
  governance_proposal_resolved: boolean;
  governance_proposal_end_time: string;
}
