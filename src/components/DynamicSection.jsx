import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function DynamicSection({ section }) {
    const sectionRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(contentRef.current, {
                y: 60,
                opacity: 0,
                duration: 1.2,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                }
            });
        });
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-24 px-6 md:px-12 bg-white overflow-hidden">
            <div ref={contentRef} className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-start">
                    <div className="w-full md:w-1/3">
                        <h2 className="text-4xl md:text-5xl font-medium tracking-tighter uppercase leading-[0.9] text-black/80 font-montserrat sticky top-32">
                            {section.title}
                        </h2>
                    </div>
                    <div className="w-full md:w-2/3 space-y-8">
                        <p className="text-xl md:text-2xl text-gray-500 font-outfit leading-relaxed">
                            {section.desc}
                        </p>

                        {section.items && section.items.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 pt-12 border-t border-black/5">
                                {section.items.map((item, i) => (
                                    <div key={i} className="flex gap-4 items-start border-b border-black/5 pb-6">
                                        <span className="text-[10px] font-bold text-black bg-black/5 w-6 h-6 rounded flex items-center justify-center shrink-0">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        <p className="text-sm text-gray-700 font-medium leading-relaxed font-outfit">
                                            {item}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
