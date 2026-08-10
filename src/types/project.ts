export interface ProjectFeature {
    id: string;
    title: string;
    description: string;
}

export interface ProjectChallenge {
    id: string;
    title: string;
    description: string;
    solution?: string;
}

export interface ProjectGalleryItem {
    id: string;
    image: string;
    alt: string;
    caption?: string;
}

export interface Project {
    id: string;

    title: string;

    slug: string;

    thumbnail: string;

    shortDescription: string;

    description: string;

    category: string;

    technologies: string[];

    /*
     * Case Study Information
     */

    role?: string;

    duration?: string;

    status?: string;

    problem?: string;

    solution?: string;

    features?: ProjectFeature[];

    challenges?: ProjectChallenge[];

    outcome?: string;

    gallery?: ProjectGalleryItem[];

    /*
     * External Links
     */

    githubUrl?: string;

    liveUrl?: string;

    /*
     * CMS Controls
     */

    featured: boolean;

    published: boolean;

    order: number;

    createdAt?: string;

    updatedAt?: string;
}
