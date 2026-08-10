export interface Experience {
    id: string;

    role: string;

    company: string;

    startDate: string;

    endDate?: string;

    description: string;

    /*
     * Optional Experience Details
     */

    location?: string;

    employmentType?: string;

    skills?: string[];

    highlights?: string[];

    logo?: string;

    companyUrl?: string;

    /*
     * CMS Controls
     */

    featured: boolean;

    published: boolean;

    order: number;

    createdAt?: string;

    updatedAt?: string;
}
