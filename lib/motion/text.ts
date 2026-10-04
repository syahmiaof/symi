import { SplitText } from "gsap/SplitText";
import { gsap, ScrollTrigger } from "./gsap";

gsap.registerPlugin(SplitText);

const copySelector = [
  "main h1",
  "main h2",
  "main h3",
  "main p",
  "main .button",
  ".benefits li > span",
  ".brand-stamp > span",
  ".hero-flavor-note > em",
  ".hero-flavor-note > span",
  ".story-handwritten",
  ".staff-stamp > span",
  ".story-product figcaption",
  ".story-gallery figcaption",
  ".mobile-brand-statements > span",
  ".mobile-flavor-art > em",
  ".mobile-flavor-art > span",
  ".callout strong",
  ".scroll-cue",
  ".flavor-intro > a",
  ".final-brand-line .wordmark > span",
  ".final-brand-line .wordmark > small",
  ".site-footer > span",
  ".site-footer > a",
].join(",");

/** Text retains its layout and accessible name; only its visual words move. */
export function createTextJourney(root: HTMLElement, pinnedScenes: boolean) {
  const targets = Array.from(
    root.querySelectorAll<HTMLElement>(copySelector),
  ).filter((el) => el.getClientRects().length && el.textContent?.trim());
  const track = root.querySelector<HTMLElement>(".flavor-track")!;
  const flavorAnimation = ScrollTrigger.getById("flavors-pin")?.animation;

  const intro = gsap.timeline({ paused: true });
  let alive = true;
  targets.forEach((element, index) => {
    const heading = /^H[123]$/.test(element.tagName);
    const label = element.matches(".eyebrow, .launch-date, .callout strong");
    const interactive = element.matches("a");
    const panel = element.closest<HTMLElement>(".flavor-panel");
    const pinned =
      pinnedScenes && element.closest(".swirl-scene, .flavor-scene");
    const pin = pinned
      ? ScrollTrigger.getById(
          element.closest(".swirl-scene") ? "swirl-pin" : "flavors-pin",
        )
      : undefined;
    const top = () => element.getBoundingClientRect().top + window.scrollY;
    const height = () => element.offsetHeight;
    const hero = Boolean(element.closest(".hero"));
    const readableLabel = element.innerText;
    element.dataset.textMotion = label ? "type" : heading ? "headline" : "copy";

    // Interactive elements retain their nested SVG and accessible link semantics.
    const variants = element.querySelectorAll<HTMLElement>(
      ".desktop-flavor-title, .mobile-flavor-title",
    );
    const split =
      interactive || variants.length
        ? undefined
        : SplitText.create(element, {
            type: label ? "words,chars" : "words",
            tag: "symi-text",
            wordsClass: "motion-word",
            charsClass: "motion-char",
            ignore: "svg, .desktop-flavor-title, .mobile-flavor-title",
            aria: "none",
          });
    // Responsive heading variants retain their CSS display rules.
    const variantSplits = Array.from(variants)
      .filter((variant) => variant.getClientRects().length)
      .map((variant) =>
        SplitText.create(variant, {
          type: "words",
          tag: "symi-text",
          wordsClass: "motion-word",
          aria: "none",
        }),
      );
    const units = variantSplits.length
      ? variantSplits.flatMap((s) => s.words)
      : split
        ? label
          ? split.chars
          : split.words
        : [element];
    if (!units.length) return;
    if (label && split) {
      split.words.forEach((word) => word.setAttribute("aria-hidden", "true"));
      const accessibleCopy = document.createElement("symi-text");
      accessibleCopy.className = "motion-sr-only";
      accessibleCopy.textContent = readableLabel;
      element.append(accessibleCopy);
    }
    const enter = gsap.timeline({ paused: true });
    enter.fromTo(
      units,
      {
        opacity: 0,
        yPercent: label ? 0 : heading ? 55 : 22,
        rotationX: heading ? -12 : 0,
        transformOrigin: "50% 100%",
      },
      {
        opacity: 1,
        yPercent: 0,
        rotationX: 0,
        duration: label ? 0.035 : heading ? 1.25 : 1.1,
        stagger: { amount: label ? 0.9 : heading ? 0.22 : 0.15 },
        ease: label ? "steps(1)" : "power2.out",
      },
    );
    if (hero) {
      const delay = element.matches("h1")
        ? 0.35
        : element.matches(".eyebrow")
          ? 0.15
          : element.matches(".hero-subtitle")
            ? 0.75
            : element.matches(".hero-description")
              ? 0.95
              : 1.15;
      intro.add(enter.play(), delay);
    } else {
      let inSection = false;
      let inPanel = !panel;
      const sync = () => {
        if (inSection && inPanel) enter.play();
        else enter.reverse();
      };
      const section = panel
        ? root.querySelector<HTMLElement>(".flavor-scene")!
        : element;
      ScrollTrigger.create({
        id: `text-${index}`,
        trigger: section,
        start: () =>
          pin
            ? pin.start - innerHeight * 0.25
            : Math.min(
                section.getBoundingClientRect().top +
                  scrollY -
                  innerHeight * 0.7,
                ScrollTrigger.maxScroll(window) - innerHeight * 0.3,
              ),
        end: () =>
          pin
            ? pin.end + innerHeight * 0.5
            : top() + height() + innerHeight * 0.2,
        onToggle: (self) => {
          inSection = self.isActive;
          sync();
        },
        onRefresh: (self) => {
          inSection = self.isActive;
          sync();
        },
      });
      if (panel) {
        ScrollTrigger.create({
          trigger: panel,
          ...(flavorAnimation
            ? { containerAnimation: flavorAnimation }
            : { scroller: track, horizontal: true }),
          start: "left 94%",
          end: "right 6%",
          onToggle: (self) => {
            inPanel = self.isActive;
            sync();
          },
          onRefresh: (self) => {
            inPanel = self.isActive;
            sync();
          },
        });
      }
    }
    // Exit has a separate parent transform, leaving the word reveal uninterrupted.
    // Footer content stays legible at the document boundary.
    if (!panel && !element.closest(".final-brand, .site-footer")) {
      gsap.fromTo(
        element,
        { y: 0, opacity: 1 },
        {
          y: -18,
          opacity: 0,
          immediateRender: false,
          ease: "none",
          scrollTrigger: {
            id: `text-exit-${index}`,
            trigger: element,
            start: () =>
              pin ? pin.end - innerHeight * 0.12 : top() + height() - 130,
            end: () =>
              pin ? pin.end + innerHeight * 0.28 : top() + height() - 30,
            scrub: 0.65,
          },
        },
      );
    }
  });
  intro.fromTo(
    root.querySelector(".hero-cup"),
    { opacity: 0, y: 65, rotation: -7, scale: 0.92 },
    {
      opacity: 1,
      y: 0,
      rotation: 0,
      scale: 1,
      duration: 1.7,
      ease: "power3.out",
    },
    0.2,
  );
  intro.fromTo(
    root.querySelector(".hero-backdrop"),
    { scale: 1.045 },
    { scale: 1, duration: 2.3, ease: "power2.out" },
    0,
  );
  intro.fromTo(
    root.querySelectorAll(
      ".hero > .brand-stamp, .hero .benefits svg, .hero-bottom",
    ),
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.9, stagger: 0.04, ease: "power2.out" },
    1.15,
  );
  intro.fromTo(
    root.querySelectorAll(
      ".site-header .wordmark, .desktop-nav a, .launch-link",
    ),
    { opacity: 0, y: -12 },
    { opacity: 1, y: 0, stagger: 0.045, duration: 0.8, ease: "power2.out" },
    0,
  );
  const finishIntro = (event: Event) => {
    if (
      event instanceof KeyboardEvent &&
      !["ArrowDown", "PageDown", "End", " "].includes(event.key)
    )
      return;
    intro.progress(1);
  };
  // Pin refresh may briefly change scrollY. Only user input interrupts the intro.
  window.addEventListener("wheel", finishIntro, { passive: true });
  window.addEventListener("touchmove", finishIntro, { passive: true });
  window.addEventListener("keydown", finishIntro);
  Promise.race([
    Promise.all([
      document.fonts.ready,
      root
        .querySelector<HTMLImageElement>(".hero-cup")!
        .decode()
        .catch(() => undefined),
    ]),
    new Promise((resolve) => setTimeout(resolve, 1200)),
  ]).then(() => {
    if (!alive) return;
    if (scrollY > 40 || location.hash) intro.progress(1);
    else intro.play();
  });
  return () => {
    alive = false;
    window.removeEventListener("wheel", finishIntro);
    window.removeEventListener("touchmove", finishIntro);
    window.removeEventListener("keydown", finishIntro);
    targets.forEach((element) => delete element.dataset.textMotion);
  };
}
