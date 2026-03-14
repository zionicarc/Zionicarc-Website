import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function AboutFounder() {
    const { settings } = useSite();
    const data = settings.founder;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!data || !settings.showFounder) return null;

    // Split bio by double newlines to render multiple paragraphs
    const bioParagraphs = data.bio ? data.bio.split('\n\n') : [];

    return (
        <div className="bg-white min-h-screen pt-24 md:pt-32 font-outfit">
            <Navbar />

            <main className="max-w-[1440px] mx-auto px-6 xl:px-12 2xl:px-24 pb-24">
                {/* Header Side */}
                <div className="mb-12 md:mb-16 flex flex-col items-start gap-4">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 hover:opacity-60 transition-all font-outfit text-xs font-bold uppercase tracking-widest mb-4 group text-black"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-outfit tracking-tighter leading-[0.9] text-black">
                        {data.title || "About The Founder"}
                    </h1>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-stretch">
                    
                    {/* Image Column */}
                    <div className="lg:col-span-5 relative w-full h-[500px] lg:h-[700px] rounded-2xl overflow-hidden bg-gray-50 shadow-2xl">
                        {data.image ? (
                            <img 
                                src={data.image} 
                                alt={data.name} 
                                className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                <span className="text-sm tracking-widest uppercase">Founder Image</span>
                            </div>
                        )}
                        {/* Overlay Gradient for premium feel */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                        <div className="absolute bottom-8 left-8 right-8 text-white">
                            <h2 className="text-3xl font-light mb-1">{data.name}</h2>
                            <p className="text-sm font-bold tracking-widest uppercase text-white/80">{data.subtitle}</p>
                        </div>
                    </div>

                    {/* Text Column */}
                    <div className="lg:col-span-7 flex flex-col justify-center space-y-8 lg:py-12">
                        <div className="w-12 h-[2px] bg-black/20" />
                        
                        <div className="space-y-6 text-lg md:text-xl font-light text-black/80 leading-relaxed">
                            {bioParagraphs.map((paragraph, idx) => (
                                <p key={idx}>{paragraph}</p>
                            ))}
                        </div>

                        {data.credentials && (
                            <div className="pt-8 border-t border-black/10 mt-8">
                                <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-black">Credentials</h3>
                                <div className="text-base text-black/70 italic">
                                    {data.credentials}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
