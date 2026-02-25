import React from 'react';
import { useSite } from '../context/SiteContext';

export default function OurApproach() {
  const { settings } = useSite();
  const approach = settings.approach;

  return (
    <section id="approach" className="pt-24 pb-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          {/* Sticky Header Section */}
          <div className="lg:col-span-4 lg:sticky lg:top-25 lg:-mt-2 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-outfit font-light tracking-tighter text-black leading-[0.9] mb-8">
              {approach.title}
            </h2>
            <p className="text-gray-600 text-lg max-w-sm mx-auto lg:mx-0 leading-relaxed font-normal">
              {approach.description}
            </p>
            <div className="mt-12 hidden lg:block">
              <div className="w-[1px] h-32 bg-gradient-to-b from-black to-transparent mx-auto lg:mx-0 opacity-20" />
            </div>
          </div>

          {/* Approach Cards Section */}
          <div className="lg:col-span-7 lg:col-start-6 space-y-6">
            {approach.steps.map((step, idx) => (
              <div
                key={idx}
                className="group relative p-8 sm:p-10 md:p-14 bg-[#f9f9f9] hover:bg-[#f2f2f2] transition-all duration-500 ease-out rounded-[40px] overflow-hidden cursor-default"
              >
                {/* Background Number Accent */}
                <span className="absolute -bottom-6 -right-6 text-[140px] md:text-[200px] font-bold text-black/[0.02] transition-colors duration-500 select-none pointer-events-none">
                  {step.no}
                </span>

                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 md:gap-8">
                  {/* Decorative Architectural Shape */}
                  <div className="flex-shrink-0 w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white font-bold text-xs tracking-widest shadow-lg shadow-black/5">
                    {step.no}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-2xl md:text-3xl font-medium text-black tracking-tight leading-tight">
                      <strong>{step.title}</strong>
                    </h3>
                    <p className="text-gray-700 text-[17px] md:text-lg leading-relaxed font-normal max-w-2xl">
                      {step.desc}
                    </p>
                  </div>
                </div>

                {/* Subtle Hover Indicator */}
                <div className="absolute top-10 right-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-1.5 h-1.5 bg-black rounded-full" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}