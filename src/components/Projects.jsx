import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ArrowUpRight } from 'lucide-react';

export default function Projects() {
  const projectRef = useRef([]);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          gsap.fromTo(projectRef.current,
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" }
          );
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    if (projectRef.current.length > 0) {
      observer.observe(projectRef.current[0]); // Observe first item container or section
    }
    return () => observer.disconnect();
  }, []);

  const projects = [
    {
      name: "Aeon Tower",
      location: "Singapore",
      img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2670&auto=format&fit=crop",
      type: "Commercial"
    },
    {
      name: "The Glass House",
      location: "Switzerland",
      img: "https://images.unsplash.com/photo-1449156059431-787c1be17d0b?q=80&w=2070&auto=format&fit=crop",
      type: "Residential"
    },
    {
      name: "Skyline Pavilion",
      location: "Tokyo",
      img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=2070&auto=format&fit=crop",
      type: "Public Design"
    },
    {
      name: "Zenith Library",
      location: "Copenhagen",
      img: "https://images.unsplash.com/photo-1518005020250-6eb5f3f2d057?q=80&w=2086&auto=format&fit=crop",
      type: "Institutional"
    }
  ];

  return (
    <section id="projects" className="py-24 bg-white text-black">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex justify-between items-end mb-16">
          <h2 className="text-3xl md:text-4xl font-outfit font-light tracking-tighter text-black leading-[0.9]">
            Our Work
          </h2>
          <a href="#" className="hidden md:flex items-center gap-2 text-sm uppercase tracking-widest hover:opacity-50 transition-opacity">
            View All Projects <ArrowUpRight size={16} />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group cursor-pointer"
              ref={el => projectRef.current[index] = el}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 mb-6">
                <img
                  src={project.img}
                  alt={project.name}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
              </div>

              <div className="flex justify-between items-start border-b border-black/10 pb-4 group-hover:border-black/50 transition-colors">
                <div>
                  <h3 className="text-2xl font-medium mb-1">{project.name}</h3>
                  <p className="text-gray-500">{project.location}</p>
                </div>
                <span className="px-3 py-1 border border-black/10 rounded-full text-xs uppercase tracking-wider group-hover:bg-black group-hover:text-white transition-colors">
                  {project.type}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 md:hidden flex justify-center">
          <a href="#" className="flex items-center gap-2 text-sm uppercase tracking-widest">
            View All Projects <ArrowUpRight size={16} />
          </a>
        </div>

      </div>
    </section>
  );
}
