import {
    BookOpenText,
    BriefcaseBusiness,
    FolderKanban,
    FlaskConical,
    Images,
    LayoutDashboard,
    MessageSquareText,
    Settings,
    Share2,
    UserRound,
    Wrench,
} from "lucide-react";

export const adminNavigationGroups = [
    {
        label: "Overview",

        items: [
            {
                label: "Dashboard",

                href: "/admin",

                icon: LayoutDashboard,

                description: "Admin overview and system status.",

                available: true,
            },
        ],
    },

    {
        label: "Content Management",

        items: [
            {
                label: "Profile",

                href: "/admin/profile",

                icon: UserRound,

                description: "Manage profile and personal information.",

                available: true,
            },

            {
                label: "Projects",

                href: "/admin/projects",

                icon: FolderKanban,

                description: "Create and manage portfolio projects.",

                available: true,
            },

            {
                label: "Research",

                href: "/admin/research",

                icon: FlaskConical,

                description: "Manage research work and publications.",

                available: true,
            },

            {
                label: "Experience",

                href: "/admin/experience",

                icon: BriefcaseBusiness,

                description: "Manage professional and academic experience.",

                available: true,
            },

            {
                label: "Skills",

                href: "/admin/skills",

                icon: Wrench,

                description: "Create and organize portfolio skills.",

                available: true,
            },

            {
                label: "Blog",

                href: "/admin/blogs",

                icon: BookOpenText,

                description: "Write, edit and publish blog articles.",

                available: true,
            },
        ],
    },

    {
        label: "Communication",

        items: [
            {
                label: "Messages",

                href: "/admin/messages",

                icon: MessageSquareText,

                description: "Review messages submitted through the website.",

                available: true,
            },
        ],
    },

    {
        label: "Website",

        items: [
            {
                label: "Social Links",

                href: "/admin/social",

                icon: Share2,

                description: "Manage social and external profile links.",

                available: true,
            },

            {
                label: "Media Library",

                href: "/admin/media",

                icon: Images,

                description: "Manage uploaded portfolio media.",

                available: true,
            },

            {
                label: "Settings",

                href: "/admin/settings",

                icon: Settings,

                description: "Manage general website configuration.",

                available: false,
            },
        ],
    },
];
