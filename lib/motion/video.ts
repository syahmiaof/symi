import { gsap } from "./gsap";

/** Coalesce scroll requests: never queue more than one decoder seek. */
export function createVideoJourney(root: HTMLElement, pinned: boolean) {
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
  // Unlock the inline decoder during a real touch on phones, without autoplaying the scene.
  const unlock = () => {
    if (disposed) return;
    video.muted = true;
    video
      .play()
      .then(() => {
        video.pause();
        if (disposed) return;
        schedule();
      })
      .catch(() => schedule());
  };
  root.addEventListener("touchstart", unlock, { once: true, passive: true });
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
      start: pinned ? "top top" : "top 55%",
      end: pinned ? () => `+=${scene.clientHeight * 3.2}` : "bottom 35%",
      pin: pinned,
      anticipatePin: pinned ? 1 : 0,
      scrub: matchMedia("(pointer: coarse)").matches ? 0.22 : 0.4,
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
    scene.querySelector(".swirl-callouts"),
    { autoAlpha: 0, y: 10 },
    {
      autoAlpha: 1,
      y: 0,
      ease: "none",
      scrollTrigger: {
        trigger: scene,
        start: () =>
          timeline.scrollTrigger!.start +
          (timeline.scrollTrigger!.end - timeline.scrollTrigger!.start) * 0.25,
        end: () =>
          timeline.scrollTrigger!.start +
          (timeline.scrollTrigger!.end - timeline.scrollTrigger!.start) * 0.45,
        scrub: 0.4,
      },
    },
  );
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
    root.removeEventListener("touchstart", unlock);
    video.removeEventListener("loadedmetadata", ready);
    video.removeEventListener("loadeddata", ready);
    video.removeEventListener("canplay", ready);
    video.removeEventListener("seeked", seeked);
    video.removeEventListener("error", failed);
    delete scene.dataset.videoReady;
  };
}
