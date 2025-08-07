import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import Model from "./model";
import useDimension from "@/lib/hooks/useDimension";
import { Suspense, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const addStyles = () => {
  if (typeof document !== "undefined") {
    const styleId = "responsive-scroll-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        @keyframes responsive-scroll{
          0%{
            margin-top: 25%;
            opacity: 0;
          }
          33%{
            margin-top: 36.55%;
            opacity: 1;
          }
          100%{
            margin-top: 60%;
            opacity: 0;
          }
        }
        .responsive-scroll{
          position: relative;
          display: flex;
          justify-content: center;
          width: 32px;
          height: 48px;
          border: #fafafa 2px solid;
          border-radius: 25px;
          transition: all 450ms ease;
        }
        .responsive-scroll:before{
          content: "";
          position: absolute;
          display: block;
          width: 40%;
          height: 3px;
          max-height: 0;
          border-bottom-left-radius: 1000px;
          border-bottom-right-radius: 1000px;
          background-color: #fafafa;
          transition: all 450ms ease;
        }
        .responsive-scroll:after{
          content: "";
          position: absolute;
          bottom: 5px;
          display: block;
          width: 55%;
          height: 2px;
          max-height: 0;
          border-radius: 1000px;
          background-color: #fafafa;
          opacity: 0.1;
          transition: all 950ms ease;
        }
        .responsive-scroll:hover:after{
          opacity: 1;
        }
        .responsive-scroll .scroll-thisico{
          display: block;
          width: 6px;
          height: 6px;
          margin-top: 25%;
          border-radius: 1000px;
          background-color: #fafafa;
          transform: translatex(0px) rotate(0deg);
          transform-origin: top left;
          animation: responsive-scroll infinite 2250ms;
          transition: all 450ms ease;
        }
        .char {
          display: inline-block;
          will-change: transform;
          overflow: hidden;
          position: relative;
        }
        .char span {
          display: inline-block;
        }
      `;
      document.head.appendChild(style);
    }
  }
};

export default function Scene() {
  const device = useDimension();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    addStyles();

    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // GSAP animation for title characters with a small delay to ensure DOM is ready
    const animationTimer = setTimeout(() => {
      if (titleRef.current) {
        const chars = titleRef.current.querySelectorAll(".char");
        console.log("Found characters:", chars.length); // Debug log

        if (chars.length > 0) {
          const visualChars = titleRef.current.querySelectorAll(
            ".visual-line .char span"
          );
          const designerChars = titleRef.current.querySelectorAll(
            ".designer-line .char span"
          );

          // Set initial positions
          gsap.set([...visualChars, ...designerChars], { x: "100%" });

          // Animate Visual characters
          gsap.to(visualChars, {
            x: "0%",
            duration: 1,
            stagger: 0.01,
            ease: "sine.out",
            delay: 0.5,
          });

          // Animate Designer characters simultaneously
          gsap.to(designerChars, {
            x: "0%",
            duration: 1,
            stagger: 0.01,
            ease: "sine.out",
            delay: 0.5,
          });
        }
      }
    }, 100);

    // Cleanup timers on unmount
    return () => {
      clearInterval(timer);
      clearTimeout(animationTimer);
    };
  }, []);

  if (!device.width || !device.height) {
    return null;
  }

  const frustumSize = device.height;
  const aspect = device.width / device.height;

  // Function to split text into characters
  const splitText = (text: string) => {
    return text.split("").map((char, index) => (
      <span key={index} className="char">
        <span>{char === " " ? "\u00A0" : char}</span>
      </span>
    ));
  };

  return (
    <div className="h-screen w-full relative bg-white text-white">
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
        onError={(error) => {
          console.error("Canvas error:", error);
        }}
      >
        <OrthographicCamera
          makeDefault
          args={[
            (frustumSize * aspect) / -2,
            (frustumSize * aspect) / 2,
            frustumSize / 2,
            frustumSize / -2,
            -1000,
            1000,
          ]}
          position={[0, 0, 2]}
        />
        <Suspense fallback={null}>
          <Model />
        </Suspense>
      </Canvas>
      <article className="absolute w-full top-7  text-center">
        <h1 className="2xl:text-8xl text-md uppercase font-[500] text-white tracking-wide">
          Rehan Zinta
        </h1>
      </article>
      <article className="absolute w-full bottom-7  text-center">
        <h1
          ref={titleRef}
          className="2xl:text-8xl text-7xl tracking-tight uppercase font-[400] leading-[0.9]"
        >
          <div className="visual-line">{splitText("Visual")}</div>
          <div className="designer-line">{splitText("Designer")}</div>
        </h1>
        <p className="2xl:text-2xl text-lg font-[500] mt-4 text-white/90">
          Simple. Elegant. <br />
        </p>
        <div
          className="responsive-scroll mt-20 mx-auto opacity-80"
          ref={scrollRef}
        >
          <span className="scroll-thisico"></span>
        </div>
        <article className="absolute w-full bottom-0 right-32 text-center">
          <p className="2xl:text-2xl text-sm text-right font-[400] text-white/90">
            {currentTime.toLocaleDateString("en-US", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              timeZone: "Asia/Kolkata",
            })}
          </p>
        </article>
        <article className="absolute w-full bottom-0 left-32 text-center">
          <p className="2xl:text-2xl text-sm text-left font-[400] text-white/90">
            {currentTime.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              timeZone: "Asia/Kolkata",
            })}
          </p>
        </article>
      </article>
    </div>
  );
}
