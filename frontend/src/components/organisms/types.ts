import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { FetchUserData, UserRole } from "@/lib/requests";

export interface ConstitutionProps {
  constitution: MDXRemoteSerializeResult;
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
