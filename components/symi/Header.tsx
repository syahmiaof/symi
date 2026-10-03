"use client";
import { useEffect, useRef, useState } from "react";
import { Arrow, Wordmark } from "./Brand";

const links = [
  ["Home", "home"],
  ["Our Story", "story"],
  ["Flavors", "flavors"],
  ["Ingredients", "swirl"],
  ["Experience", "experience"],
] as const;
export default function Header() {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const el = dialog.current;
    const opener = toggle.current;
    el?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.dispatchEvent(new CustomEvent("symi:pause", { detail: true }));
    return () => {
      el?.close();
      document.body.style.overflow = previous;
      window.dispatchEvent(new CustomEvent("symi:pause", { detail: false }));
      opener?.focus({ preventScroll: true });
    };
  }, [open]);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <a href="#home" className="logo-link" aria-label="SYMI home">
          <Wordmark />
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([name, id]) => (
            <a key={id} href={`#${id}`}>
              {name}
            </a>
          ))}
        </nav>
        <a className="launch-link" href="#launch">
          Launching 2027 <Arrow />
        </a>
        <a
          className="mobile-search"
          href="#flavors"
          aria-label="Explore flavors"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <circle cx="10" cy="10" r="6.5" />
            <path d="m15 15 6 6" />
          </svg>
        </a>
        <button
          ref={toggle}
          className="menu-toggle"
          aria-label="Open navigation"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(true)}
        >
          <span />
          <span />
        </button>
      </header>
      <dialog
        ref={dialog}
        id="mobile-navigation"
        className="mobile-menu"
        onCancel={() => setOpen(false)}
        aria-label="Navigation"
      >
        <div className="menu-head">
          <Wordmark />
          <button
            className="menu-close"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
          >
            Close <span aria-hidden="true">×</span>
          </button>
        </div>
        <nav aria-label="Mobile navigation">
          {links.map(([name, id], i) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
              <small>0{i + 1}</small>
              {name}
              <Arrow />
            </a>
          ))}
        </nav>
        <a
          className="menu-launch"
          href="#launch"
          onClick={() => setOpen(false)}
        >
          Good yogurt. Brighter days.
          <br />
          <span>Launching 2027</span>
        </a>
      </dialog>
    </>
  );
}
