import type { AboutData } from "@/types/about";

export const about: AboutData = {
    hero: {
        eyebrow: "About Me",

        title: "Behind the code, research and ideas.",

        description:
            "I enjoy exploring technology, research and thoughtful design to turn ideas into meaningful digital experiences.",

        status: "Open to meaningful collaborations",
    },

    story: {
        title: "My Story",

        paragraphs: [
            "I am passionate about technology, research and the process of turning ideas into useful digital experiences. I enjoy understanding how things work and then using that understanding to build something meaningful.",

            "My interests span modern web development, artificial intelligence and research-driven problem solving. For me, development is not only about writing code. It is about understanding a problem, exploring possibilities and creating a solution that is clear, practical and useful.",

            "I am continuously learning, experimenting and expanding the way I think about technology. My long-term goal is to combine development, research and thoughtful design to build products and systems that create meaningful impact.",
        ],

        quote: "Curiosity is often the beginning of meaningful work.",
    },

    identity: [
        {
            id: "1",
            title: "Developer",
            description:
                "Building modern, responsive and thoughtful digital products.",
            icon: "code",
            order: 1,
        },

        {
            id: "2",
            title: "Researcher",
            description:
                "Exploring problems through evidence, analysis and structured inquiry.",
            icon: "research",
            order: 2,
        },

        {
            id: "3",
            title: "Builder",
            description:
                "Turning ideas and experiments into usable systems and experiences.",
            icon: "build",
            order: 3,
        },

        {
            id: "4",
            title: "Continuous Learner",
            description:
                "Exploring new tools, ideas and perspectives to keep growing.",
            icon: "learn",
            order: 4,
        },
    ],

    education: [
        {
            id: "1",
            degree: "Secondary School Certificate (SSC)",
            institution: "Siraj Mia Memorial Model School",
            field: "Science",
            startDate: "2015",
            endDate: "2018",
            result: "GPA 5.00",
            order: 1,
        },

        {
            id: "2",
            degree: "Higher Secondary Certificate (HSC)",
            institution: "BAF Shaheen College Dhaka",
            field: "Science",
            startDate: "2019",
            endDate: "2020",
            result: "GPA 5.00",
            order: 2,
        },

        {
            id: "3",
            degree: "Bachelor of Science",
            institution: "BRAC University",
            field: "Computer Science & Engineering (CSE)",
            startDate: "2022",
            endDate: "2026",
            result: "CGPA 3.50",
            order: 3,
        },
    ],

    coreValues: [
        {
            id: "1",
            title: "Curiosity",
            description:
                "Questioning assumptions and exploring how things really work.",
            icon: "sparkles",
            order: 1,
        },

        {
            id: "2",
            title: "Clarity",
            description:
                "Turning complex ideas into understandable and practical solutions.",
            icon: "focus",
            order: 2,
        },

        {
            id: "3",
            title: "Impact",
            description:
                "Building things that create meaningful and practical value.",
            icon: "target",
            order: 3,
        },

        {
            id: "4",
            title: "Continuous Learning",
            description:
                "Treating every project as another opportunity to learn and grow.",
            icon: "book",
            order: 4,
        },
    ],

    /*
     * Real achievements যোগ করার পরে
     * এই section automatically visible হবে।
     */
    achievements: [],

    /*
     * Real certifications যোগ করার পরে
     * এই section automatically visible হবে।
     */
    certifications: [],

    journey: [
        {
            id: "1",
            year: "2015–2018",
            title: "Building a Strong Academic Foundation",
            description:
                "Started my academic journey in the Science stream at Siraj Mia Memorial Model School. Developed a strong foundation in Mathematics and Science while building discipline, curiosity and analytical thinking.",
            order: 1,
        },

        {
            id: "2",
            year: "2019–2020",
            title: "Strengthening Analytical Skills",
            description:
                "Continued my higher secondary education in the Science stream at BAF Shaheen College Dhaka. Achieving GPA 5.00 strengthened my confidence and encouraged me to pursue a technology-focused career.",
            order: 2,
        },

        {
            id: "3",
            year: "2022",
            title: "Entering the World of Computer Science",
            description:
                "Joined BRAC University to study Computer Science and Engineering. This marked an important transition from general science education to programming, algorithms, software development and computer science.",
            order: 3,
        },

        {
            id: "4",
            year: "2022–2026",
            title: "Growing as a Computer Science Professional",
            description:
                "Completed my undergraduate journey in CSE while developing practical knowledge in programming, software development, databases, computer systems, algorithms and research. The journey helped me grow from a student interested in technology into a more independent learner and problem solver.",
            order: 4,
        },
    ],

    currentFocus: [
        {
            id: "1",
            title: "AI-powered applications",
            description:
                "Exploring how intelligent systems can improve digital products.",
            icon: "brain",
            order: 1,
        },

        {
            id: "2",
            title: "Research-driven products",
            description:
                "Connecting structured research with practical technology.",
            icon: "research",
            order: 2,
        },

        {
            id: "3",
            title: "Modern web architecture",
            description: "Building scalable and maintainable web experiences.",
            icon: "code",
            order: 3,
        },

        {
            id: "4",
            title: "Human-centered technology",
            description:
                "Thinking about technology through usefulness and real human needs.",
            icon: "users",
            order: 4,
        },
    ],
};
