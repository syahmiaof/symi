import Image from "next/image";
import layers from "@/data/explosion-layers.json";
import { Arrow } from "./Brand";
import Benefits, { IngredientIcon } from "./Benefits";
const callouts = [
  {
    id: "yogurt",
    icon: 0,
    title: "Creamy frozen yogurt",
    description: (
      <>
        Smooth. Light.
        <br />
        Pure joy.
      </>
    ),
  },
  {
    id: "kiwi",
    icon: 0,
    title: "Kiwi",
    description: (
      <>
        Bright flavor.
        <br />
        Real fruit.
      </>
    ),
  },
  {
    id: "granola",
    icon: 1,
    title: "House-made granola",
    description: (
      <>
        Wholesome crunch.
        <br />
        All natural.
      </>
    ),
  },
  {
    id: "sauce",
    icon: 3,
    title: "Kiwi sauce",
    description: (
      <>
        Fruity. Refreshing.
        <br />
        Naturally vibrant.
      </>
    ),
  },
];
export default function SwirlExplosion() {
  return (
    <section id="swirl" className="swirl-section" aria-labelledby="swirl-title">
      <div className="swirl-scene">
        <Image
          className="scene-backdrop"
          src="/images/symi/swirl-plate.webp"
          alt=""
          fill
          sizes="100vw"
        />
        <div className="swirl-copy">
          <p className="eyebrow">
            Good yogurt
            <br />
            Brighter days
          </p>
          <h2 id="swirl-title">
            The
            <br />
            SYMI
            <br />
            Swirl
          </h2>
          <p className="serif-subtitle">
            Real ingredients,
            <br />
            reimagined in motion.
          </p>
          <p className="body-copy">
            A perfect balance of creamy frozen yogurt, vibrant fruit and
            wholesome toppings — crafted to brighten your day, layer by layer.
          </p>
          <a className="button" href="#flavors">
            Explore Our Flavors
            <span>
              <Arrow />
            </span>
          </a>
        </div>
        <Image
          className="swirl-assembled"
          src="/images/symi/hero-kiwi.webp"
          alt=""
          width={1000}
          height={1229}
          sizes="30vw"
        />
        <div
          className="swirl-stage"
          role="img"
          aria-label="Exploded SYMI kiwi yogurt: white yogurt swirl, kiwi sauce ribbons, fresh kiwi, golden granola and tilted navy cup"
        >
          {layers.map((layer) => (
            <Image
              key={layer.id}
              className={`explosion-layer explosion-${layer.kind}`}
              data-layer={layer.id}
              data-kind={layer.kind}
              data-center-x={layer.x + layer.width / 2}
              data-center-y={layer.y + layer.height / 2}
              src={`/images/symi/explosion/${layer.id}.webp`}
              alt=""
              width={layer.pixelWidth}
              height={layer.pixelHeight}
              unoptimized
              style={{
                left: `${layer.x}%`,
                top: `${layer.y}%`,
                width: `${layer.width}%`,
                height: `${layer.height}%`,
              }}
            />
          ))}
        </div>
        <div className="swirl-callouts">
          {callouts.map((c) => (
            <div className={`callout callout-${c.id}`} key={c.id}>
              <IngredientIcon kind={c.id} />
              <span className="callout-line" />
              <strong>{c.title}</strong>
              <p>{c.description}</p>
            </div>
          ))}
        </div>
        <nav className="scene-progress" aria-label="Explore the page">
          <a href="#home">01</a>
          <a className="current" href="#swirl" aria-current="location">
            02
          </a>
          <a href="#flavors">03</a>
          <a href="#story">04</a>
          <span className="explosion-progress" aria-hidden="true">
            <i />
          </span>
          <span className="scroll-cue">
            <span className="mouse" />
            Scroll
            <br />
            to explore
          </span>
        </nav>
        <div className="swirl-benefits">
          <Benefits />
        </div>
      </div>
    </section>
  );
}
