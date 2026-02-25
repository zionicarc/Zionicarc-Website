import React from 'react';
import { useSite } from '../context/SiteContext';

export default function Vision() {
    const { settings } = useSite();

    if (!settings.showVision) return null;

    return (
        <section id="vision" className="pt-8 pb-24 bg-[#fcfcfc]">
            <div className="max-w-7xl mx-auto px-6 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">

                    {/* Section Heading */}
                    <div className="md:col-span-4 lg:col-span-3">
                        <h2 className="text-3xl md:text-4xl font-outfit font-light tracking-tighter text-black leading-[0.9] text-center md:text-left">
                            {settings.vision.title}
                        </h2>
                        <div className="w-12 h-[1px] bg-black/20 mt-8 hidden md:block" />
                    </div>

                    {/* Section Content */}
                    <div className="md:col-span-8 lg:col-span-7 lg:col-start-5 space-y-8">
                        <div className="text-xl md:text-2xl font-normal text-black leading-relaxed text-center md:text-left whitespace-pre-line">
                            {settings.vision.description}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
