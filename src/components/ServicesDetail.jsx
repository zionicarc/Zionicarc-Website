import React from 'react';
import interiorImage from '../assets/interior-design.png';
import { useSite } from '../context/SiteContext';

const DEFAULT_IMG = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop";

const isDirectImageUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    const u = url.trim();
    // Unsplash page links don't work in img src; only direct image URLs do
    if (u.includes('unsplash.com/photos/') && !u.startsWith('https://images.unsplash.com/')) return false;
    return u.startsWith('http://') || u.startsWith('https://');
};

export default function ServicesDetail() {
    const { settings } = useSite();
    const servicesData = settings.services;

    // local mapping for images if they are stored as assets
    const images = {
        "Interior Design": interiorImage,
        "Residential Architecture": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
        "Institutional Architecture": "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2086&auto=format&fit=crop",
        "Commercial Architecture": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
        "Construction Monitoring": "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2070&auto=format&fit=crop",
        "Fellowship and Mentorship": "https://unsplash.com/photos/TltGIe9PK4Y/download?force=true&w=1200"
    };

    return (
        <section id="detailed-services" className="pt-12 pb-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 md:px-8">

                {/* Section Heading */}
                <div className="mb-16 text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-outfit font-light tracking-tighter text-black leading-[0.9] mb-8">
                        {servicesData.title}
                    </h2>
                    <p className="text-gray-600 text-lg max-w-sm mx-auto md:mx-0 leading-relaxed font-normal">
                        {servicesData.caption}
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {servicesData.items.map((service, index) => {
                        const fallbackImg = images[service.title] || DEFAULT_IMG;
                        const imgSrc = isDirectImageUrl(service.img) ? service.img : fallbackImg;
                        return (
                        <div key={index} className="group cursor-default">
                            <div className="overflow-hidden rounded-2xl aspect-[4/5] mb-8 bg-gray-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                                <img
                                    src={imgSrc}
                                    alt={service.title}
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-in-out scale-100 group-hover:scale-110"
                                    loading="lazy"
                                    onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_IMG; }}
                                />
                            </div>
                            <div className="space-y-4 px-2 text-center md:text-left">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-normal tracking-tight text-black">
                                        {service.title}
                                    </h3>
                                    {service.subtitle && (
                                        <p className="text-sm font-medium uppercase tracking-[0.2em] text-black/50">
                                            {service.subtitle}
                                        </p>
                                    )}
                                </div>
                                <p className="text-gray-600 leading-relaxed font-normal text-[15px] lg:text-[16px]">
                                    {service.desc}
                                </p>
                            </div>
                        </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
