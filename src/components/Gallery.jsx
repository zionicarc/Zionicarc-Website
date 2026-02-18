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
    }, [data.sections]);

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

    const allImages = data.sections.flatMap(s => s.images);

    const nextImg = () => {
        if (selectedImg === null) return;
        setSelectedImg((selectedImg + 1) % allImages.length);
    };

    const prevImg = () => {
        if (selectedImg === null) return;
        setSelectedImg((selectedImg - 1 + allImages.length) % allImages.length);
    };

    if (!data || !data.sections || data.sections.length === 0) return null;

    return (
        <section id="gallery" className="py-24 bg-zinc-50 text-black">
            <div className="max-w-7xl mx-auto px-6" ref={galleryRef}>

                <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-6 text-center md:text-left">
                    <div className="space-y-4 w-full md:w-auto">
                        <h2
                            className="text-3xl md:text-4xl font-outfit font-light tracking-tighter text-black leading-[0.9]"
                            style={{ opacity: 1 }}
                        >
                            {data.title}
                        </h2>
                    </div>
                    <p
                        className="max-w-md text-sm md:text-base leading-relaxed w-full md:w-auto"
                        style={{ color: '#000', opacity: 1 }}
                    >
                        {data.description}
                    </p>
                </div>

                <div className="space-y-24">
                    {data.sections.map((section, sIdx) => (
                        <div key={sIdx} className="space-y-8">
                            <div className="flex items-center gap-4">
                                <h3 className="text-xl md:text-2xl font-outfit font-bold uppercase tracking-widest text-black">
                                    {section.title}
                                </h3>
                                <div className="flex-1 h-px bg-black/10" />
                            </div>

                            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                                {(section.images || []).map((img, iIdx) => {
                                    // Calculate global index for lightbox
                                    const globalIndex = data.sections
                                        .slice(0, sIdx)
                                        .reduce((acc, s) => acc + (s.images?.length || 0), 0) + iIdx;

                                    return (
                                        <div
                                            key={iIdx}
                                            className="break-inside-avoid relative group overflow-hidden rounded-xl bg-gray-200 cursor-zoom-in"
                                            ref={el => itemsRef.current[globalIndex] = el}
                                            onClick={() => setSelectedImg(globalIndex)}
                                        >
                                            <img
                                                src={img.url}
                                                alt={img.title || `Gallery item ${globalIndex + 1}`}
                                                className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                                            {img.title && (
                                                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <p className="text-white text-[10px] font-bold uppercase tracking-widest bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-lg inline-block">
                                                        {img.title}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox Overlay */}
            {selectedImg !== null && allImages[selectedImg] && (
                <div
                    className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-between py-12 px-4 md:p-12 animate-fadeIn"
                    onClick={() => setSelectedImg(null)}
                >
                    {/* Close Button - Solid Black Rectangle for Maximum Visibility */}
                    <button
                        className="fixed top-6 right-6 text-white bg-black p-2.5 rounded-lg z-[130] shadow-xl active:scale-90 transition-transform flex items-center justify-center"
                        onClick={(e) => { e.stopPropagation(); setSelectedImg(null); }}
                        aria-label="Close Gallery"
                    >
                        <X size={20} strokeWidth={3} />
                    </button>

                    <button
                        className="fixed left-4 top-1/2 -translate-y-1/2 text-black/10 hover:text-black transition-all p-4 bg-gray-50/50 hover:bg-gray-50 rounded-full z-[110] hidden md:block"
                        onClick={(e) => { e.stopPropagation(); prevImg(); }}
                    >
                        <ChevronLeft size={48} strokeWidth={1} />
                    </button>

                    <div
                        className="w-full flex-1 flex flex-col items-center justify-center gap-8 mt-12 mb-8 md:my-0"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative group max-w-full max-h-[60vh] md:max-h-[75vh] flex items-center justify-center">
                            <img
                                src={allImages[selectedImg].url}
                                alt="Selected gallery view"
                                className="max-w-full max-h-full object-contain rounded-xl shadow-[0_30px_80px_-15px_rgba(0,0,0,0.1)] border border-black/5"
                            />
                        </div>
                        <div className="text-center space-y-1 max-w-sm px-4">
                            {allImages[selectedImg].title && (
                                <h3 className="text-black text-xl md:text-2xl font-outfit tracking-tight">
                                    {allImages[selectedImg].title}
                                </h3>
                            )}
                            <p className="text-black/20 text-[9px] font-bold uppercase tracking-[0.3em] pt-2">
                                {selectedImg + 1} / {allImages.length}
                            </p>
                        </div>
                    </div>

                    <button
                        className="fixed right-4 top-1/2 -translate-y-1/2 text-black/10 hover:text-black transition-all p-4 bg-gray-50/50 hover:bg-gray-50 rounded-full z-[110] hidden md:block"
                        onClick={(e) => { e.stopPropagation(); nextImg(); }}
                    >
                        <ChevronRight size={48} strokeWidth={1} />
                    </button>

                    {/* Mobile Navigation Hint */}
                    <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-black/20 md:hidden mt-auto">
                        Tap anywhere to dismiss
                    </p>
                </div>
            )}
        </section>
    );
}
