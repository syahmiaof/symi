import { gsap } from "./gsap";

/** Coalesce scroll requests: never queue more than one decoder seek. */
export function createVideoJourney(root: HTMLElement, desktop: boolean) {
  const scene = root.querySelector<HTMLElement>(".swirl-scene")!;
  const video = scene.querySelector<HTMLVideoElement>("video")!;
  const state = { progress: 0 };
  let disposed = false;
  let frame = 0;
  let wanted = 0;
  const seek = () => {
    frame = 0;
    if (disposed || video.seeking || !Number.isFinite(video.duration)) return;
    wanted = Math.min(
      video.duration - 0.05,
      Math.round(state.progress * video.duration * 24) / 24,
    );
    if (Math.abs(video.currentTime - wanted) < 1 / 48) return;
    video.currentTime = Math.max(0, wanted);
  };
  const schedule = () => {
    if (!frame && !disposed) frame = requestAnimationFrame(seek);
  };
  const seeked = () => {
    scene.dataset.videoReady = "true";
    schedule();
  };
  const ready = () => {
    schedule();
  };
  const failed = () => {
    delete scene.dataset.videoReady;
  };
  video.addEventListener("loadedmetadata", ready);
  video.addEventListener("loadeddata", ready);
  video.addEventListener("canplay", ready);
  video.addEventListener("seeked", seeked);
  video.addEventListener("error", failed);
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      video.preload = "auto";
      observer.disconnect();
    },
    { rootMargin: "100% 0px" },
  );
  observer.observe(scene);

  const timeline = gsap.timeline({
    scrollTrigger: {
      id: "swirl-pin",
      trigger: scene,
      start: desktop ? "top top" : "top 55%",
      end: desktop ? () => `+=${innerHeight * 2.8}` : "bottom 35%",
      pin: desktop,
      anticipatePin: desktop ? 1 : 0,
      scrub: 0.65,
      invalidateOnRefresh: true,
    },
  });
  timeline
    .to(state, { progress: 0, duration: 0.6 })
    .to(state, {
      progress: 0.58,
      duration: 4.8,
      ease: "none",
      onUpdate: schedule,
    })
    .to(state, { progress: 0.58, duration: 1.1 })
    .to(state, { progress: 1, duration: 3.5, ease: "none", onUpdate: schedule })
    .to({}, { duration: 0.6 });
  gsap.fromTo(
    scene.querySelector(".explosion-progress i"),
    { scaleY: 0 },
    {
      scaleY: 1,
      ease: "none",
      scrollTrigger: {
        trigger: scene,
        start: () => timeline.scrollTrigger!.start,
        end: () => timeline.scrollTrigger!.end,
        scrub: true,
      },
    },
  );
  // Native media events own decoder state; the GSAP context owns the timeline.
  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    video.pause();
    video.removeEventListener("loadedmetadata", ready);
    video.removeEventListener("loadeddata", ready);
    video.removeEventListener("canplay", ready);
    video.removeEventListener("seeked", seeked);
    video.removeEventListener("error", failed);
    delete scene.dataset.videoReady;
  };
}
