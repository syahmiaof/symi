import { gsap, ScrollTrigger } from "./gsap";

export function createFlavorJourney(root: HTMLElement) {
  const track = root.querySelector<HTMLElement>(".flavor-track")!;
  const scene = root.querySelector<HTMLElement>(".flavor-scene")!;
  const panels = Array.from(
    track.querySelectorAll<HTMLElement>(".flavor-panel"),
  );
  const stride = () =>
    panels[0].offsetWidth +
    (parseFloat(getComputedStyle(track).columnGap) || 0);
  const setProgress = (progress: number) => {
    const index = Math.round(progress * 3);
    root.querySelectorAll(".flavor-current").forEach((el) => {
      el.textContent = String(index + 1).padStart(2, "0");
    });
    track.dataset.active = String(index);
    if (
      track.dataset.targetIndex !== undefined &&
      Math.abs(progress * 3 - Number(track.dataset.targetIndex)) < 0.02
    )
      delete track.dataset.targetIndex;
    (root.querySelector(".flavor-progress") as HTMLElement)?.style.setProperty(
      "--progress",
      `${25 + progress * 75}%`,
    );
  };
  const animation = gsap.to(track, {
    x: () => -stride() * 3,
    ease: "none",
    scrollTrigger: {
      id: "flavors-pin",
      trigger: scene,
      start: "top top",
      end: () => `+=${Math.max(stride() * 3, innerHeight * 1.8)}`,
      pin: true,
      anticipatePin: 1,
      scrub: 0.32,
      invalidateOnRefresh: true,
      onUpdate: (self) => setProgress(self.progress),
    },
  });
  // Tiny depth offset inside each world; the leading composition stays at its exact reference coordinates.
  panels.forEach((panel, index) => {
    const product = panel.querySelector(".flavor-product");
    gsap.fromTo(
      product,
      { x: 0 },
      {
        x: 18,
        ease: "none",
        scrollTrigger: {
          trigger: panel,
          containerAnimation: animation,
          start: "left left",
          end: "right left",
          scrub: true,
        },
      },
    );
    if (index > 0)
      gsap.fromTo(
        panel.querySelector(".flavor-number"),
        { opacity: 0.6 },
        {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: panel,
            containerAnimation: animation,
            start: "left 70%",
            end: "left 30%",
            scrub: true,
          },
        },
      );
  });
  return animation;
}

export function scrollAnchor(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  const pin = ScrollTrigger.getById(
    `${id === "flavor-track" ? "flavors" : id}-pin`,
  );
  const offset = ["home", "swirl", "flavors", "story"].includes(id) ? 0 : 88;
  return {
    target,
    top: Math.max(
      0,
      pin ? pin.start : target.getBoundingClientRect().top + scrollY - offset,
    ),
  };
}
