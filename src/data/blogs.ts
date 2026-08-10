import { Blog } from "@/types/blog";

export const blogs: Blog[] = [
    {
        id: "1",

        title: "Building AI Powered Applications with Next.js",

        slug: "ai-powered-applications-nextjs",

        thumbnail: "/images/blog/ai-nextjs.png",

        excerpt:
            "Exploring how modern AI applications can be built with Next.js.",

        category: "AI Development",

        published: true,

        createdAt: "2026-01-01",
    },

    {
        id: "2",

        title: "My Journey Into Research and Technology",

        slug: "research-journey",

        thumbnail: "/images/blog/research.png",

        excerpt: "Sharing my experience exploring technology and research.",

        category: "Research",

        published: true,

        createdAt: "2026-02-01",
    },
];
