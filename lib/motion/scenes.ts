import { gsap, ScrollTrigger } from "./gsap";

/** Native coordinates are the approved PNG keyframe; transforms only describe the journey. */
export function createExplosion(root: HTMLElement, pin: boolean) {
  const scene = root.querySelector<HTMLElement>(".swirl-scene")!;
  const stage = root.querySelector<HTMLElement>(".swirl-stage")!;
  const layers = gsap.utils.toArray<HTMLElement>(".explosion-layer", root);
  const callouts = root.querySelectorAll(".callout");
  const attachedFruit = (layer: HTMLElement) =>
    ["kiwi-left", "kiwi-right"].includes(layer.dataset.layer!);
  if (!pin) {
    gsap.from(
      layers.filter(
        (layer) =>
          ["kiwi", "leaf", "granola"].includes(layer.dataset.kind!) &&
          !attachedFruit(layer),
      ),
      {
        y: 14,
        rotation: 3,
        stagger: 0.012,
        ease: "none",
        scrollTrigger: {
          trigger: scene,
          start: "top 65%",
          end: "center 45%",
          scrub: 0.25,
        },
      },
    );
    return;
  }
  const assembled = root.querySelector(".swirl-assembled");
  const tl = gsap.timeline({
    defaults: { ease: "power2.inOut" },
    scrollTrigger: {
      id: "swirl-pin",
      trigger: scene,
      start: "top top",
      end: () => `+=${innerHeight * 1.9}`,
      pin: true,
      anticipatePin: 1,
      scrub: 0.3,
      invalidateOnRefresh: true,
    },
  });
  const travel = (layer: HTMLElement) => {
    const kind = layer.dataset.kind;
    const cx = Number(layer.dataset.centerX),
      cy = Number(layer.dataset.centerY);
    // Attached photographic surfaces share the stage transform so their seams
    // stay joined. Floating ingredients have their own outward trajectories.
    if (["yogurt", "cup", "sauce"].includes(kind!) || attachedFruit(layer))
      return { x: 0, y: 0, scale: 1, rotation: 0 };
    return {
      x: (((52 - cx) * stage.clientWidth) / 100) * 0.76,
      y: (((48 - cy) * stage.clientHeight) / 100) * 0.72,
      scale: kind === "kiwi" ? 0.48 : 0.2,
      rotation: (cx < 50 ? 1 : -1) * (kind === "sauce" ? 22 : 48),
    };
  };
  tl.set(callouts, { autoAlpha: 0 }).set(layers, { opacity: 0 });
  tl.fromTo(
    stage,
    { scale: 0.72, y: () => stage.clientHeight * 0.12, rotation: -10 },
    { scale: 1, y: 0, rotation: 0, duration: 2.2 },
    1,
  ).to(
    stage,
    {
      scale: 0.72,
      y: () => stage.clientHeight * 0.12,
      rotation: -10,
      duration: 1.7,
    },
    7.25,
  );
  tl.fromTo(
    assembled,
    { opacity: 1, y: 18, rotation: 0 },
    { y: 0, rotation: -4, duration: 1 },
    0,
  );
  layers.forEach((layer, i) => {
    const core =
      layer.dataset.kind === "cup" || layer.dataset.kind === "yogurt";
    const start = core ? 1 : 1.15 + (i % 6) * 0.09;
    tl.fromTo(
      layer,
      {
        x: () => travel(layer).x,
        y: () => travel(layer).y,
        scale: () => travel(layer).scale,
        rotation: () => travel(layer).rotation,
      },
      {
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: core ? 2.05 : 2.35,
        ease: core ? "power2.inOut" : "power3.out",
      },
      start,
    );
    tl.to(layer, { opacity: 1, duration: 0.22, ease: "power1.out" }, start);
    // Return along the same paths, rather than fading the whole photograph away.
    tl.to(
      layer,
      {
        x: () => travel(layer).x,
        y: () => travel(layer).y,
        scale: () => travel(layer).scale,
        rotation: () => travel(layer).rotation,
        opacity: 1,
        duration: 1.7,
        ease: "power2.inOut",
      },
      7.25 + (i % 4) * 0.05,
    );
    tl.to(layer, { opacity: 0, duration: 0.35 }, 8.7);
  });
  tl.to(assembled, { opacity: 0, duration: 0.3 }, 1.05)
    .fromTo(
      callouts,
      { autoAlpha: 0, y: 7 },
      { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.07 },
      3.25,
    )
    .addLabel("reference", 4.1)
    .to({}, { duration: 2.4 }, 4.1)
    .to(callouts, { autoAlpha: 0, y: 4, duration: 0.45, stagger: 0.03 }, 6.9)
    .to(assembled, { opacity: 1, rotation: 0, y: 0, duration: 0.65 }, 8.55)
    .to({}, { duration: 0.6 }, 9.25);
  gsap.fromTo(
    root.querySelector(".explosion-progress i"),
    { scaleY: 0 },
    {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        trigger: scene,
        start: () => tl.scrollTrigger!.start,
        end: () => tl.scrollTrigger!.end,
        scrub: true,
      },
    },
  );
  return tl;
}

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
