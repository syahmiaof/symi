"use client";
import { useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion/gsap";
import {
  createExplosion,
  createFlavorJourney,
  scrollAnchor,
} from "@/lib/motion/scenes";
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
          const anchor = scrollAnchor(id);
          if (!anchor) return;
          scrollTo(anchor.top);
          history.pushState(null, "", `#${id}`);
          target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
        });
      };
      const restoreHash = () => {
        const anchor = scrollAnchor(location.hash.slice(1));
        if (anchor) scrollTo(anchor.top);
      };
      window.addEventListener("popstate", restoreHash);
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
              gsap.to(q(".hero-product"), {
                y: 12,
                ease: "none",
                scrollTrigger: {
                  trigger: q(".hero")[0],
                  start: "top top",
                  end: "bottom top",
                  scrub: 0.3,
                },
              });
              gsap.from(q(".story-interior"), {
                clipPath: "inset(0 0 9% 0)",
                ease: "none",
                scrollTrigger: {
                  trigger: q(".story-section")[0],
                  start: "top 90%",
                  end: "top 35%",
                  scrub: 0.3,
                },
              });
            }
            createExplosion(el, Boolean(desktop));
            if (desktop) createFlavorJourney(el);
          }
          const track = el.querySelector<HTMLElement>(".flavor-track");
          const nativeProgress = () => {
            if ((desktop && !reduce) || !track) return;
            const panel = track.querySelector<HTMLElement>(".flavor-panel");
            if (!panel) return;
            const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
            const position = track.scrollLeft / (panel.offsetWidth + gap);
            if (
              track.dataset.targetIndex !== undefined &&
              Math.abs(position - Number(track.dataset.targetIndex)) < 0.02
            )
              delete track.dataset.targetIndex;
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
          const clearTarget = () => {
            if (track) delete track.dataset.targetIndex;
          };
          window.addEventListener("wheel", clearTarget, { passive: true });
          track?.addEventListener("touchstart", clearTarget, { passive: true });
          track?.addEventListener("scroll", nativeProgress, { passive: true });
          track?.addEventListener("keydown", keyboard);
          return () => {
            window.removeEventListener("wheel", clearTarget);
            track?.removeEventListener("touchstart", clearTarget);
            track?.removeEventListener("scroll", nativeProgress);
            track?.removeEventListener("keydown", keyboard);
            gsap.ticker.remove(tick);
            lenis?.destroy();
            lenis = undefined;
          };
        },
      );
      const header = el.querySelector(".site-header");
      let boundaries: { id: string; top: number; bottom: number }[] = [];
      const cacheBoundaries = () => {
        boundaries = ["flavors", "story", "launch", "story-preview"].flatMap(
          (id) => {
            const section = document.getElementById(id);
            if (!section) return [];
            const box = section.getBoundingClientRect();
            return [
              { id, top: box.top + scrollY, bottom: box.bottom + scrollY },
            ];
          },
        );
      };
      const onScroll = () => {
        const y = scrollY + 95;
        const active = boundaries.find(
          (section) => section.top <= y && section.bottom > y,
        )?.id;
        header?.classList.toggle("is-scrolled", scrollY > 40);
        header?.classList.toggle(
          "is-light",
          innerWidth < 768 && Boolean(active),
        );
        header?.classList.toggle(
          "on-cream",
          active === "story" ||
            active === "launch" ||
            active === "story-preview",
        );
      };
      const refreshed = () => {
        cacheBoundaries();
        onScroll();
      };
      ScrollTrigger.addEventListener("refresh", refreshed);
      cacheBoundaries();
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", refreshed);
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
          if (location.hash) restoreHash();
        }
      });
      return () => {
        alive = false;
        mm.revert();
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", refreshed);
        window.removeEventListener("popstate", restoreHash);
        ScrollTrigger.removeEventListener("refresh", refreshed);
        window.removeEventListener("symi:scroll", requestedScroll);
        window.removeEventListener("symi:pause", pause);
        document.removeEventListener("click", anchors);
      };
    },
    { scope: root },
  );
  return <div ref={root}>{children}</div>;
}
