"use client";
import { useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";

export default function MotionProvider({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      let lenis: Lenis | undefined;
      let alive = true;
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(el);
      const scrollTo = (top: number) => {
        if (lenis) lenis.scrollTo(top, { duration: 1.15 });
        else
          window.scrollTo({
            top,
            behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
              ? "instant"
              : "smooth",
          });
      };
      const requestedScroll = (event: Event) =>
        scrollTo((event as CustomEvent<number>).detail);
      const pause = (event: Event) => {
        if ((event as CustomEvent<boolean>).detail) lenis?.stop();
        else lenis?.start();
      };
      const anchors = (event: MouseEvent) => {
        const a = (event.target as Element).closest<HTMLAnchorElement>(
          'a[href^="#"]',
        );
        if (
          !a ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        const id = a.hash.slice(1);
        const target = document.getElementById(id);
        if (!target) return;
        event.preventDefault();
        requestAnimationFrame(() => {
          const pin = ScrollTrigger.getById(`${id}-pin`);
          const top = pin
            ? pin.start
            : target.getBoundingClientRect().top +
              window.scrollY -
              (id === "home" ? 0 : 78);
          history.pushState(null, "", `#${id}`);
          scrollTo(Math.max(0, top));
          target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
        });
      };
      window.addEventListener("symi:scroll", requestedScroll);
      window.addEventListener("symi:pause", pause);
      document.addEventListener("click", anchors);
      mm.add(
        {
          desktop: "(min-width: 1024px)",
          mobile: "(max-width: 767px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { desktop, mobile, reduce } = context.conditions!;
          if (desktop && !reduce) {
            lenis = new Lenis({
              autoRaf: false,
              smoothWheel: true,
              anchors: false,
              lerp: 0.09,
              syncTouch: false,
            });
            lenis.on("scroll", ScrollTrigger.update);
          }
          const tick = (time: number) => lenis?.raf(time * 1000);
          if (lenis) {
            gsap.ticker.add(tick);
            gsap.ticker.lagSmoothing(0);
          }
          if (!reduce) {
            const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
            intro
              .from(
                q(".hero h1 .line-mask > span"),
                { yPercent: 105, duration: 0.85, stagger: 0.09 },
                0,
              )
              .from(
                q(".hero-cup"),
                { y: 35, scale: 0.95, opacity: 0, duration: 0.95 },
                0.05,
              )
              .from(
                q(
                  ".hero-eyebrow, .hero-subtitle, .hero-description, .hero .button",
                ),
                { opacity: 0, y: 10, duration: 0.65, stagger: 0.06 },
                0.12,
              );
            gsap.to(q(".hero-product"), {
              y: mobile ? 30 : 90,
              rotation: mobile ? 0 : -3,
              ease: "none",
              scrollTrigger: {
                trigger: q(".hero")[0],
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            });
            const swirl = q(".swirl-scene")[0];
            const tl = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                id: "swirl-pin",
                trigger: swirl,
                start: "top top",
                end: () =>
                  `+=${window.innerHeight * (desktop ? 3 : mobile ? 1 : 1.5)}`,
                pin: true,
                scrub: 0.65,
                invalidateOnRefresh: true,
              },
            });
            tl.addLabel("assembled", 0)
              .to(
                q(".swirl-top"),
                { y: mobile ? -48 : -72, rotation: -3, duration: 1.5 },
                0.4,
              )
              .to(
                q(".swirl-vessel"),
                { y: mobile ? 46 : 68, rotation: -8, duration: 1.5 },
                0.4,
              )
              .to(
                q(".swirl-orbit"),
                { opacity: 0.35, scale: 1.12, rotation: 35, duration: 1.8 },
                0.4,
              )
              .to(
                q(".sauce-ribbon"),
                { opacity: 0.85, rotation: -12, scale: 1.07, duration: 1.2 },
                0.8,
              );
            q(".swirl-particle").forEach((particle: HTMLElement, i: number) => {
              if (mobile && i > 5) return;
              tl.fromTo(
                particle,
                { x: 0, y: 0, scale: 0.35, opacity: 0 },
                {
                  x: () =>
                    Number(particle.dataset.x) *
                    (mobile ? 0.42 : window.innerWidth < 1200 ? 0.75 : 1),
                  y: () =>
                    Number(particle.dataset.y) *
                    (mobile ? 0.52 : window.innerWidth < 1200 ? 0.72 : 0.9),
                  rotation: Number(particle.dataset.rotation),
                  scale: mobile ? 0.65 : window.innerWidth < 1200 ? 0.8 : 1,
                  opacity: 1,
                  duration: 1.5,
                },
                0.55 + i * 0.025,
              );
            });
            tl.to(
              q(".callout"),
              { opacity: 1, y: 0, stagger: 0.1, duration: 0.6 },
              1.3,
            )
              .addLabel("hero-frame", 2.4)
              .to(q(".swirl-orbit"), { rotation: 65, duration: 1.3 }, 2.4)
              .to(q(".callout"), { opacity: 0, duration: 0.4 }, 3.8)
              .to(
                q(".swirl-particle"),
                {
                  x: 0,
                  y: 0,
                  rotation: 0,
                  scale: 0.35,
                  opacity: 0,
                  duration: 1.3,
                },
                3.9,
              )
              .to(
                q(".sauce-ribbon"),
                { opacity: 0, scale: 0.7, duration: 0.7 },
                3.9,
              )
              .to(
                q(".swirl-top, .swirl-vessel"),
                { y: 0, rotation: 0, duration: 1.3 },
                3.9,
              )
              .to(
                q(".swirl-orbit"),
                { opacity: 0, scale: 1, duration: 0.6 },
                4.3,
              )
              .addLabel("reassembled", 5.2)
              .to({}, { duration: 0.4 });
            gsap.fromTo(
              q(".scene-progress i"),
              { scaleX: 0 },
              {
                scaleX: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: swirl,
                  start: () => tl.scrollTrigger!.start,
                  end: () => tl.scrollTrigger!.end,
                  scrub: true,
                },
              },
            );
            if (desktop) {
              const track = q(".flavor-track")[0] as HTMLElement;
              gsap.to(track, {
                x: () => -(track.scrollWidth - window.innerWidth),
                ease: "none",
                scrollTrigger: {
                  id: "flavors-pin",
                  trigger: q(".flavor-scene")[0],
                  start: "top top",
                  end: () => `+=${window.innerHeight * 3.3}`,
                  pin: true,
                  scrub: 0.7,
                  invalidateOnRefresh: true,
                  onUpdate: (self) => {
                    const current = el.querySelector(".flavor-current");
                    if (current)
                      current.textContent = String(
                        Math.round(self.progress * 3) + 1,
                      ).padStart(2, "0");
                    gsap.set(q(".flavor-progress i"), {
                      scaleX: 0.25 + self.progress * 0.75,
                    });
                  },
                },
              });
            }
            gsap.fromTo(
              q(".flow-line-one"),
              { xPercent: -10 },
              {
                xPercent: 3,
                ease: "none",
                scrollTrigger: {
                  trigger: q(".ingredient-flow")[0],
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
            gsap.fromTo(
              q(".flow-line-two"),
              { xPercent: 4 },
              {
                xPercent: -12,
                ease: "none",
                scrollTrigger: {
                  trigger: q(".ingredient-flow")[0],
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
            gsap.fromTo(
              q(".story-photo img"),
              { scale: 1.12 },
              {
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: q(".story-section")[0],
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
            q(".experience-gallery figure").forEach(
              (figure: HTMLElement, i: number) => {
                gsap.from(figure, {
                  y: mobile ? 25 : i % 2 ? 100 : 55,
                  rotation: mobile ? 0 : i % 2 ? 2 : -2,
                  ease: "none",
                  scrollTrigger: {
                    trigger: figure,
                    start: "top 95%",
                    end: "top 35%",
                    scrub: 1,
                  },
                });
              },
            );
            gsap.from(q(".final-leaf"), {
              rotation: -35,
              scale: 0.6,
              opacity: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: q(".final-brand")[0],
                start: "top 65%",
                once: true,
              },
            });
          }
          const track = el.querySelector<HTMLElement>(".flavor-track");
          const nativeProgress = () => {
            if (desktop && !reduce) return;
            if (!track) return;
            const panel = track.querySelector<HTMLElement>(".flavor-panel");
            if (!panel) return;
            const index = Math.min(
              3,
              Math.round(track.scrollLeft / (panel.offsetWidth + 16)),
            );
            const current = el.querySelector(".flavor-current");
            if (current)
              current.textContent = String(index + 1).padStart(2, "0");
            const bar = el.querySelector<HTMLElement>(".flavor-progress i");
            if (bar) bar.style.transform = `scaleX(${(index + 1) / 4})`;
          };
          track?.addEventListener("scroll", nativeProgress, { passive: true });
          return () => {
            track?.removeEventListener("scroll", nativeProgress);
            gsap.ticker.remove(tick);
            lenis?.destroy();
            lenis = undefined;
          };
        },
      );
      const refresh = () => {
        if (alive) {
          ScrollTrigger.sort();
          ScrollTrigger.refresh();
        }
      };
      const images = Array.from(
        el.querySelectorAll<HTMLImageElement>("img"),
      ).filter((image) => image.loading !== "lazy");
      Promise.all([
        document.fonts.ready,
        ...images.map((image) => image.decode().catch(() => undefined)),
      ]).then(refresh);
      const header = document.querySelector(".site-header");
      const onScroll = () =>
        header?.classList.toggle("is-scrolled", window.scrollY > 40);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => {
        alive = false;
        mm.revert();
        window.removeEventListener("scroll", onScroll);
        document.removeEventListener("click", anchors);
        window.removeEventListener("symi:scroll", requestedScroll);
        window.removeEventListener("symi:pause", pause);
      };
    },
    { scope: root },
  );
  return <div ref={root}>{children}</div>;
}
