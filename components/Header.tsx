"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Link from "next/link";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const menuTextsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.set(["#line1", "#line2"], { transformOrigin: "center center" });

    tlRef.current = gsap
      .timeline({ paused: true })
      .to("#line1", { y: 5, ease: "power4.inOut", duration: 0.5 }, 0)
      .to("#line2", { y: -5, ease: "power4.inOut", duration: 0.5 }, 0)
      .to("#line1", { rotation: 45, ease: "power4.inOut", duration: 0.5 })
      .to(
        "#line2",
        { rotation: -45, ease: "power4.inOut", duration: 0.5 },
        "-=0.5"
      );

    // Set initial state for menu texts
    gsap.set(".menu-text", { y: 50, opacity: 0 });

    return () => {
      tlRef.current?.kill();
    };
  }, []);

  const handleMenuClick = () => {
    if (tlRef.current) {
      if (isMenuOpen) {
        tlRef.current.reverse();
        // Hide texts when closing menu
        gsap.to(".menu-text", {
          y: 30,
          opacity: 0,
          duration: 0.5,
          stagger: 0.03,
          ease: "power2.inOut",
        });
      } else {
        tlRef.current.play();
        // Animate texts in after menu opens (700ms delay to match menu transition)
        gsap.to(".menu-text", {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          delay: 0.7,
        });
      }
    }
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="fixed w-full flex justify-between items-center px-32 py-4 z-50 mix-blend-difference">
        <div className="font-[500] text-2xl text-white">RZ.</div>
        <div
          id="menu"
          className="flex justify-center items-center h-12 w-12 cursor-pointer"
          onClick={handleMenuClick}
        >
          <div
            id="menuImg"
            className="w-12 h-3 relative flex flex-col justify-between items-center"
          >
            <div ref={line1Ref} id="line1" className="w-1/2 h-0.5 bg-white" />
            <div ref={line2Ref} id="line2" className="w-1/2 h-0.5 bg-white" />
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 bg-[#151515] z-40 transition-transform duration-700 ease-in-out ${
          isMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="grid grid-cols-[2fr_1fr_1fr] h-full px-32 items-center gap-32">
          <div className="flex flex-col leading-[1.1]">
            <Link
              href="/"
              className="group relative text-white font-[500] text-[90px] uppercase w-fit menu-text"
            >
              <span className="relative inline-flex overflow-hidden">
                <div className="translate-y-0 skew-y-0 transition duration-500 group-hover:-translate-y-[120%] group-hover:skew-y-12">
                  Home
                </div>
                <div className="absolute translate-y-[120%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
                  Home
                </div>
              </span>
            </Link>
            <Link
              href="/"
              className="group relative text-white font-[500] text-[90px] uppercase w-fit menu-text"
            >
              <span className="relative inline-flex overflow-hidden">
                <div className="translate-y-0 skew-y-0 transition duration-500 group-hover:-translate-y-[120%] group-hover:skew-y-12">
                  Works
                </div>
                <div className="absolute translate-y-[120%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
                  Works
                </div>
              </span>
            </Link>
            <Link
              href="/"
              className="group relative text-white font-[500] text-[90px] uppercase w-fit menu-text"
            >
              <span className="relative inline-flex overflow-hidden">
                <div className="translate-y-0 skew-y-0 transition duration-500 group-hover:-translate-y-[120%] group-hover:skew-y-12">
                  About
                </div>
                <div className="absolute translate-y-[120%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
                  About
                </div>
              </span>
            </Link>
            <Link
              href="/"
              className="group relative text-white font-[500] text-[90px] uppercase w-fit menu-text"
            >
              <span className="relative inline-flex overflow-hidden">
                <div className="translate-y-0 skew-y-0 transition duration-500 group-hover:-translate-y-[125%] group-hover:skew-y-12">
                  Contact
                </div>
                <div className="absolute translate-y-[125%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
                  Contact
                </div>
              </span>
            </Link>
          </div>
          <div className="flex flex-col gap-12 text-white">
            <div>
              <h3 className="font-[500] mb-6 menu-text text-white/75">
                Socials
              </h3>
              <div className="flex flex-col">
                <Link
                  href="/"
                  className="group relative text-white font-[500] text-2xl w-fit menu-text"
                >
                  <span className="relative inline-flex overflow-hidden">
                    <div className="translate-y-0 skew-y-0 transition duration-500 group-hover:-translate-y-[120%] group-hover:skew-y-12">
                      Dribble
                    </div>
                    <div className="absolute translate-y-[120%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
                      Dribble
                    </div>
                  </span>
                </Link>
                <Link
                  href="/"
                  className="group relative text-white font-[500] text-2xl w-fit menu-text"
                >
                  <span className="relative inline-flex overflow-hidden">
                    <div className="translate-y-0 skew-y-0 transition duration-500 group-hover:-translate-y-[120%] group-hover:skew-y-12">
                      Instagram
                    </div>
                    <div className="absolute translate-y-[120%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
                      Instagram
                    </div>
                  </span>
                </Link>
                <Link
                  href="/"
                  className="group relative text-white font-[500] text-2xl w-fit menu-text"
                >
                  <span className="relative inline-flex overflow-hidden">
                    <div className="translate-y-0 skew-y-0 transition duration-500 group-hover:-translate-y-[120%] group-hover:skew-y-12">
                      Twitter
                    </div>
                    <div className="absolute translate-y-[120%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
                      Twitter
                    </div>
                  </span>
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-[500] mb-6 menu-text text-white/75">
                Let's Talk
              </h3>
              <div className="flex flex-col gap-1">
                <Link
                  href="mailto:jintarehaan@gmail.com"
                  className="group relative text-white font-[500] text-2xl menu-text"
                >
                  <span className="relative inline-flex overflow-hidden">
                    <div className="translate-y-0 skew-y-0 transition duration-500 group-hover:-translate-y-[160%] group-hover:skew-y-12">
                      jintarehaan@gmail.com
                    </div>
                    <div className="absolute translate-y-[160%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
                      jintarehaan@gmail.com
                    </div>
                  </span>
                </Link>
                <Link
                  href="tel:+918580902202"
                  className="group relative text-white text-left font-[500] text-2xl menu-text"
                >
                  <span className="relative inline-flex overflow-hidden">
                    <div className="translate-y-0 skew-y-0 transition duration-500 group-hover:-translate-y-[140%] group-hover:skew-y-12">
                      +91 85809 02202
                    </div>
                    <div className="absolute translate-y-[140%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
                      +91 85809 02202
                    </div>
                  </span>
                </Link>
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </>
  );
};

export default Header;
