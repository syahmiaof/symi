import { gsap } from "./gsap";

/** A bounded brand introduction, followed by (never covering) the hero intro. */
export function createWelcomeJourney(root: HTMLElement) {
  const screen = root.querySelector<HTMLElement>(".welcome-screen")!;
  const content = root.querySelector<HTMLElement>(".site-content")!;
  const button = screen.querySelector<HTMLButtonElement>("button")!;
  let alive = true;
  let closing = false;
  let exit: gsap.core.Tween | undefined;
  let releaseInput = () => {};
  let complete: () => void;
  const ready = new Promise<void>((resolve) => {
    complete = resolve;
  });
  const finish = () => {
    releaseInput();
    screen.hidden = true;
    content.inert = false;
    delete root.dataset.welcoming;
    if (screen.contains(document.activeElement)) button.blur();
    complete();
  };
  const skip =
    matchMedia("(prefers-reduced-motion: reduce)").matches ||
    Boolean(location.hash) ||
    scrollY > 40 ||
    (
      performance.getEntriesByType("navigation")[0] as
        PerformanceNavigationTiming | undefined
    )?.type === "back_forward";
  if (skip) {
    finish();
    return { ready, cleanup: () => undefined };
  }
  root.dataset.welcoming = "true";
  screen.hidden = false;
  content.inert = true;
  // Keep scroll geometry stable; block gestures rather than changing body height.
  const blockScroll = (event: Event) => {
    if (!screen.hidden) event.preventDefault();
  };
  const dismiss = () => {
    if (closing || !alive) return;
    closing = true;
    exit = gsap.to(screen, {
      yPercent: -100,
      duration: 0.85,
      ease: "power3.inOut",
      onComplete: finish,
    });
  };
  const keydown = (event: KeyboardEvent) => {
    if (screen.hidden) return;
    if (event.key === "Escape") dismiss();
    if (
      [
        "ArrowDown",
        "ArrowUp",
        "PageDown",
        "PageUp",
        "Home",
        "End",
        " ",
      ].includes(event.key) &&
      (event.target !== button || event.key !== " ")
    )
      event.preventDefault();
  };
  window.addEventListener("wheel", blockScroll, { passive: false });
  window.addEventListener("touchmove", blockScroll, { passive: false });
  window.addEventListener("keydown", keydown);
  button.addEventListener("click", dismiss);
  releaseInput = () => {
    window.removeEventListener("wheel", blockScroll);
    window.removeEventListener("touchmove", blockScroll);
    window.removeEventListener("keydown", keydown);
    button.removeEventListener("click", dismiss);
  };
  gsap.fromTo(
    screen.querySelectorAll(".welcome-content > *"),
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.85, stagger: 0.1, ease: "power2.out" },
  );
  gsap.fromTo(
    screen.querySelector(".welcome-orbit"),
    { rotation: -25, scale: 0.9, opacity: 0 },
    { rotation: 12, scale: 1, opacity: 1, duration: 2.4, ease: "power2.out" },
  );
  let timer: ReturnType<typeof setTimeout>;
  const boundedAssets = Promise.race([
    Promise.all([
      document.fonts.ready,
      root
        .querySelector<HTMLImageElement>(".hero-cup")!
        .decode()
        .catch(() => undefined),
    ]),
    new Promise<void>((resolve) => {
      timer = setTimeout(resolve, 1200);
    }),
  ]);
  const minimum = gsap.delayedCall(1.6, () => {
    void boundedAssets.then(() => {
      if (alive) dismiss();
    });
  });
  return {
    ready,
    cleanup: () => {
      alive = false;
      clearTimeout(timer);
      minimum.kill();
      exit?.kill();
      finish();
    },
  };
}
