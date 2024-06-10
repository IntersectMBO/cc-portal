import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import remarkToc from "remark-toc";
import rehypeToc from "rehype-toc";
import rehypeSlug from "rehype-slug";

export async function getConstitution(
  fileName: string = process.env.NEXT_PUBLIC_CONSTITUTION_FILE_NAME
): Promise<MDXRemoteSerializeResult | undefined> {
  const apiUrl = `${process.env.NEXT_PUBLIC_CONSTITUTION_URL}/${fileName}`;

  const res = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_CONSTITUTION_TOKEN}`,
    },
  });

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
