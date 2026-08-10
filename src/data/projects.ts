import type { Project } from "@/types/project";

export const projects: Project[] = [
    {
        id: "1",

        title: "AI Medical Diagnosis System",

        slug: "ai-medical-diagnosis",

        thumbnail: "/images/projects/medical-ai.png",

        shortDescription: "Deep learning based medical image analysis system.",

        description:
            "An AI-powered system developed for automated disease detection using deep learning models.",

        category: "AI",

        technologies: ["Python", "TensorFlow", "Next.js"],

        role: "AI / Software Developer",

        status: "Project Development",

        problem:
            "Medical image analysis can require significant time, expertise and careful interpretation. The project explores how deep learning can assist the analysis process by identifying useful patterns from medical images.",

        solution:
            "The system combines a deep learning workflow with a web-based interface to process medical image inputs and present model-generated analysis in a more accessible digital experience.",

        features: [
            {
                id: "ai-feature-1",

                title: "Medical Image Analysis",

                description:
                    "Processes medical image inputs through a deep learning based analysis workflow.",
            },

            {
                id: "ai-feature-2",

                title: "Deep Learning Integration",

                description:
                    "Uses TensorFlow-based deep learning models as the core intelligence layer of the system.",
            },

            {
                id: "ai-feature-3",

                title: "Prediction Workflow",

                description:
                    "Provides a structured workflow for submitting image data and receiving model-generated analysis.",
            },

            {
                id: "ai-feature-4",

                title: "Web-Based Interface",

                description:
                    "Uses a modern web interface to make the AI analysis workflow easier to access and understand.",
            },
        ],

        challenges: [
            {
                id: "ai-challenge-1",

                title: "Medical Data Quality",

                description:
                    "Deep learning performance can be strongly affected by the quality, consistency and preparation of medical image data.",

                solution:
                    "The project considers structured preprocessing and consistent input handling as important parts of the model workflow.",
            },

            {
                id: "ai-challenge-2",

                title: "Connecting AI with the Web Application",

                description:
                    "Integrating a machine learning workflow with a user-facing web application requires communication between different technologies and application layers.",

                solution:
                    "The system architecture separates the AI processing workflow from the frontend experience so each part can be developed and maintained more clearly.",
            },

            {
                id: "ai-challenge-3",

                title: "Presenting AI Results Clearly",

                description:
                    "Raw model output can be difficult for users to understand without a clear presentation layer.",

                solution:
                    "The interface is designed to organize prediction output into a more readable and structured format.",
            },
        ],

        gallery: [],

        featured: true,

        published: true,

        order: 1,
    },

    {
        id: "2",

        title: "Smart Portfolio CMS",

        slug: "portfolio-cms",

        thumbnail: "/images/projects/cms.png",

        shortDescription: "Dynamic portfolio platform with an admin dashboard.",

        description:
            "A full-stack portfolio management system designed to manage projects, research, skills, experience, blog content and other personal portfolio information through a centralized content management system.",

        category: "Web",

        technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],

        role: "Full Stack Developer",

        status: "In Development",

        problem:
            "Traditional portfolio websites often require direct code changes whenever projects, research, experience, blog posts or other content needs to be updated.",

        solution:
            "Smart Portfolio CMS is designed as a dynamic personal portfolio platform where public website content can be managed through a centralized admin portal and stored in a structured backend.",

        features: [
            {
                id: "cms-feature-1",

                title: "Dynamic Portfolio Content",

                description:
                    "Projects, research, skills, experience and other portfolio content are structured so they can be managed dynamically instead of being permanently hardcoded into the interface.",
            },

            {
                id: "cms-feature-2",

                title: "Admin Dashboard",

                description:
                    "A dedicated admin environment is designed to provide centralized control over portfolio content.",
            },

            {
                id: "cms-feature-3",

                title: "Project Case Studies",

                description:
                    "Supports detailed project information including descriptions, technologies, features, challenges, galleries and external links.",
            },

            {
                id: "cms-feature-4",

                title: "Research Management",

                description:
                    "Provides a structured way to present and eventually manage research projects, publication information and related resources.",
            },

            {
                id: "cms-feature-5",

                title: "Blog Management",

                description:
                    "Designed to support publishing and managing articles through a dedicated blog system.",
            },

            {
                id: "cms-feature-6",

                title: "Media Management",

                description:
                    "Project images, research visuals, blog thumbnails and other media are designed to be managed through centralized storage.",
            },

            {
                id: "cms-feature-7",

                title: "Responsive Experience",

                description:
                    "The public portfolio interface is designed for desktop, tablet and mobile devices.",
            },

            {
                id: "cms-feature-8",

                title: "Animated User Interface",

                description:
                    "Uses motion, glassmorphism and interactive transitions to create a polished personal-brand experience.",
            },
        ],

        challenges: [
            {
                id: "cms-challenge-1",

                title: "Separating Public and Admin Experiences",

                description:
                    "The public portfolio and administrative dashboard require different layouts, navigation systems and access patterns.",

                solution:
                    "The application uses separate website and admin layout structures so both environments can evolve independently.",
            },

            {
                id: "cms-challenge-2",

                title: "Designing Reusable Content Structures",

                description:
                    "Projects, research, blogs, experience and other sections contain different types of information while still needing a consistent application architecture.",

                solution:
                    "Reusable TypeScript types, structured data models and modular components are used to keep the system organized and easier to extend.",
            },

            {
                id: "cms-challenge-3",

                title: "Preparing for Dynamic Content",

                description:
                    "The frontend needs to work with local development data now while remaining ready for database-driven content later.",

                solution:
                    "The interface is being developed against typed data structures first so the data source can later move to Supabase without rebuilding the visual system.",
            },

            {
                id: "cms-challenge-4",

                title: "Managing Optional Content",

                description:
                    "Not every project, certification, research item or portfolio entry contains the same amount of information.",

                solution:
                    "Components are designed to conditionally display sections only when the relevant content exists.",
            },

            {
                id: "cms-challenge-5",

                title: "Maintaining Design Consistency",

                description:
                    "A multi-page portfolio can quickly become visually inconsistent as more pages and content types are introduced.",

                solution:
                    "Shared layouts, reusable components, consistent spacing and a common animation language are used throughout the website.",
            },
        ],

        gallery: [],

        featured: true,

        published: true,

        order: 2,
    },
];
