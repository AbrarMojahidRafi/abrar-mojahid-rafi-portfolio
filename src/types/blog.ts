export interface BlogSection {
    id: string;

    heading: string;

    paragraphs: string[];

    bullets?: string[];
}

export interface Blog {
    id: string;

    title: string;

    slug: string;

    thumbnail: string;

    excerpt: string;

    /*
     * Article Content
     */

    content?: string;

    sections?: BlogSection[];

    /*
     * Classification
     */

    category: string;

    tags?: string[];

    /*
     * Publishing Information
     */

    featured: boolean;

    published: boolean;

    createdAt: string;

    updatedAt?: string;
}
