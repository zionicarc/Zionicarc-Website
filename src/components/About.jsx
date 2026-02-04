import React from 'react';

export default function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">

          {/* Section Heading */}
          <div className="md:col-span-4 lg:col-span-3">
            <h2 className="text-3xl md:text-4xl font-outfit font-light tracking-tighter text-black leading-[0.9] text-center md:text-left">
              About Us
            </h2>
            <div className="w-12 h-[1px] bg-black/20 mt-8 hidden md:block" />
          </div>

          {/* Section Content */}
          <div className="md:col-span-8 lg:col-span-7 lg:col-start-5 space-y-8">
            <p className="text-xl md:text-2xl font-normal text-black leading-relaxed text-center md:text-left">
              An architecture and design firm specialized in creating innovative, functional, and aesthetically pleasing spaces across residential, commercial, and hospitality sectors.  Each project is a unique reflection of our clients' vision, values and aspirations, thoughtfully translated into meaningful design with precision, care and creativity.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}