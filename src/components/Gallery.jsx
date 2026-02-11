import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSite } from "../context/SiteContext";

export default function Gallery() {
    const { settings } = useSite();
    const data = settings.gallery;
    const galleryRef = useRef(null);
    const itemsRef = useRef([]);
    const [selectedImg, setSelectedImg] = useState(null);

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

    // Handle ESC key to close lightbox
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setSelectedImg(null);
            if (e.key === 'ArrowRight' && selectedImg !== null) nextImg();
            if (e.key === 'ArrowLeft' && selectedImg !== null) prevImg();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImg]);

    const nextImg = () => {
        if (selectedImg === null) return;
        setSelectedImg((selectedImg + 1) % data.images.length);
    };

    const prevImg = () => {
        if (selectedImg === null) return;
        setSelectedImg((selectedImg - 1 + data.images.length) % data.images.length);
    };

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
                            className="break-inside-avoid relative group overflow-hidden rounded-xl bg-gray-200 cursor-zoom-in"
                            ref={el => itemsRef.current[index] = el}
                            onClick={() => setSelectedImg(index)}
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

            {/* Lightbox Overlay */}
            {selectedImg !== null && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 animate-fadeIn"
                    onClick={() => setSelectedImg(null)}
                >
                    <button
                        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2 z-[110]"
                        onClick={() => setSelectedImg(null)}
                    >
                        <X size={32} strokeWidth={1.5} />
                    </button>

                    <button
                        className="absolute left-4 md:left-8 text-white/50 hover:text-white transition-colors p-2 z-[110]"
                        onClick={(e) => { e.stopPropagation(); prevImg(); }}
                    >
                        <ChevronLeft size={48} strokeWidth={1} />
                    </button>

                    <div
                        className="relative max-w-5xl max-h-full flex flex-col items-center gap-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={data.images[selectedImg]}
                            alt="Selected gallery view"
                            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                        />
                        <p className="text-white/40 text-xs font-bold uppercase tracking-[0.3em]">
                            {selectedImg + 1} / {data.images.length}
                        </p>
                    </div>

                    <button
                        className="absolute right-4 md:right-8 text-white/50 hover:text-white transition-colors p-2 z-[110]"
                        onClick={(e) => { e.stopPropagation(); nextImg(); }}
                    >
                        <ChevronRight size={48} strokeWidth={1} />
                    </button>
                </div>
            )}
        </section>
    );
}
