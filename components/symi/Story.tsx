import Image from "next/image";
import { Arrow, BrandStamp, LeafMark } from "./Brand";
import Benefits from "./Benefits";
export default function Story() {
  return (
    <section id="story" className="story-section" aria-labelledby="story-title">
      <div className="story-top">
        <div className="story-copy">
          <p className="eyebrow">
            Our story <span />
          </p>
          <h2 id="story-title">
            A Brighter
            <br />
            Way to Yogurt
          </h2>
          <p>
            At SYMI, we believe great yogurt starts with real ingredients and a
            simpler, happier way of life.{" "}
            <span className="story-copy-extra">
              More than a treat, SYMI is a daily reminder that the good things
              in life can be both nourishing and joyful.
            </span>
          </p>
          <a className="button button-navy" href="#experience">
            Our Story
            <span>
              <Arrow />
            </span>
          </a>
          <div className="story-handwritten" aria-hidden="true">
            Real
            <br />
            Ingredients
            <br />
            Happier
            <br />
            You.
          </div>
          <BrandStamp story />
        </div>
        <figure className="story-interior">
          <Image
            src="/images/symi/store-interior.webp"
            alt="SYMI store interior with navy feature wall, cream arches, fresh toppings and warm woven pendants"
            fill
            sizes="(max-width: 767px) 95vw, 55vw"
            quality={90}
          />
        </figure>
      </div>
      <div id="experience" className="experience-mosaic">
        <figure className="staff-photo">
          <Image
            src="/images/symi/staff-close.webp"
            alt="A SYMI team member carefully serving a fresh frozen yogurt swirl"
            fill
            sizes="(max-width: 767px) 150vw, 65vw"
            quality={90}
          />
          <div className="staff-stamp">
            <LeafMark />
            <span>
              People
              <br />
              Real yogurt
              <br />
              Brighter days.
            </span>
          </div>
        </figure>
        <figure className="story-product">
          <Image
            className="story-product-backdrop"
            src="/images/symi/mediterranean-plate.webp"
            alt=""
            fill
            sizes="(max-width: 767px) 95vw, 32vw"
          />
          <Image
            className="story-product-cup"
            src="/images/symi/hero-kiwi.webp"
            alt="Kiwi frozen yogurt with real fruit and golden granola"
            width={1000}
            height={1229}
            sizes="(max-width: 767px) 75vw, 27vw"
          />
          <figcaption>
            <em>Kiwi</em>
            <span>
              Crafted
              <br />
              for a<br />
              brighter
              <br />
              you.
            </span>
          </figcaption>
        </figure>
        <div className="experience-copy">
          <p className="eyebrow">The SYMI experience</p>
          <h2>
            More Than
            <br />A Treat
          </h2>
          <p>
            From thoughtfully sourced ingredients to beautifully crafted spaces,
            SYMI is a place to slow down, savor, and feel good — inside and out.
          </p>
          <Benefits />
        </div>
      </div>
      <div className="mobile-brand-statements">
        <span>
          Real
          <br />
          Ingredients.
        </span>
        <span>
          Thoughtfully
          <br />
          Crafted.
        </span>
        <span>
          Brighter
          <br />
          Days.
        </span>
      </div>
      <div className="story-gallery">
        <figure>
          <Image
            src="/images/symi/ingredients-scene.webp"
            alt="Fresh kiwi and golden granola on a stone countertop"
            fill
            sizes="(max-width: 767px) 50vw, 33vw"
          />
          <figcaption>
            Real
            <br />
            ingredients.
            <br />
            Happier
            <br />
            you.
          </figcaption>
        </figure>
        <figure>
          <Image
            src="/images/symi/seating-scene.webp"
            alt="A relaxed SYMI seating area overlooking the Mediterranean sea"
            fill
            sizes="(max-width: 767px) 50vw, 33vw"
          />
          <figcaption>
            Simple
            <br />
            spaces.
            <br />
            Brighter
            <br />
            days.
          </figcaption>
        </figure>
        <figure className="scenic-photo">
          <Image
            src="/images/symi/coast-scene.webp"
            alt="Blue Mediterranean water and sunlit stone terraces"
            fill
            sizes="(max-width: 767px) 100vw, 33vw"
          />
          <figcaption>
            A happier
            <br />
            you.
            <br />
            Anywhere.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
