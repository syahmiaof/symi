import Image from "next/image";
import { Arrow, BrandStamp, LeafMark } from "./Brand";
export default function Hero() {
  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="hero-architecture" aria-hidden="true">
        <Image
          src="/images/symi/store-lifestyle.webp"
          alt=""
          fill
          sizes="(max-width: 767px) 60vw, 40vw"
          quality={80}
          priority
        />
      </div>
      <div className="hero-copy">
        <p className="eyebrow hero-eyebrow">
          Good yogurt
          <br />
          Brighter days
        </p>
        <h1 id="hero-title">
          <span className="line-mask">
            <span>Crafted </span>
          </span>
          <span className="line-mask">
            <span>
              Frozen <span className="mobile-break">Yogurt</span>
            </span>
          </span>
        </h1>
        <p className="hero-subtitle">
          Real ingredients. <em>Pure joy.</em>
        </p>
        <p className="hero-description">
          <span className="desktop-description">
            Creamy. Refreshing. Thoughtfully crafted
            <br className="desktop-break" /> with real ingredients for a happier
            you.
          </span>
          <span className="mobile-description">
            Creamy. Refreshing.
            <br />
            Thoughtfully crafted.
          </span>
        </p>
        <a className="button" href="#swirl">
          Explore the Swirl{" "}
          <span>
            <Arrow />
          </span>
        </a>
        <div className="hero-note">
          <LeafMark />
          <span>
            Made to brighten
            <br />
            your everyday.
          </span>
        </div>
      </div>
      <div
        className="hero-product"
        aria-label="Kiwi frozen yogurt topped with real kiwi and golden granola"
      >
        <div className="product-ground" />
        <Image
          className="hero-cup"
          src="/images/symi/kiwi-cup.webp"
          alt="SYMI kiwi frozen yogurt in a midnight navy cup"
          width={580}
          height={870}
          sizes="(max-width: 767px) 65vw, 42vw"
          quality={90}
          priority
        />
        <Image
          className="hero-kiwi"
          src="/images/symi/kiwi-slice.webp"
          alt=""
          width={283}
          height={219}
          sizes="(max-width: 767px) 100px, 180px"
          aria-hidden="true"
          priority
        />
        <Image
          className="hero-granola"
          src="/images/symi/granola.webp"
          alt=""
          width={135}
          height={95}
          sizes="70px"
          aria-hidden="true"
          priority
        />
      </div>
      <div className="hero-flavor-note" aria-hidden="true">
        <em>Kiwi</em>
        <span>
          A little tang.
          <br />A little sunshine.
        </span>
      </div>
      <BrandStamp />
      <div className="hero-bottom">
        <span>01 — The brighter side</span>
        <a href="#swirl" className="scroll-cue">
          Scroll to explore <Arrow direction="down" />
        </a>
        <span>Crafted with joy</span>
      </div>
    </section>
  );
}
