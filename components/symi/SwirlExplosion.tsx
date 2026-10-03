import Image from "next/image";
import { Arrow } from "./Brand";

const particles = [
  ["kiwi-slice", -205, -155, -35, 100],
  ["kiwi-slice", 218, 18, 36, 112],
  ["granola", -176, -260, -24, 55],
  ["granola", 185, -214, 36, 64],
  ["granola", -190, 95, -18, 62],
  ["granola", 146, 172, 64, 44],
  ["granola", 85, -315, 12, 32],
  ["granola", -114, -64, -45, 34],
  ["kiwi-slice", 144, -296, -56, 70],
  ["granola", -90, 233, 90, 39],
  ["granola", 252, 112, 120, 33],
  ["granola", -238, -8, 16, 28],
] as const;

export default function SwirlExplosion() {
  return (
    <section id="swirl" className="swirl-section" aria-labelledby="swirl-title">
      <div className="swirl-scene">
        <div className="swirl-copy">
          <p className="eyebrow">A little wonder in every layer</p>
          <h2 id="swirl-title">
            The
            <br />
            <span>SYMI</span>
            <br />
            <em>Swirl</em>
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
          <a className="text-link" href="#flavors">
            Meet your flavor <Arrow />
          </a>
        </div>
        <div
          className="swirl-stage"
          role="img"
          aria-label="Layers of the SYMI swirl: creamy frozen yogurt, kiwi, house-made granola and kiwi sauce"
        >
          <div className="swirl-orbit" aria-hidden="true" />
          <svg
            className="sauce-ribbon"
            viewBox="0 0 600 750"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M158 215C490 90 557 279 292 300C71 321 105 459 432 422"
              stroke="currentColor"
              strokeWidth="13"
              strokeLinecap="round"
            />
            <path
              d="M158 215C490 90 557 279 292 300C71 321 105 459 432 422"
              stroke="#e5eaa4"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <Image
            className="swirl-layer swirl-top"
            src="/images/symi/kiwi-swirl.webp"
            alt=""
            width={580}
            height={870}
            sizes="(max-width: 767px) 72vw, 36vw"
            aria-hidden="true"
          />
          <Image
            className="swirl-layer swirl-vessel"
            src="/images/symi/kiwi-vessel.webp"
            alt=""
            width={580}
            height={870}
            sizes="(max-width: 767px) 72vw, 36vw"
            aria-hidden="true"
          />
          {particles.map(([asset, x, y, rotation, size], i) => (
            <div
              key={i}
              className={`swirl-particle particle-${i}`}
              data-x={x}
              data-y={y}
              data-rotation={rotation}
              style={{ width: size }}
              aria-hidden="true"
            >
              <Image
                src={`/images/symi/${asset}.webp`}
                alt=""
                width={asset === "kiwi-slice" ? 283 : 135}
                height={asset === "kiwi-slice" ? 219 : 95}
                sizes={`${size}px`}
              />
            </div>
          ))}
        </div>
        <div className="swirl-callouts" aria-hidden="true">
          <div className="callout callout-yogurt">
            <span className="callout-number">01</span>
            <strong>Creamy frozen yogurt</strong>
            <span>Smooth. Light. Pure joy.</span>
          </div>
          <div className="callout callout-kiwi">
            <span className="callout-number">02</span>
            <strong>Kiwi</strong>
            <span>Bright flavor. Real fruit.</span>
          </div>
          <div className="callout callout-granola">
            <span className="callout-number">03</span>
            <strong>House-made granola</strong>
            <span>Wholesome crunch.</span>
          </div>
          <div className="callout callout-sauce">
            <span className="callout-number">04</span>
            <strong>Kiwi sauce</strong>
            <span>Fruity. Naturally vibrant.</span>
          </div>
        </div>
        <div className="swirl-caption">
          <span>Creamy yogurt</span>
          <i />
          Real kiwi
          <i />
          <span>Golden granola</span>
        </div>
        <div className="scene-progress" aria-hidden="true">
          <span>Assemble</span>
          <div>
            <i />
          </div>
          <span>Explore the layers</span>
        </div>
      </div>
    </section>
  );
}
