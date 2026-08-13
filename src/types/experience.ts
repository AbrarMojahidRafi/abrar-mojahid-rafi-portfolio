export interface Experience {
    id: string;

    role: string;

    company: string;

    startDate: string;

    endDate?: string;

    description: string;

    location?: string;

    employmentType?: string;

    skills?: string[];

    highlights?: string[];

    logo?: string;

    companyUrl?: string;

    featured: boolean;

    published: boolean;

    order: number;

    createdAt?: string;

    updatedAt?: string;
}
