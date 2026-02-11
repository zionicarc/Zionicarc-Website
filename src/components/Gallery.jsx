import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useSite } from "../context/SiteContext";

export default function Gallery() {
    const { settings } = useSite();
    const data = settings.gallery;
    const galleryRef = useRef(null);
    const itemsRef = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    gsap.fromTo(itemsRef.current,
                        { y: 50, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }
                    );
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        if (galleryRef.current) {
            observer.observe(galleryRef.current);
        }

        return () => observer.disconnect();
    }, [data.images]);

    if (!data || !data.images || data.images.length === 0) return null;

    return (
        <section id="gallery" className="py-24 bg-zinc-50 text-black">
            <div className="max-w-7xl mx-auto px-6" ref={galleryRef}>

                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
                    <div className="space-y-4">
                        <h2 className="text-3xl md:text-5xl font-outfit font-light tracking-tighter text-black leading-[0.9]">
                            {data.title}
                        </h2>
                        <div className="h-1 w-20 bg-[#808000]" />
                    </div>
                    <p className="text-gray-500 font-light max-w-md text-sm md:text-base leading-relaxed">
                        {data.description}
                    </p>
                </div>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    {data.images.map((img, index) => (
                        <div
                            key={index}
                            className="break-inside-avoid relative group overflow-hidden rounded-xl bg-gray-200"
                            ref={el => itemsRef.current[index] = el}
                        >
                            <img
                                src={img}
                                alt={`Gallery items ${index + 1}`}
                                className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
