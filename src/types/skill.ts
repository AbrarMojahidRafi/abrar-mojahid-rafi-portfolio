export interface Skill {
    id: string;

    name: string;

    category: string;

    icon?: string;

    level: number;

    /*
     * Visibility Controls
     */

    featured: boolean;

    published: boolean;

    /*
     * Display Order
     */

    order: number;

    /*
     * Optional CMS Fields
     */

    createdAt?: string;

    updatedAt?: string;
}
