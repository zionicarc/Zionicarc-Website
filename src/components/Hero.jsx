import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowDown, ArrowRight } from 'lucide-react';
import Squares from './Squares';
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
        <h1 ref={textRef} className="font-montserrat text-6xl md:text-9xl font-medium tracking-tighter leading-[0.9] mb-8 mix-blend-difference text-black/80">
          {settings.hero.title.split(' ').map((word, i) => (
            <span key={i} className="block">{word}</span>
          ))}
        </h1>

        <div ref={subTextRef} className="max-w-2xl mx-auto space-y-8">
          <p className="text-xl md:text-2xl font-normal text-gray-800 leading-relaxed">
            {settings.hero.tagline}
          </p>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-5 md:gap-24 pt-12 md:pt-16">
            <button
              onClick={() => {
                const servicesSection = document.getElementById('detailed-services');
                servicesSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center justify-center gap-4 text-black font-medium text-base md:text-[17px] uppercase tracking-[0.3em] transition-opacity hover:opacity-50 w-auto"
            >
              <span>OUR SERVICES</span>
              <span className="text-2xl mt-[-2px]">→</span>
            </button>
            <button
              onClick={() => {
                const contactSection = document.getElementById('contact');
                contactSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center justify-center gap-4 text-black font-medium text-base md:text-[17px] uppercase tracking-[0.3em] transition-opacity hover:opacity-50 w-auto"
            >
              <span>CONTACT US</span>
              <span className="text-2xl mt-[-2px]">→</span>
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown size={24} className="opacity-50" />
      </div>

    </section>
  );
}