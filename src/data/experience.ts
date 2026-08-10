import type { Experience } from "@/types/experience";

export const experience: Experience[] = [
    {
        id: "1",

        role: "AI Developer",

        company: "Personal Research & Development",

        startDate: "2025",

        endDate: "Present",

        description:
            "Building AI solutions, web applications and exploring research-driven technologies.",

        featured: true,

        published: true,

        order: 1,
    },

    {
        id: "2",

        role: "Full Stack Developer",

        company: "Independent Projects",

        startDate: "2024",

        description:
            "Developing modern web applications using React, Next.js and TypeScript.",

        skills: ["React", "Next.js", "TypeScript"],

        featured: true,

        published: true,

        order: 2,
    },

    {
        id: "3",

        role: "Technical Learning & Academic Projects",

        company: "Academic & Independent Work",

        startDate: "2022",

        endDate: "Present",

        description:
            "Working on academic and self-directed technology projects while strengthening foundations in computer science, software development and emerging technologies.",

        featured: false,

        published: true,

        order: 3,
    },
];
