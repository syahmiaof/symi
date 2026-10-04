import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger, useGSAP);
// Stable svh scenes must not rebuild when a phone's browser toolbar collapses.
ScrollTrigger.config({ ignoreMobileResize: true });
export { gsap, ScrollTrigger, useGSAP };
