import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ArrowUpRight } from 'lucide-react';
import { useSite } from "../context/SiteContext";

export default function Projects() {
  const { settings } = useSite();
  const data = settings.projects;

  const projectRef = useRef([]);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          gsap.fromTo(projectRef.current,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power4.out", delay: 0.1 }
          );
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    if (projectRef.current && projectRef.current[0]) {
      observer.observe(projectRef.current[0]);
    }
    return () => observer.disconnect();
  }, []);

  const projects = settings.projects.items;

  return (
    <section id="projects" className="py-24 bg-white text-black">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex justify-between items-end mb-16">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-outfit font-light tracking-tighter text-black leading-[0.9]">
              {data.title}
            </h2>
            <div className="h-1 w-20 bg-black/10" />
          </div>
          <a href="#" className="hidden md:flex items-center gap-2 text-sm uppercase tracking-widest hover:opacity-50 transition-opacity font-bold">
            {data.caption} <ArrowUpRight size={16} />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {projects.map((project, index) => (
            <a
              key={index}
              href={project.link || "#"}
              target={project.link && project.link !== "#" ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="group block"
              ref={el => projectRef.current[index] = el}
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100 mb-8 rounded-2xl shadow-sm transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-black/5">
                <img
                  src={project.img}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />

                {/* Hover Indicator */}
                <div className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur-md rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <ArrowUpRight size={20} className="text-black" />
                </div>
              </div>

              <div className="flex justify-between items-start border-b border-black/5 pb-6 group-hover:border-black/20 transition-colors">
                <div>
                  <h3 className="text-2xl md:text-3xl font-light tracking-tight mb-2 group-hover:translate-x-1 transition-transform duration-300">{project.title}</h3>
                  <p className="text-gray-400 font-light text-sm uppercase tracking-widest">{project.category}</p>
                </div>
                <span className="px-4 py-1.5 border border-black/5 rounded-full text-[10px] font-bold uppercase tracking-widest group-hover:bg-black group-hover:text-white transition-all duration-300">
                  {project.platform}
                </span>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 md:hidden flex justify-center">
          <a href="#" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
            {data.caption} <ArrowUpRight size={16} />
          </a>
        </div>

      </div>
    </section>
  );
}
