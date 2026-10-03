import Image from "next/image";
import { Arrow, BrandStamp } from "./Brand";
export default function Story() {
  return (
    <section id="story" className="story-section" aria-labelledby="story-title">
      <div className="story-copy">
        <p className="eyebrow">
          Our story <span className="eyebrow-rule" />
        </p>
        <h2 id="story-title">
          A Brighter
          <br />
          Way to <em>Yogurt</em>
        </h2>
        <p>
          At SYMI, we believe great yogurt starts with real ingredients and a
          simpler, happier way of life.
        </p>
        <p>
          More than a treat, SYMI is a reminder that the good things in life can
          be both nourishing and joyful.
        </p>
        <a className="text-link" href="#experience">
          Step inside SYMI <Arrow />
        </a>
        <BrandStamp />
      </div>
      <figure className="story-photo">
        <Image
          src="/images/symi/store-lifestyle.webp"
          alt="A warm welcome at SYMI, with navy arches, natural wood and a counter full of fresh toppings"
          fill
          sizes="(max-width: 767px) 100vw, 55vw"
        />
        <figcaption>
          A little slower. A little sunnier. A little SYMI.
        </figcaption>
      </figure>
    </section>
  );
}
