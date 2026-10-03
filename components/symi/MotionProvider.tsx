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
        if (lenis) lenis.scrollTo(top, { duration: 1 });
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
          const offset = ["home", "swirl", "flavors", "story"].includes(id)
            ? 0
            : 90;
          scrollTo(
            Math.max(
              0,
              pin
                ? pin.start
                : target.getBoundingClientRect().top + window.scrollY - offset,
            ),
          );
          history.pushState(null, "", `#${id}`);
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
          mobile: "(max-width: 1023px)",
          reduce: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { desktop, reduce } = context.conditions!;
          const tick = (time: number) => lenis?.raf(time * 1000);
          if (desktop && !reduce) {
            lenis = new Lenis({
              autoRaf: false,
              smoothWheel: true,
              anchors: false,
              lerp: 0.1,
            });
            lenis.on("scroll", ScrollTrigger.update);
            gsap.ticker.add(tick);
            gsap.ticker.lagSmoothing(0);
          }
          if (!reduce) {
            gsap.from(q(".hero h1 .line-mask>span"), {
              y: 18,
              opacity: 0,
              duration: 0.65,
              stagger: 0.07,
              ease: "power2.out",
            });
            gsap.from(q(".hero-cup"), {
              y: 16,
              opacity: 0,
              duration: 0.8,
              ease: "power2.out",
            });
            if (desktop) {
              const tl = gsap.timeline({
                scrollTrigger: {
                  id: "swirl-pin",
                  trigger: q(".swirl-scene")[0],
                  start: "top top",
                  end: () => `+=${innerHeight * 2.2}`,
                  pin: true,
                  scrub: 0.55,
                  invalidateOnRefresh: true,
                },
              });
              tl.fromTo(
                q(".swirl-assembled"),
                { y: 18, opacity: 1 },
                { y: 0, opacity: 1, duration: 0.35 },
              )
                .to(q(".swirl-assembled"), { opacity: 0, duration: 0.5 }, 0.35)
                .fromTo(
                  q(".swirl-top"),
                  { yPercent: 13, scale: 0.88, opacity: 0 },
                  {
                    yPercent: 0,
                    scale: 1,
                    opacity: 1,
                    duration: 0.75,
                    ease: "power2.out",
                  },
                  0.4,
                )
                .fromTo(
                  q(".swirl-vessel"),
                  { yPercent: -7, scale: 0.9, opacity: 0 },
                  {
                    yPercent: 0,
                    scale: 1,
                    opacity: 1,
                    duration: 0.75,
                    ease: "power2.out",
                  },
                  0.4,
                )
                .fromTo(
                  q(".callout"),
                  { opacity: 0 },
                  { opacity: 1, duration: 0.35, stagger: 0.06 },
                  0.85,
                )
                .to({}, { duration: 1.8 })
                .to(q(".callout"), { opacity: 0, duration: 0.3 })
                .to(
                  q(".swirl-top"),
                  { yPercent: 10, scale: 0.9, opacity: 0, duration: 0.65 },
                  ">-.1",
                )
                .to(
                  q(".swirl-vessel"),
                  { yPercent: -6, scale: 0.94, opacity: 0, duration: 0.65 },
                  "<",
                )
                .to(
                  q(".swirl-assembled"),
                  { opacity: 1, duration: 0.5 },
                  "<.15",
                );
              const track = q(".flavor-track")[0] as HTMLElement;
              gsap.to(track, {
                x: () =>
                  -Math.max(
                    0,
                    track.scrollWidth - innerWidth - innerWidth * 0.03,
                  ),
                ease: "none",
                scrollTrigger: {
                  id: "flavors-pin",
                  trigger: q(".flavor-scene")[0],
                  start: "top top",
                  end: () => `+=${innerHeight * 1.25}`,
                  pin: true,
                  scrub: 0.55,
                  invalidateOnRefresh: true,
                  onUpdate: (self) => {
                    const current = el.querySelector(".flavor-current");
                    if (current)
                      current.textContent = String(
                        Math.round(self.progress * 3) + 1,
                      ).padStart(2, "0");
                  },
                },
              });
            }
          }
          const track = el.querySelector<HTMLElement>(".flavor-track");
          const nativeProgress = () => {
            if ((desktop && !reduce) || !track) return;
            const panel = track.querySelector<HTMLElement>(".flavor-panel");
            if (!panel) return;
            const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
            const current = el.querySelector(".flavor-current");
            if (current)
              current.textContent = String(
                Math.min(
                  3,
                  Math.round(track.scrollLeft / (panel.offsetWidth + gap)),
                ) + 1,
              ).padStart(2, "0");
          };
          const keyboard = (event: KeyboardEvent) => {
            if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
            event.preventDefault();
            const buttons = el.querySelectorAll<HTMLButtonElement>(
              ".flavor-controls button",
            );
            buttons[event.key === "ArrowRight" ? 1 : 0]?.click();
          };
          track?.addEventListener("scroll", nativeProgress, { passive: true });
          track?.addEventListener("keydown", keyboard);
          return () => {
            track?.removeEventListener("scroll", nativeProgress);
            track?.removeEventListener("keydown", keyboard);
            gsap.ticker.remove(tick);
            lenis?.destroy();
            lenis = undefined;
          };
        },
      );
      const header = el.querySelector(".site-header");
      const onScroll = () => {
        header?.classList.toggle("is-scrolled", scrollY > 40);
        const y = scrollY + 95;
        const inSection = (id: string) => {
          const section = document.getElementById(id);
          if (!section) return false;
          const box = section.getBoundingClientRect();
          return box.top + scrollY <= y && box.bottom + scrollY > y;
        };
        header?.classList.toggle(
          "is-light",
          innerWidth < 768 &&
            (inSection("flavors") || inSection("story") || inSection("launch")),
        );
        header?.classList.toggle(
          "on-cream",
          inSection("story") || inSection("launch"),
        );
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      Promise.all([
        document.fonts.ready,
        ...Array.from(
          el.querySelectorAll<HTMLImageElement>('img[loading="eager"]'),
        ).map((image) => image.decode().catch(() => undefined)),
      ]).then(() => {
        if (alive) {
          ScrollTrigger.sort();
          ScrollTrigger.refresh();
          onScroll();
        }
      });
      return () => {
        alive = false;
        mm.revert();
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        window.removeEventListener("symi:scroll", requestedScroll);
        window.removeEventListener("symi:pause", pause);
        document.removeEventListener("click", anchors);
      };
    },
    { scope: root },
  );
  return <div ref={root}>{children}</div>;
}
