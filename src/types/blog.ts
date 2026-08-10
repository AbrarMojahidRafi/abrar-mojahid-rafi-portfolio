export interface Blog {
    id: string;

    title: string;

    slug: string;

    thumbnail: string;

    excerpt: string;

    content?: string;

    category: string;

    published: boolean;

    createdAt: string;
}
