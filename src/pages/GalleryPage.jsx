import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { X, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSite } from "../context/SiteContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function GalleryPage() {
    const { settings } = useSite();
    const data = settings.gallery;
    const [selectedImg, setSelectedImg] = useState(null); // { sectionIndex, imgIndex }
    const sectionsRef = useRef([]);

    useEffect(() => {
        window.scrollTo(0, 0);

        // Premium entrance animation - Removed opacity to prevent stuck faint text
        gsap.from(".gallery-header", {
            y: 30,
            duration: 1,
            ease: "power3.out"
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    gsap.fromTo(entry.target.querySelectorAll('.gallery-item'),
                        { y: 50, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }
                    );
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        sectionsRef.current.forEach(section => {
            if (section) observer.observe(section);
        });

        return () => observer.disconnect();
    }, []);

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
        const currentSection = data.sections[selectedImg.sectionIndex];
        if (selectedImg.imgIndex < currentSection.images.length - 1) {
            setSelectedImg({ ...selectedImg, imgIndex: selectedImg.imgIndex + 1 });
        } else if (selectedImg.sectionIndex < data.sections.length - 1) {
            setSelectedImg({ sectionIndex: selectedImg.sectionIndex + 1, imgIndex: 0 });
        } else {
            setSelectedImg({ sectionIndex: 0, imgIndex: 0 });
        }
    };

    const prevImg = () => {
        if (selectedImg === null) return;
        if (selectedImg.imgIndex > 0) {
            setSelectedImg({ ...selectedImg, imgIndex: selectedImg.imgIndex - 1 });
        } else if (selectedImg.sectionIndex > 0) {
            const prevSectionIndex = selectedImg.sectionIndex - 1;
            setSelectedImg({
                sectionIndex: prevSectionIndex,
                imgIndex: data.sections[prevSectionIndex].images.length - 1
            });
        } else {
            const lastSectionIndex = data.sections.length - 1;
            setSelectedImg({
                sectionIndex: lastSectionIndex,
                imgIndex: data.sections[lastSectionIndex].images.length - 1
            });
        }
    };

    if (!data || !data.sections || data.sections.length === 0) return (
        <div className="min-h-screen flex items-center justify-center bg-white font-outfit">
            <p className="text-gray-400 uppercase tracking-widest text-sm">Gallery is currently empty.</p>
        </div>
    );

    const currentImage = selectedImg !== null ? data.sections[selectedImg.sectionIndex].images[selectedImg.imgIndex] : null;

    return (
        <div className="bg-white min-h-screen pt-24 md:pt-32">
            <Navbar />

            <main className="max-w-[1440px] mx-auto px-6 xl:px-12 2xl:px-24 pb-24">
                {/* Header Side */}
                <div className="gallery-header mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 text-center md:text-left items-center md:items-end" style={{ opacity: 1 }}>
                    <div className="space-y-6 max-w-2xl w-full md:w-auto">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 hover:opacity-60 transition-all font-outfit text-xs font-bold uppercase tracking-widest mb-4 group"
                            style={{ color: '#000', opacity: 1 }}
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" style={{ color: '#000' }} /> Back to Home
                        </Link>
                        <h1
                            className="text-4xl md:text-7xl font-outfit tracking-tighter leading-[0.9]"
                            style={{ color: '#000', opacity: 1 }}
                        >
                            {data.title}
                        </h1>
                    </div>
                    <p
                        className="font-outfit max-w-md text-base md:text-lg leading-relaxed w-full md:w-auto"
                        style={{ color: '#000', opacity: 1 }}
                    >
                        {data.description}
                    </p>
                </div>

                {/* Sections */}
                <div className="space-y-24 md:space-y-32">
                    {data.sections.map((section, sIdx) => (
                        <section key={sIdx} ref={el => sectionsRef.current[sIdx] = el} className="space-y-10">
                            <div className="flex items-center gap-6">
                                <h2 className="text-2xl md:text-3xl font-outfit font-bold uppercase tracking-[0.1em] text-black">
                                    {section.title}
                                </h2>
                                <div className="flex-1 h-px bg-black/5" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                                {(section.images || []).map((img, iIdx) => (
                                    <div
                                        key={iIdx}
                                        className="gallery-item group relative aspect-[4/5] overflow-hidden bg-gray-50 rounded-2xl cursor-zoom-in"
                                        onClick={() => setSelectedImg({ sectionIndex: sIdx, imgIndex: iIdx })}
                                    >
                                        <img
                                            src={img.url}
                                            alt={img.title}
                                            className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                                            loading="lazy"
                                        />

                                        {/* Overlay with Title */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                                            <p className="text-white/60 font-outfit text-[10px] font-bold uppercase tracking-[0.2em] translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                                                {section.title}
                                            </p>
                                            <h3 className="text-white text-xl md:text-2xl font-outfit font-medium translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                {img.title}
                                            </h3>
                                        </div>

                                        {/* Hover border effect */}
                                        <div className="absolute inset-4 border border-white/20 rounded-xl opacity-0 scale-110 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 pointer-events-none" />
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </main>

            <Footer />

            {/* Premium Lightbox Overlay */}
            {selectedImg !== null && (
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
                                src={currentImage.url}
                                alt={currentImage.title}
                                className="max-w-full max-h-full object-contain rounded-xl shadow-[0_30px_80px_-15px_rgba(0,0,0,0.1)] border border-black/5"
                            />
                        </div>

                        <div className="text-center space-y-2 max-w-sm px-4">
                            <p className="text-black/40 font-outfit text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em]">
                                {data.sections[selectedImg.sectionIndex].title}
                            </p>
                            <h3 className="text-xl md:text-3xl font-outfit text-black leading-tight">
                                {currentImage.title}
                            </h3>
                            <div className="pt-4 flex items-center justify-center gap-4">
                                <div className="h-px w-8 bg-black/10" />
                                <p className="text-black/20 text-[9px] font-bold font-outfit uppercase tracking-[0.2em]">
                                    {selectedImg.sectionIndex + 1} . {selectedImg.imgIndex + 1}
                                </p>
                                <div className="h-px w-8 bg-black/10" />
                            </div>
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

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.4s ease-out forwards;
                }
            `}} />
        </div>
    );
}
