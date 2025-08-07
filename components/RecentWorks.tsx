"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface WorkItem {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
}

const works: WorkItem[] = [
  {
    id: 1,
    title: "Brand Identity",
    category: "Branding",
    image: "/images/img1.webp",
    description: "Complete brand identity design for tech startup",
  },
  {
    id: 2,
    title: "Web Design",
    category: "Digital",
    image: "/images/img2.webp",
    description: "Modern website design with focus on user experience",
  },
  {
    id: 3,
    title: "Print Campaign",
    category: "Print",
    image: "/images/img3.webp",
    description: "Creative print campaign for fashion brand",
  },
  {
    id: 4,
    title: "Mobile App",
    category: "Digital",
    image: "/images/img4.webp",
    description: "UI/UX design for mobile application",
  },
  {
    id: 5,
    title: "Digital Art",
    category: "Creative",
    image: "/images/img5.webp",
    description: "Experimental digital art and visual design",
  },
];

export default function RecentWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorMediaRef = useRef<HTMLDivElement>(null);
  const cursorMediaBoxRef = useRef<HTMLDivElement>(null);
  const svgFilterRef = useRef<SVGFilterElement>(null);
  const svgFilterTurbulenceRef = useRef<SVGFETurbulenceElement>(null);
  const svgFilterDisplacementMapRef = useRef<SVGFEDisplacementMapElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Create cursor element
    const cursor = document.createElement("div");
    cursor.className = "mf-cursor";
    cursor.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 20px;
      height: 20px;
      background: rgba(0, 0, 0, 0.8);
      border-radius: 50%;
      pointer-events: none;
      z-index: 99999;
      mix-blend-mode: difference;
      transition: transform 0.1s ease;
    `;
    document.body.appendChild(cursor);
    cursorRef.current = cursor;

    // Create cursor inner element for skewing
    const cursorInner = document.createElement("div");
    cursorInner.className = "mf-cursor-inner";
    cursorInner.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transform-origin: center;
    `;
    cursor.appendChild(cursorInner);

    const cursorMedia = document.createElement("div");
    cursorMedia.className = "mf-cursor-media";
    cursorMedia.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 300px;
      height: 300px;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
      z-index: 1;
    `;
    cursor.appendChild(cursorMedia);
    cursorMediaRef.current = cursorMedia;

    // Create cursor media box
    const cursorMediaBox = document.createElement("div");
    cursorMediaBox.className = "mf-cursor-media-box";
    cursorMediaBox.style.cssText = `
      width: 100%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
      filter: url(#svg-distortion-filter);
    `;
    cursorMedia.appendChild(cursorMediaBox);
    cursorMediaBoxRef.current = cursorMediaBox;

    // Create SVG filter
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("viewBox", "0 0 463 463");
    svg.style.cssText =
      "position: absolute; top: -1px; left: -1px; height: 0; width: 0";
    svg.id = "svg-distortion";

    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const filter = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "filter"
    );
    filter.id = "svg-distortion-filter";
    filter.setAttribute("x", "-50%");
    filter.setAttribute("y", "-50%");
    filter.setAttribute("width", "200%");
    filter.setAttribute("height", "200%");

    const feTurbulence = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feTurbulence"
    );
    feTurbulence.setAttribute("type", "fractalNoise");
    feTurbulence.setAttribute("baseFrequency", "0.01 0.003");
    feTurbulence.setAttribute("stitchTiles", "noStitch");
    feTurbulence.setAttribute("numOctaves", "1");
    feTurbulence.setAttribute("seed", "2");
    feTurbulence.setAttribute("result", "warp");

    const feDisplacementMap = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feDisplacementMap"
    );
    feDisplacementMap.setAttribute("xChannelSelector", "R");
    feDisplacementMap.setAttribute("yChannelSelector", "G");
    feDisplacementMap.setAttribute("scale", "1");
    feDisplacementMap.setAttribute("in", "SourceGraphic");
    feDisplacementMap.setAttribute("in2", "warp");

    filter.appendChild(feTurbulence);
    filter.appendChild(feDisplacementMap);
    defs.appendChild(filter);
    svg.appendChild(defs);
    document.body.appendChild(svg);

    svgFilterRef.current = filter;
    svgFilterTurbulenceRef.current = feTurbulence;
    svgFilterDisplacementMapRef.current = feDisplacementMap;

    // Mouse movement with skewing
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let velX = 0;
    let velY = 0;
    let skewing = 0;
    let skewingMedia = 1;

    const updateCursor = () => {
      // Calculate velocity
      const targetX = mouseX;
      const targetY = mouseY;
      velX = targetX - cursorX;
      velY = targetY - cursorY;

      cursorX += velX * 0.1;
      cursorY += velY * 0.1;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorX - 10}px, ${
          cursorY - 10
        }px)`;
      }

      // Apply skewing effect
      if (skewing > 0) {
        const velocity = Math.sqrt(velX * velX + velY * velY);
        const skewAmount = Math.min(velocity * 0.001, 0.15) * skewing;

        if (cursorMediaRef.current) {
          cursorMediaRef.current.style.transform = `translate(-50%, -50%) scaleX(${
            1 + skewAmount
          }) scaleY(${1 - skewAmount})`;
        }
      } else {
        if (cursorMediaRef.current) {
          cursorMediaRef.current.style.transform = "translate(-50%, -50%)";
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    document.addEventListener("mousemove", handleMouseMove);
    gsap.ticker.add(updateCursor);

    // Displacement effect function
    const makeDisplace = () => {
      if (
        !svgFilterTurbulenceRef.current ||
        !svgFilterDisplacementMapRef.current
      )
        return;

      const tl = gsap.timeline();
      gsap.killTweensOf(svgFilterDisplacementMapRef.current);

      tl.set(
        svgFilterTurbulenceRef.current,
        {
          attr: { seed: gsap.utils.random(2, 150) },
        },
        0
      );

      tl.to(
        svgFilterDisplacementMapRef.current,
        {
          attr: { scale: gsap.utils.random(80, 120) },
          duration: 0.2,
        },
        0
      );

      tl.to(
        svgFilterDisplacementMapRef.current,
        {
          attr: { scale: 1 },
          duration: 1.2,
          ease: "expo.out",
        },
        0.2
      );
    };

    // Add event listeners to work items
    const workItems = sectionRef.current.querySelectorAll(".work-item");
    workItems.forEach((item, index) => {
      item.addEventListener("mouseenter", () => {
        // Set hovered index for button styling
        setHoveredIndex(index);

        if (cursorMediaRef.current && cursorMediaBoxRef.current) {
          // Enable skewing for media
          skewing = skewingMedia;

          // Preload image
          const img = new Image();
          img.onload = () => {
            console.log("Image loaded:", works[index].image);
            if (cursorMediaBoxRef.current) {
              cursorMediaBoxRef.current.innerHTML = "";
              const displayImg = document.createElement("img");
              displayImg.src = works[index].image;
              displayImg.style.cssText = `
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 50%;
              `;
              cursorMediaBoxRef.current.appendChild(displayImg);

              if (cursorMediaRef.current) {
                cursorMediaRef.current.style.opacity = "1";
              }

              makeDisplace();
            }
          };
          img.onerror = () => {
            console.error("Failed to load image:", works[index].image);
          };
          img.src = works[index].image;
        }
      });

      item.addEventListener("mouseleave", () => {
        // Clear hovered index
        setHoveredIndex(null);

        if (cursorMediaRef.current) {
          cursorMediaRef.current.style.opacity = "0";
        }
        // Disable skewing
        skewing = 0;
      });
    });

    // Cleanup
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      gsap.ticker.remove(updateCursor);
      if (cursorRef.current) {
        document.body.removeChild(cursorRef.current);
      }
      if (svg.parentNode) {
        document.body.removeChild(svg);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen bg-white text-black py-20 px-32"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-16">
          <div className=" text-left">
            <h2 className="text-4xl font-[400] uppercase tracking-tight mb-5">
              Recent Works
            </h2>
            <p className="text-md text-gray-500 max-w-md font-[400]">
              A selection of my latest projects showcasing creative solutions
              across various mediums and industries.
            </p>
          </div>
          <div className="text-md font-[400] uppercase tracking-tight px-12 py-2 border border-black rounded-full cursor-pointer">
            View All
          </div>
        </div>

        <div className="space-y-0">
          {works.map((work, index) => (
            <div
              key={work.id}
              className="work-item group cursor-pointer border-b border-gray-200 py-8 hover:bg-gray-50 transition-colors duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl font-[400] uppercase tracking-wide mb-2">
                    {work.title}
                  </h3>
                  <p className="text-gray-600 text-sm uppercase tracking-wider mb-1">
                    {work.category}
                  </p>
                  <p className="text-gray-500 text-sm max-w-md">
                    {work.description}
                  </p>
                </div>
                <div className="ml-8">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                      hoveredIndex === index
                        ? "bg-black text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    <span className="text-xs">View</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
