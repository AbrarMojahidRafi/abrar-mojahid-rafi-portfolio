export type IdentityItem = {
    id: string;
    title: string;
    description: string;
    icon: string;
    order: number;
};

export type EducationItem = {
    id: string;
    degree: string;
    institution: string;
    field?: string;
    startDate: string;
    endDate?: string;
    description?: string;
    result?: string;
    order: number;
};

export type CoreValue = {
    id: string;
    title: string;
    description: string;
    icon: string;
    order: number;
};

export type Achievement = {
    id: string;
    title: string;
    description: string;
    year?: string;
    icon?: string;
    order: number;
};

export type Certification = {
    id: string;
    title: string;
    issuer: string;
    issueDate?: string;
    credentialId?: string;
    credentialUrl?: string;
    image?: string;
    order: number;
};

export type JourneyItem = {
    id: string;
    year: string;
    title: string;
    description: string;
    order: number;
};

export type FocusItem = {
    id: string;
    title: string;
    description?: string;
    icon: string;
    order: number;
};

export type AboutData = {
    hero: {
        eyebrow: string;
        title: string;
        description: string;
        status?: string;
    };

    story: {
        title: string;
        paragraphs: string[];
        quote?: string;
    };

    identity: IdentityItem[];

    education: EducationItem[];

    coreValues: CoreValue[];

    achievements: Achievement[];

    certifications: Certification[];

    journey: JourneyItem[];

    currentFocus: FocusItem[];
};
