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
export function createTextJourney(root: HTMLElement, desktop: boolean) {
  const targets = Array.from(
    root.querySelectorAll<HTMLElement>(copySelector),
  ).filter((el) => el.getClientRects().length && el.textContent?.trim());
  const track = root.querySelector<HTMLElement>(".flavor-track")!;
  const flavorAnimation = ScrollTrigger.getById("flavors-pin")?.animation;

  targets.forEach((element, index) => {
    const heading = /^H[123]$/.test(element.tagName);
    const label = element.matches(".eyebrow, .launch-date, .callout strong");
    const interactive = element.matches("a");
    const panel = element.closest<HTMLElement>(".flavor-panel");
    const pinned = desktop && element.closest(".swirl-scene, .flavor-scene");
    const pin = pinned
      ? ScrollTrigger.getById(
          element.closest(".swirl-scene") ? "swirl-pin" : "flavors-pin",
        )
      : undefined;
    const top = () => element.getBoundingClientRect().top + window.scrollY;
    const height = () => element.offsetHeight;
    const visibleAtLoad = top() < innerHeight * 0.8 && window.scrollY < 10;
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
    const concealedOpacity = heading || label ? 0 : 1;
    const curtain = !heading && !label && !interactive;
    const duration = label ? 0.04 : 0.65;
    const stagger = { amount: label ? 0.75 : heading ? 0.3 : 0.22 };
    const tl = gsap.timeline({ paused: true });
    tl.set(units, { opacity: concealedOpacity });
    tl.fromTo(
      units,
      {
        opacity: concealedOpacity,
        clipPath: curtain ? "inset(100% 0% 0% 0%)" : "none",
        yPercent: label ? 0 : heading ? 65 : 30,
        rotationX: heading ? -18 : 0,
        transformOrigin: "50% 100%",
      },
      {
        opacity: 1,
        clipPath: curtain ? "inset(0% 0% 0% 0%)" : "none",
        yPercent: 0,
        rotationX: 0,
        duration,
        stagger,
        ease: label ? "steps(1)" : "power3.out",
      },
      0.001,
    )
      .to({}, { duration: 2.5 })
      .to(units, {
        opacity: concealedOpacity,
        clipPath: curtain ? "inset(0% 0% 100% 0%)" : "none",
        yPercent: label ? 0 : heading ? -45 : -20,
        rotationX: heading ? 12 : 0,
        duration: 0.65,
        stagger: { amount: 0.15 },
        ease: label ? "steps(1)" : "power2.in",
      });

    if (panel) {
      // Horizontal entry/exit follows the same timeline as the product rail.
      ScrollTrigger.create({
        id: `text-${index}`,
        trigger: panel,
        animation: tl,
        ...(desktop && flavorAnimation
          ? { containerAnimation: flavorAnimation }
          : { scroller: track, horizontal: true }),
        start: "left 105%",
        end: "right -15%",
        scrub: 0.45,
      });
    } else {
      ScrollTrigger.create({
        id: `text-${index}`,
        trigger: element,
        animation: tl,
        start: () =>
          pin
            ? pin.start - innerHeight * 0.85
            : Math.min(
                top() - innerHeight * 0.96,
                ScrollTrigger.maxScroll(window) - innerHeight * 0.4,
              ),
        end: () =>
          pin
            ? pin.end + innerHeight * 0.8
            : Math.min(
                top() + height() + innerHeight * 0.16,
                ScrollTrigger.maxScroll(window) + innerHeight * 0.6,
              ),
        scrub: 0.45,
      });
    }
    // A separate parent reveal introduces the opening frame without fighting scrubbed words.
    if (
      visibleAtLoad &&
      !interactive &&
      element.closest(".hero-copy") &&
      !element.closest(".benefits")
    )
      gsap.from(element, {
        opacity: 0,
        y: 12,
        duration: 1.05,
        delay: Math.min(index * 0.075, 0.45),
        ease: "power2.out",
      });
  });

  gsap.from(
    root.querySelectorAll(
      ".site-header .wordmark, .desktop-nav a, .launch-link",
    ),
    {
      opacity: 0,
      y: -10,
      stagger: 0.065,
      duration: 0.85,
      ease: "power2.out",
    },
  );
  return () => {
    targets.forEach((element) => delete element.dataset.textMotion);
  };
}
