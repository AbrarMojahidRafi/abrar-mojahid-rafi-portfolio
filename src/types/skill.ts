export interface Skill {
    id: string;

    name: string;

    category: string;

    icon?: string;

    level: number;

    featured: boolean;

    published: boolean;

    order: number;

    createdAt?: string;

    updatedAt?: string;
}
