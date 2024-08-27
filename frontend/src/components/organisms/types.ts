import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { UserStatus } from "@/components/atoms";

export interface ConstitutionProps {
  constitution: MDXRemoteSerializeResult;
}

export interface HeroProps {
  children: React.ReactElement;
}

export type UserRole = "admin" | "user" | null;

export interface HeroActionsProps {
  role: UserRole;
}

export interface UsersListProps {
  name: string;
  email: string;
  roles: string[];
  status: UserStatus;
}
