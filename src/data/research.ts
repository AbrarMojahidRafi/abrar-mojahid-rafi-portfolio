import type { Research } from "@/types/research";

export const research: Research[] = [
    {
        id: "1",

        title: "Deep Learning Based Medical Image Analysis",

        slug: "deep-learning-medical-image-analysis",

        field: "Artificial Intelligence",

        description:
            "Research focused on applying deep learning techniques for automated medical image analysis and classification.",

        methodology: "CNN, Transfer Learning, Computer Vision",

        publicationStatus: "Ongoing Research",

        paperUrl: "#",

        image: "/images/research/medical-ai.png",

        featured: true,

        published: true,

        order: 1,
    },

    {
        id: "2",

        title: "AI Driven Intelligent Systems",

        slug: "ai-driven-intelligent-systems",

        field: "Machine Learning",

        description:
            "Exploring intelligent systems using modern machine learning approaches.",

        methodology: "Machine Learning, Data Analysis",

        publicationStatus: "Research Project",

        image: "/images/research/ai-system.png",

        featured: true,

        published: true,

        order: 2,
    },
];
