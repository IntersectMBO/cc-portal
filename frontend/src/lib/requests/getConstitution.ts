import { compileMDX, CompileMDXResult } from "next-mdx-remote/rsc";

const GITHUB_URL =
  "https://raw.githubusercontent.com/Kristina2103/publicTestMdx/main";

export const CONSTITUTION_FILE = "constitution_example.mdx";

export async function getConstitution(
  fileName: string = CONSTITUTION_FILE
): Promise<CompileMDXResult | undefined> {
  const apiUrl = `${GITHUB_URL}/${fileName}`;

  const res = await fetch(apiUrl);

  if (!res.ok) {
    console.error("Error fetching MDX file:", res.statusText);
    return;
  }

  const rawMDX = await res.text();

  if (rawMDX === "404: Not Found") return;

  const compiledMDX = await compileMDX<{
    title: string;
    date: string;
    tags: string[];
  }>({
    source: rawMDX,
  });

  return compiledMDX;
}
