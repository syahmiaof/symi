import Image from "next/image";
import { flavors } from "@/data/flavors";
import FlavorControls from "./FlavorControls";
export default function FlavorUniverse() {
  return (
    <section
      id="flavors"
      className="flavor-section"
      aria-labelledby="flavor-title"
    >
      <div className="flavor-scene">
        <div className="flavor-heading">
          <div>
            <p className="eyebrow">Four flavors. Your kind of joy.</p>
            <h2 id="flavor-title">
              Our Flavor <em>Universe</em>
            </h2>
          </div>
          <p>
            Real ingredients. <br />
            Endless joy.
          </p>
        </div>
        <div
          className="flavor-track"
          tabIndex={0}
          role="region"
          aria-label="Four flavors. Swipe or use the arrow buttons to explore."
          data-lenis-prevent
        >
          {flavors.map((flavor) => (
            <article
              className={`flavor-panel flavor-${flavor.id}`}
              key={flavor.id}
              aria-label={flavor.name}
            >
              <div className="flavor-panel-copy">
                <span className="flavor-number">
                  {flavor.number} <i />
                </span>
                <h3>
                  {flavor.title[0]}
                  <br />
                  <em>{flavor.title[1]}</em>
                </h3>
                <p className="flavor-notes">
                  {flavor.notes.map((note) => (
                    <span key={note}>{note}</span>
                  ))}
                </p>
                <p className="flavor-description">{flavor.description}</p>
              </div>
              <span className="flavor-ghost" aria-hidden="true">
                {flavor.number}
              </span>
              <div className="flavor-product">
                <div className="product-ground" />
                <Image
                  src={`/images/symi/${flavor.id}-cup.webp`}
                  alt={`${flavor.name} frozen yogurt in a SYMI cup`}
                  width={flavor.width}
                  height={flavor.height}
                  sizes="(max-width: 767px) 65vw, 38vw"
                  quality={85}
                />
              </div>
              <Image
                className="flavor-floating"
                src={`/images/symi/${flavor.ingredient}.webp`}
                alt=""
                width={150}
                height={120}
                sizes="(max-width: 767px) 60px, 120px"
                aria-hidden="true"
              />
              <span className="flavor-signature">
                Crafted for a brighter you.
              </span>
            </article>
          ))}
        </div>
        <div className="flavor-bottom">
          <span>
            <b className="flavor-current">01</b> / 04
          </span>
          <div className="flavor-progress">
            <i />
          </div>
          <span className="flavor-instruction">
            Scroll to find your favorite
          </span>
          <FlavorControls />
        </div>
      </div>
    </section>
  );
}
