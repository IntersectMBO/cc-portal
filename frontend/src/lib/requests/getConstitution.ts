import { serialize } from "next-mdx-remote/serialize";
import remarkToc from "remark-toc";
import rehypeToc from "rehype-toc";
import rehypeSlug from "rehype-slug";
import axiosInstance from "../axiosInstance";

export async function getConstitution(): Promise<any> {
  try {
    const response: any = await axiosInstance.get("/api/constitution/current");

    if (!response || !response.contents) {
      console.error("Invalid response format");
      return undefined;
    }

    const mdxContent = response.contents;

    const options = {
      mdxOptions: {
        remarkPlugins: [remarkToc],
        rehypePlugins: [rehypeSlug, rehypeToc],
      },
    };

    const mdxSource = await serialize(mdxContent, options);

    return mdxSource;
  } catch (error) {
    return {
      error: "Error fetching and processing MDX content:",
      statusCode: error.res?.statusCode || null,
    };
  }
}
