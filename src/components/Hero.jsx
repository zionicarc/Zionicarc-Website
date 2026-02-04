import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowDown } from 'lucide-react';

import { useSite } from '../context/SiteContext';

export default function Hero() {
  const { settings } = useSite();
  const heroRef = useRef(null);
  const textRef = useRef(null);
  const subTextRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(textRef.current, {
      y: 100,
      opacity: 0,
      rotateX: -20
    }, {
      duration: 1.2,
      y: 0,
      opacity: 1,
      rotateX: 0,
      ease: "power4.out",
      delay: 0.5
    })
      .fromTo(subTextRef.current, {
        y: 50,
        opacity: 0
      }, {
        duration: 1,
        y: 0,
        opacity: 1,
        ease: "power3.out"
      }, "-=0.8")
      .fromTo(imageRef.current, {
        scale: 1.2,
        opacity: 0
      }, {
        duration: 1.5,
        scale: 1,
        opacity: 1,
        ease: "power2.out"
      }, "-=1");

  }, []);

  return (
    <section ref={heroRef} className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-[#f0f0f0]">

      {/* Background Layer: Image & Grid */}
      <div ref={imageRef} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#f0f0f0]/90 z-10" />

        {/* Architectural Image */}
        <img
          src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2700&auto=format&fit=crop"
          alt="Modern Architecture"
          className="w-full h-full object-cover grayscale opacity-50"
          loading="eager"
          fetchpriority="high"
        />

        {/* Dynamic Drafting Grid */}
        <div className="absolute inset-0 z-20">
          <Squares
            speed={0.3}
            squareSize={45}
            direction="diagonal"
            borderColor="rgba(0,0,0,0.05)"
            hoverFillColor="rgba(0,0,0,0.02)"
          />
        </div>
      </div>

      <div className="relative z-30 max-w-7xl 2xl:max-w-screen-2xl mx-auto px-8 text-center pt-20">
        <h1 ref={textRef} className="font-montserrat text-6xl md:text-9xl font-medium tracking-tighter leading-[0.9] mb-8 mix-blend-difference text-black/80" dangerouslySetInnerHTML={{ __html: settings.hero.title }} />

        <div ref={subTextRef} className="max-w-2xl mx-auto space-y-8">
          <p className="text-xl md:text-2xl font-normal text-gray-800 leading-relaxed">
            {settings.hero.tagline}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-8 mt-12">
            <a
              href="#detailed-services"
              className="group flex items-center justify-center gap-3 text-sm md:text-base font-medium uppercase tracking-[0.2em] text-gray-800 hover:text-black transition-colors duration-300"
            >
              Our Services
              <svg
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>

            <a
              href="#contact"
              className="group flex items-center justify-center gap-3 text-sm md:text-base font-medium uppercase tracking-[0.2em] text-gray-800 hover:text-black transition-colors duration-300"
            >
              Contact Us
              <svg
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown size={24} className="opacity-50" />
      </div>

    </section>
  );
}