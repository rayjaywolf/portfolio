import "./style.css";
import gsap from "gsap/gsap-core";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const tl = gsap.timeline({});
tl.from(".video", {
  duration: 1.5,
  width: "120px",
  opacity: 0,
  borderRadius: "1000px",
  ease: "power4.inOut",
});
tl.to(
  ".text h1",
  {
    duration: 0.75,
    y: 0,
    stagger: 0.3,
    // ease: "power4.inOut",
  },
  "<0.5"
);

const rotate = gsap.timeline({});
rotate.to(".round", {
  duration: 10,
  rotate: 360,
  repeat: -1,
  ease: "none",
});

tl2.to(".text .left", {
  // duration: 0.5,
  x: "-100%",
  opacity: 0,
  skewX: 20,
  ease: "power4.Out",
});

tl2.to(
  ".text .right",
  {
    // duration: 0.5,
    x: "100%",
    opacity: 0,
    skewX: 20,
    ease: "power4.Out",
  },
  "<"
);

const tl3 = gsap.timeline({ paused: true });

tl3.to(".loading", {
  height: 1000,
  duration: 0.8,
  ease: "power4.inOut",
});

const right = document.querySelector(".right");

right.addEventListener("click", () => {
  tl3.play();
  const scale = gsap.timeline({});
  scale.to(".hero-text", {
    duration: 0.5,
    scale: 0.9,
    ease: "power4.Out",
  });
  setTimeout(() => {
    window.location.href = "page.html";
  }, 1000);
});
