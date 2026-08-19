export interface CompetitiveProblem {
    id: string;

    title: string;

    platform: string;

    problem_link: string;

    language: string;

    code_screenshot: string;

    solution_code: string;

    explanation: string;

    solved_date: string;

    tags: string[];

    /*
     * TRUE:
     * This saved problem contributes +1 to the
     * selected platform's solved_count.
     *
     * FALSE:
     * Historical problem added only for portfolio
     * documentation. Its solve was already included
     * in the manually recorded platform total.
     */
    counted_in_total: boolean;

    created_at: string;
}
