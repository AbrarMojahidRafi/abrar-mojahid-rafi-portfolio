export interface Research {
    id: string;

    title: string;

    slug: string;

    field: string;

    description: string;

    image: string;

    publicationStatus: string;

    /*
     * Research Details
     */

    abstract?: string;

    problem?: string;

    objectives?: string[];

    methodology?: string;

    contributions?: string[];

    results?: string[];

    keywords?: string[];

    /*
     * Publication Information
     */

    authors?: string[];

    venue?: string;

    publicationYear?: string;

    doiUrl?: string;

    paperUrl?: string;

    /*
     * Research Resources
     */

    codeUrl?: string;

    datasetUrl?: string;

    /*
     * CMS Controls
     */

    featured: boolean;

    published: boolean;

    order: number;

    createdAt?: string;

    updatedAt?: string;
}
