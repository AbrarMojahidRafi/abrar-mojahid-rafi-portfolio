import type { Blog } from "@/types/blog";

export const blogs: Blog[] = [
    {
        id: "1",

        title: "Building AI Powered Applications with Next.js",

        slug: "ai-powered-applications-nextjs",

        thumbnail: "/images/blog/ai-nextjs.png",

        excerpt:
            "Exploring how modern AI applications can be built with Next.js.",

        category: "AI Development",

        tags: ["Next.js", "Artificial Intelligence", "Web Development"],

        sections: [
            {
                id: "ai-nextjs-introduction",

                heading: "Why AI and Modern Web Development Work Well Together",

                paragraphs: [
                    "Modern AI applications often need more than an intelligent model. They also need a clear interface, reliable application logic and an experience that makes complex functionality easy to use.",

                    "Next.js provides a practical foundation for building that application layer. It allows the frontend experience and server-side application logic to exist within a structured web development environment.",
                ],
            },

            {
                id: "ai-nextjs-architecture",

                heading: "Thinking About the Application Architecture",

                paragraphs: [
                    "A useful way to approach an AI-powered application is to separate the user experience from the intelligence layer. The interface can focus on collecting input and presenting results while the AI workflow handles processing and prediction.",

                    "Keeping these responsibilities clear makes the application easier to understand, maintain and expand as the project grows.",
                ],

                bullets: [
                    "Design a clear user-facing interface.",
                    "Keep AI processing separate from presentation logic.",
                    "Use structured data between application layers.",
                    "Present model-generated output in a readable way.",
                ],
            },

            {
                id: "ai-nextjs-user-experience",

                heading: "The Importance of the User Experience",

                paragraphs: [
                    "An AI feature becomes useful only when people can understand how to interact with it. Good interface design should make the workflow clear, communicate loading and processing states and present results without unnecessary complexity.",

                    "For that reason, building AI applications is not only a model-development problem. It is also a product and user-experience problem.",
                ],
            },

            {
                id: "ai-nextjs-conclusion",

                heading: "Final Thoughts",

                paragraphs: [
                    "Combining modern web development with artificial intelligence creates opportunities to turn experimental models into usable digital products.",

                    "The strongest applications are usually built by treating the AI model, application architecture and user experience as connected parts of the same system.",
                ],
            },
        ],

        featured: true,

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

        tags: ["Research", "Technology", "Learning"],

        sections: [
            {
                id: "research-journey-curiosity",

                heading: "Starting with Curiosity",

                paragraphs: [
                    "My interest in technology has increasingly become connected with curiosity about how systems work, why particular approaches succeed and how ideas can be transformed into useful solutions.",

                    "That curiosity has encouraged me to look beyond simply building applications and to think more deeply about the problems behind them.",
                ],
            },

            {
                id: "research-journey-development",

                heading: "Connecting Development and Research",

                paragraphs: [
                    "Web development, artificial intelligence and research-driven problem solving may appear to be separate areas, but I increasingly see them as connected parts of the same learning process.",

                    "Development provides a way to build and test ideas while research encourages structured thinking, evidence-based exploration and a deeper understanding of the problem being addressed.",
                ],
            },

            {
                id: "research-journey-learning",

                heading: "Continuous Learning",

                paragraphs: [
                    "Technology changes continuously, so learning cannot be treated as a one-time stage. Experimenting with new tools, studying different approaches and reflecting on previous work are important parts of improving as both a developer and a researcher.",

                    "The goal is not simply to learn more technologies. It is to develop better ways of thinking about problems and building solutions that are clear, useful and meaningful.",
                ],
            },

            {
                id: "research-journey-future",

                heading: "Looking Forward",

                paragraphs: [
                    "I want to continue exploring the intersection of software development, artificial intelligence and research while building projects that turn ideas into practical experiences.",

                    "For me, the journey is still developing and continuous learning remains one of the most important parts of that process.",
                ],
            },
        ],

        featured: true,

        published: true,

        createdAt: "2026-02-01",
    },
];
