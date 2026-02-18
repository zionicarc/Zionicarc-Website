import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Award, Users, Settings, Box, CheckCircle } from "lucide-react";
import { ANIMATION_FLAGS } from "../utils/animationFlags";
import { useSite } from "../context/SiteContext";

gsap.registerPlugin(ScrollTrigger);

const IconMap = {
    Award,
    Users,
    Settings,
    Box,
    CheckCircle
};

export default function WhyChooseUs() {
    const { settings } = useSite();
    const data = settings.whyChooseUs;
    const sectionRef = useRef(null);
    const itemsRef = useRef([]);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        const hasPlayed = localStorage.getItem(ANIMATION_FLAGS.WHY_CHOOSE_US);

        if (prefersReducedMotion || hasPlayed) {
            gsap.set(itemsRef.current, { opacity: 1, y: 0 });
            return;
        }

        const anim = gsap.fromTo(
            itemsRef.current,
            { opacity: 0, y: 60 },
            {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "power4.out",
                stagger: 0.25,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 70%"
                },
                onComplete: () => {
                    localStorage.setItem(ANIMATION_FLAGS.WHY_CHOOSE_US, "true");
                }
            }
        );

        return () => {
            if (anim.scrollTrigger) anim.scrollTrigger.kill();
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            id="why-choose-us"
            className="py-28 bg-[#f8f8f8]"
        >
            <div className="max-w-7xl mx-auto px-6 md:px-8">

                {/* Header */}
                <div className="mb-20 max-w-2xl">
                    <h2 className="text-3xl md:text-4xl font-outfit font-light tracking-tighter text-black leading-[0.9]">
                        {data.title}
                    </h2>
                    <p className="mt-6 text-lg text-gray-700 font-normal">
                        {data.description}
                    </p>
                </div>

                {/* Horizontal Timeline */}
                <div className="relative">

                    {/* Desktop Timeline Line */}
                    <div className="hidden md:block absolute top-10 left-0 right-0 h-[1px] bg-black/10" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
                        {data.items.map((item, index) => {
                            const Icon = IconMap[item.icon] || Box;
                            return (
                                <div
                                    key={index}
                                    ref={(el) => (itemsRef.current[index] = el)}
                                    className="relative"
                                >
                                    {/* Marker */}
                                    <div className="mb-8 flex items-center gap-6 md:flex-col md:items-start">
                                        <div className="w-16 h-16 flex items-center justify-center rounded-full border border-black/20 bg-white">
                                            <Icon size={28} strokeWidth={1.5} />
                                        </div>

                                        {/* Mobile Divider */}
                                        <div className="md:hidden flex-1 h-[1px] bg-black/10" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-2xl font-normal text-black mb-4">
                                        <strong>{item.title}</strong>
                                    </h3>
                                    <p className="text-gray-700 font-normal leading-relaxed max-w-sm">
                                        {item.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}