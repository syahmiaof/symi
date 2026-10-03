"use client";
import { Arrow } from "./Brand";
import { ScrollTrigger } from "@/lib/motion/gsap";

export default function FlavorControls() {
  function move(direction: number) {
    const track = document.querySelector<HTMLElement>(".flavor-track");
    if (!track) return;
    const trigger = ScrollTrigger.getById("flavors-pin");
    if (trigger) {
      const index = Math.round(trigger.progress * 3);
      const next = Math.min(3, Math.max(0, index + direction));
      window.dispatchEvent(
        new CustomEvent("symi:scroll", {
          detail: trigger.start + ((trigger.end - trigger.start) * next) / 3,
        }),
      );
    } else {
      const panel = track.querySelector<HTMLElement>(".flavor-panel");
      if (!panel) return;
      const width =
        panel.offsetWidth +
        (parseFloat(getComputedStyle(track).columnGap) || 0);
      const next = Math.min(
        3,
        Math.max(0, Math.round(track.scrollLeft / width) + direction),
      );
      track.scrollTo({
        left: next * width,
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    }
  }
  return (
    <div className="flavor-controls">
      <button onClick={() => move(-1)} aria-label="Previous flavor">
        <Arrow direction="left" />
      </button>
      <button onClick={() => move(1)} aria-label="Next flavor">
        <Arrow />
      </button>
    </div>
  );
}
