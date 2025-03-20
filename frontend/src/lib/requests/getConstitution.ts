import { serialize } from "next-mdx-remote/serialize";
import rehypeSlug from "rehype-slug";
import rehypeToc from "rehype-toc";
import remarkToc from "remark-toc";
import axiosInstance from "../axiosInstance";
export async function getConstitution(): Promise<any> {
  try {
    const response: any = await axiosInstance.get("/api/constitution/current");

    if (!response || !response.contents) {
      console.error("Invalid response format");
      return undefined;
    }

    const mdxContent = response.contents;

    const mdxSource = await serialize(mdxContent, {
      mdxOptions: {
        remarkPlugins: [remarkToc],
        rehypePlugins: [rehypeSlug, [rehypeToc, { headings: ["h2", "h3"] }]],
      },
    });
    return mdxSource;
  } catch (error) {
    return {
      error: "Error fetching and processing MDX content:",
      statusCode: error.res?.statusCode || null,
    };
  }
}
