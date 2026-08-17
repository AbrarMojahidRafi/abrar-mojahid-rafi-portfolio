import { getFeaturedBlogs } from "@/lib/queries/blogs";
import LatestBlogContent from "@/components/sections/LatestBlogContent";

export default async function LatestBlog() {
    const latestBlogs = await getFeaturedBlogs(3);

    if (latestBlogs.length === 0) {
        return null;
    }

    return <LatestBlogContent blogs={latestBlogs} />;
}
