import type { Skill } from "@/types/skill";

export const skills: Skill[] = [
    {
        id: "1",

        name: "Next.js",

        category: "Frontend",

        level: 95,

        featured: true,

        published: true,

        order: 1,
    },

    {
        id: "2",

        name: "React",

        category: "Frontend",

        level: 90,

        featured: true,

        published: true,

        order: 2,
    },

    {
        id: "3",

        name: "Python",

        category: "AI",

        level: 85,

        featured: true,

        published: true,

        order: 3,
    },
    {
        id: "4",

        name: "Python",

        category: "Backend",

        level: 80,

        featured: false,

        published: true,

        order: 4,
    },
];
