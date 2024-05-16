import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { FetchUserData, UserRole } from "@/lib/requests";

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
}

export interface CompareConstitutionModalState {
  base: ConstitutionMetadata;
  target: ConstitutionMetadata;
}

export interface SignOutModalState {
  homeRedirectionPath: string;
}

export interface ReasoningI {
  title: string;
  description: string;
  link: string;
  hash: string;
}
