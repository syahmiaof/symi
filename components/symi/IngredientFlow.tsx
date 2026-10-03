import Image from "next/image";
export default function IngredientFlow() {
  return (
    <section
      className="ingredient-flow"
      aria-label="Real ingredients. Pure joy."
    >
      <div className="flow-line flow-line-one" aria-hidden="true">
        <span>Real ingredients.</span>
        <Image
          src="/images/symi/kiwi-slice.webp"
          alt=""
          width={283}
          height={219}
          sizes="120px"
        />
        <span>Real ingredients.</span>
      </div>
      <div className="flow-line flow-line-two" aria-hidden="true">
        <Image
          src="/images/symi/berry-piece.webp"
          alt=""
          width={155}
          height={135}
          sizes="90px"
        />
        <span>
          Pure <em>joy.</em>
        </span>
        <Image
          src="/images/symi/mango-piece.webp"
          alt=""
          width={140}
          height={105}
          sizes="100px"
        />
        <span>
          Pure <em>joy.</em>
        </span>
      </div>
      <p className="eyebrow">
        Kiwi · Mango · Berry · Granola · Almond · Chocolate
      </p>
    </section>
  );
}
