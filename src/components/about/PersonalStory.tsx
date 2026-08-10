"use client";

import { motion } from "framer-motion";

import { Compass, Quote, Sparkles } from "lucide-react";

import { about } from "@/data";

export default function PersonalStory() {
    return (
        <section
            className="
                relative
                overflow-hidden
                px-6
                py-24
            ">
            <div
                className="
                    mx-auto
                    grid
                    max-w-7xl
                    gap-12
                    lg:grid-cols-[1.25fr_0.75fr]
                ">
                {/* Story */}

                <motion.div
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
                        amount: 0.2,
                    }}
                    transition={{
                        duration: 0.6,
                    }}>
                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            text-cyan-400
                        ">
                        <Compass size={19} />

                        <span
                            className="
                                text-sm
                                uppercase
                                tracking-[0.3em]
                            ">
                            My Story
                        </span>
                    </div>

                    <h2
                        className="
                            mt-5
                            text-4xl
                            font-bold
                            md:text-5xl
                        ">
                        More than writing{" "}
                        <span className="gradient-text">code</span>
                    </h2>

                    <div
                        className="
                            mt-8
                            space-y-6
                        ">
                        {about.story.paragraphs.map((paragraph, index) => (
                            <motion.p
                                key={index}
                                initial={{
                                    opacity: 0,
                                    y: 20,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                viewport={{
                                    once: true,
                                }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.08,
                                }}
                                className="
                                        max-w-3xl
                                        text-lg
                                        leading-8
                                        text-gray-400
                                    ">
                                {paragraph}
                            </motion.p>
                        ))}
                    </div>
                </motion.div>

                {/* Right Card */}

                <motion.aside
                    initial={{
                        opacity: 0,
                        x: 30,
                    }}
                    whileInView={{
                        opacity: 1,
                        x: 0,
                    }}
                    viewport={{
                        once: true,
                    }}
                    transition={{
                        duration: 0.6,
                    }}
                    className="
                        h-fit
                        rounded-3xl
                        border
                        border-white/10
                        p-7
                        glass
                        lg:sticky
                        lg:top-32
                    ">
                    {about.story.quote && (
                        <>
                            <Quote size={28} className="text-cyan-400" />

                            <p
                                className="
                                    mt-5
                                    text-xl
                                    font-medium
                                    leading-8
                                    text-gray-200
                                ">
                                {about.story.quote}
                            </p>
                        </>
                    )}

                    <div
                        className="
                            my-7
                            h-px
                            bg-white/10
                        "
                    />

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            text-sm
                            uppercase
                            tracking-widest
                            text-gray-500
                        ">
                        <Sparkles size={16} />
                        What drives me
                    </div>

                    <div
                        className="
                            mt-5
                            space-y-4
                        ">
                        {about.currentFocus.slice(0, 3).map((item) => (
                            <div
                                key={item.id}
                                className="
                                        flex
                                        items-start
                                        gap-3
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

                                <p className="text-gray-400">{item.title}</p>
                            </div>
                        ))}
                    </div>
                </motion.aside>
            </div>
        </section>
    );
}
