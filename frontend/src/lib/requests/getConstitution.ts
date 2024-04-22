import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import remarkToc from "remark-toc";
import rehypeToc from "rehype-toc";
import rehypeSlug from "rehype-slug";

const GITHUB_URL =
  "https://raw.githubusercontent.com/Kristina2103/publicTestMdx/main";

export const CONSTITUTION_FILE = "constitution_example.mdx";

export async function getConstitution(
  fileName: string = CONSTITUTION_FILE
): Promise<MDXRemoteSerializeResult | undefined> {
  const apiUrl = `${GITHUB_URL}/${fileName}`;

  const res = await fetch(apiUrl);

  if (!res.ok) {
    console.error("Error fetching MDX file:", res.statusText);
    return;
  }

  const rawMDX = await res.text();

  if (rawMDX === "404: Not Found") return;

  const options = {
    mdxOptions: {
      remarkPlugins: [remarkToc],
      rehypePlugins: [rehypeSlug, rehypeToc],
    },
  };

  const mdxSource = await serialize(rawMDX, options);

  return mdxSource;
}
