import Image from "next/image";
import { Arrow, BrandStamp } from "./Brand";
import Benefits from "./Benefits";
export default function Hero() {
  return (
    <>
      <section id="home" className="hero" aria-labelledby="hero-title">
        <Image
          className="hero-backdrop"
          src="/images/symi/mediterranean-plate.webp"
          alt=""
          fill
          sizes="100vw"
          priority
          quality={90}
        />
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow">
            Good yogurt
            <br />
            Brighter days
          </p>
          <h1 id="hero-title">
            <span className="line-mask">
              <span>Crafted</span>
            </span>
            <span className="line-mask">
              <span>
                Frozen <span className="mobile-break">Yogurt</span>
              </span>
            </span>
          </h1>
          <p className="hero-subtitle">
            Real ingredients.
            <br className="mobile-only" /> <span>Pure joy.</span>
          </p>
          <p className="hero-description">
            Creamy. Refreshing. Thoughtfully crafted
            <br className="desktop-break" /> with real ingredients for a happier
            you.
          </p>
          <a className="button" href="#flavors">
            Explore Our Flavors{" "}
            <span>
              <Arrow />
            </span>
          </a>
          <Benefits />
        </div>
        <div className="hero-product">
          <Image
            className="hero-cup"
            src="/images/symi/hero-kiwi.webp"
            alt="Kiwi frozen yogurt, green kiwi sauce and golden granola in a navy SYMI cup"
            width={951}
            height={1305}
            sizes="(max-width: 767px) 65vw, 27vw"
            priority
            quality={90}
          />
        </div>
        <div className="hero-flavor-note" aria-hidden="true">
          <em>Kiwi</em>
          <span>
            Crafted
            <br />
            for a<br />
            brighter
            <br />
            you.
          </span>
        </div>
        <BrandStamp />
        <div className="hero-bottom">
          <span className="page-count">
            01 <small>/ 04</small>
            <i />
          </span>
          <a href="#swirl" className="scroll-cue">
            <span className="mouse" />
            Scroll
            <br />
            to explore
          </a>
          <a
            className="round-button"
            href="#swirl"
            aria-label="Explore the SYMI Swirl"
          >
            <Arrow />
          </a>
        </div>
      </section>
      <aside className="hero-preview" aria-label="A brighter way to yogurt">
        <div className="hero-preview-copy">
          <p className="eyebrow">Our story</p>
          <h2>
            A Brighter
            <br />
            Way to Yogurt
          </h2>
          <p>
            At SYMI, we believe great yogurt starts with real ingredients and a
            simpler, happier way of life.
          </p>
        </div>
        <figure>
          <Image
            src="/images/symi/store-interior.webp"
            alt="SYMI interior with navy arches and warm pendant lights"
            fill
            sizes="35vw"
          />
        </figure>
        <figure className="preview-sea" aria-label="Mediterranean sea view" />
      </aside>
    </>
  );
}
