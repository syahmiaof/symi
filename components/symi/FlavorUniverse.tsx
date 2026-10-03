import Image from "next/image";
import { flavors } from "@/data/flavors";
import FlavorControls from "./FlavorControls";
import { Arrow, BrandStamp } from "./Brand";
export default function FlavorUniverse() {
  return (
    <section
      id="flavors"
      className="flavor-section"
      aria-labelledby="flavor-title"
    >
      <div className="flavor-scene">
        <Image
          className="scene-backdrop flavor-backdrop"
          src="/images/symi/swirl-plate.webp"
          alt=""
          fill
          sizes="100vw"
        />
        <div className="flavor-heading">
          <p className="eyebrow">
            Real
            <br />
            flavors.
            <br />
            Brighter
            <br />
            days.
          </p>
          <div>
            <h2 id="flavor-title">
              <span className="desktop-flavor-title">
                Our
                <br />
                Flavor Universe
              </span>
              <span className="mobile-flavor-title">
                Pure
                <br />
                Ingredients.
                <br />
                Bolder Flavors.
              </span>
            </h2>
            <p className="flavor-subtitle">Real ingredients. Endless joy.</p>
          </div>
          <div className="flavor-intro">
            <p>
              A world of flavors crafted from real ingredients — each one a
              brighter way to enjoy the good things in life.
            </p>
            <a href="#flavor-track">
              <span className="outline-arrow">
                <Arrow />
              </span>
              <span>
                Explore
                <br />
                All Flavors
              </span>
            </a>
          </div>
        </div>
        <div
          id="flavor-track"
          className="flavor-track"
          tabIndex={0}
          role="region"
          aria-label="Four flavors. Swipe or use arrow buttons to explore."
          data-lenis-prevent
        >
          {flavors.map((flavor) => (
            <article
              className={`flavor-panel flavor-${flavor.id}`}
              key={flavor.id}
              aria-label={flavor.name}
            >
              <Image
                className="flavor-environment"
                src={`/images/symi/${flavor.id}-environment.webp`}
                alt=""
                fill
                sizes="30vw"
              />
              <div className="flavor-panel-copy">
                <span className="flavor-number">
                  {flavor.number}
                  <i />
                </span>
                <h3>
                  {flavor.title[0]}
                  <br />
                  {flavor.title[1]}
                </h3>
                <p className="flavor-notes">
                  {flavor.notes.map((note) => (
                    <span key={note}>{note}</span>
                  ))}
                </p>
                <a
                  className="outline-arrow"
                  href="#launch"
                  aria-label={`Discover ${flavor.name}, launching 2027`}
                >
                  <Arrow />
                </a>
              </div>
              <div className="mobile-flavor-art" aria-hidden="true">
                <em>{flavor.title[0]}</em>
                <span>
                  Crafted
                  <br />
                  for a<br />
                  brighter
                  <br />
                  you.
                </span>
                <BrandStamp />
              </div>
              <div className="flavor-product">
                <Image
                  src={`/images/symi/${flavor.id === "kiwi" ? "hero-kiwi" : flavor.id + "-cup"}.webp`}
                  alt={`${flavor.name} frozen yogurt in a SYMI cup`}
                  width={flavor.width}
                  height={flavor.height}
                  sizes="(max-width: 767px) 88vw, 25vw"
                  quality={90}
                />
              </div>
              <Image
                className="mobile-flavor-fruit"
                src={`/images/symi/${flavor.ingredient}.webp`}
                alt=""
                width={150}
                height={120}
                sizes="80px"
              />
              <div className="mobile-flavor-caption">
                <h3>{flavor.name}</h3>
                <p>{flavor.description}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="flavor-bottom">
          <span className="page-count">
            <b className="flavor-current">01</b>
            <small>/ 04</small>
            <i className="flavor-progress" />
          </span>
          <FlavorControls />
        </div>
        <a className="mobile-flavor-cta button button-navy" href="#launch">
          Your Flavor. Your Joy.
          <span>
            <Arrow />
          </span>
        </a>
      </div>
    </section>
  );
}
