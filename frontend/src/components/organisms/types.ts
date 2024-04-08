import { CompileMDXResult } from "next-mdx-remote/rsc";

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
  key: number;
}
