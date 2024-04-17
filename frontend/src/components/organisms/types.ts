import { CompileMDXResult } from "next-mdx-remote/rsc";
import { UserStatus } from "@atoms";
import { FetchUserData, Permissions, UserRole } from "@/lib/requests";

export interface ConstitutionProps {
  constitution: CompileMDXResult;
}

export interface PaginationButtonProps {
  handleClick: () => void;
  disabled: boolean;
  type: "prev" | "next";
}

export interface ConstitutionPageProps {
  content: string[];
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
