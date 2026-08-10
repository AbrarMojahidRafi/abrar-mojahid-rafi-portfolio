"use client";

import { motion } from "framer-motion";

import {
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    ExternalLink,
    MapPin,
} from "lucide-react";

import type { Experience } from "@/types/experience";

type ExperienceCardProps = {
    item: Experience;
    index?: number;
};

export default function ExperienceCard({
    item,
    index = 0,
}: ExperienceCardProps) {
    return (
        <motion.article
            initial={{
                opacity: 0,
                y: 35,
            }}
            whileInView={{
                opacity: 1,
                y: 0,
            }}
            viewport={{
                once: true,
                amount: 0.15,
            }}
            transition={{
                duration: 0.5,
                delay: index * 0.08,
            }}
            whileHover={{
                y: -6,
            }}
            className="
                group
                rounded-3xl
                border
                border-white/10
                p-7
                transition-colors
                hover:border-cyan-400/30
                glass
                md:p-8
            ">
            {/* Date */}

            <div
                className="
                    flex
                    flex-wrap
                    items-center
                    justify-between
                    gap-4
                ">
                <div
                    className="
                        flex
                        items-center
                        gap-2
                        text-sm
                        text-cyan-400
                    ">
                    <CalendarDays size={16} />

                    <span>
                        {item.startDate}

                        {item.endDate ? ` — ${item.endDate}` : ""}
                    </span>
                </div>

                {item.employmentType && (
                    <span
                        className="
                            rounded-full
                            border
                            border-white/10
                            bg-white/5
                            px-3
                            py-1
                            text-xs
                            text-gray-300
                        ">
                        {item.employmentType}
                    </span>
                )}
            </div>

            {/* Role */}

            <div
                className="
                    mt-6
                    flex
                    items-start
                    gap-4
                ">
                <div
                    className="
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-2xl
                        bg-cyan-400/10
                        text-cyan-400
                        transition
                        group-hover:bg-cyan-400/15
                    ">
                    <BriefcaseBusiness size={22} />
                </div>

                <div>
                    <h3
                        className="
                            text-2xl
                            font-semibold
                            leading-tight
                            transition-colors
                            group-hover:text-cyan-300
                        ">
                        {item.role}
                    </h3>

                    <div
                        className="
                            mt-2
                            flex
                            flex-wrap
                            items-center
                            gap-x-4
                            gap-y-2
                            text-sm
                            text-gray-400
                        ">
                        <span
                            className="
                                inline-flex
                                items-center
                                gap-2
                            ">
                            <Building2 size={15} />

                            {item.company}
                        </span>

                        {item.location && (
                            <span
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                ">
                                <MapPin size={15} />

                                {item.location}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Description */}

            <p
                className="
                    mt-6
                    leading-8
                    text-gray-400
                ">
                {item.description}
            </p>

            {/* Highlights */}

            {item.highlights?.length ? (
                <div
                    className="
                        mt-6
                        space-y-3
                    ">
                    {item.highlights.map((highlight) => (
                        <div
                            key={highlight}
                            className="
                                    flex
                                    gap-3
                                    text-sm
                                    leading-6
                                    text-gray-300
                                ">
                            <span
                                className="
                                        mt-2
                                        h-1.5
                                        w-1.5
                                        shrink-0
                                        rounded-full
                                        bg-cyan-400
                                    "
                            />

                            <span>{highlight}</span>
                        </div>
                    ))}
                </div>
            ) : null}

            {/* Skills */}

            {item.skills?.length ? (
                <div
                    className="
                        mt-7
                        flex
                        flex-wrap
                        gap-2
                    ">
                    {item.skills.map((skill) => (
                        <span
                            key={skill}
                            className="
                                rounded-full
                                border
                                border-white/10
                                bg-white/5
                                px-3
                                py-1
                                text-sm
                                text-gray-300
                            ">
                            {skill}
                        </span>
                    ))}
                </div>
            ) : null}

            {/* Company URL */}

            {item.companyUrl && (
                <div
                    className="
                        mt-7
                        border-t
                        border-white/10
                        pt-6
                    ">
                    <a
                        href={item.companyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            text-sm
                            font-medium
                            text-cyan-400
                            transition
                            hover:text-white
                        ">
                        Visit organization
                        <ExternalLink size={16} />
                    </a>
                </div>
            )}
        </motion.article>
    );
}
