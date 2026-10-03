import Image from "next/image";
import { LeafMark } from "./Brand";
const photos = [
  {
    asset: "staff-machine",
    alt: "A SYMI team member carefully dispensing a fresh yogurt swirl",
    caption: "01 / Made with a little care",
    className: "gallery-main",
  },
  {
    asset: "handheld",
    alt: "A hand holding a fruit-topped SYMI cup in the sunlit store",
    caption: "02 / Your everyday bright spot",
    className: "gallery-handheld",
  },
  {
    asset: "flavors-flatlay",
    alt: "Kiwi, mango, berry and chocolate yogurt cups with their ingredients",
    caption: "03 / Good things, together",
    className: "gallery-flatlay",
  },
  {
    asset: "staff-serve",
    alt: "A smiling SYMI team member handing a yogurt cup to a customer",
    caption: "04 / A cup full of joy",
    className: "gallery-serve",
  },
];
export default function ExperienceGallery() {
  return (
    <section
      id="experience"
      className="experience-section"
      aria-labelledby="experience-title"
    >
      <div className="experience-heading">
        <p className="eyebrow">The SYMI experience</p>
        <h2 id="experience-title">
          More than
          <br />
          <em>a treat.</em>
        </h2>
        <p>
          A place to slow down,
          <br />
          savor, and feel good.
        </p>
        <LeafMark />
      </div>
      <div className="experience-gallery">
        {photos.map((photo) => (
          <figure className={photo.className} key={photo.asset}>
            <div className="gallery-image">
              <Image
                src={`/images/symi/${photo.asset}.webp`}
                alt={photo.alt}
                fill
                sizes="(max-width: 767px) 90vw, 50vw"
              />
            </div>
            <figcaption>{photo.caption}</figcaption>
          </figure>
        ))}
      </div>
      <div className="brand-values">
        <span>
          <LeafMark />
          Natural ingredients
        </span>
        <span>
          <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <path
              d="M9 13c-5-6 10-5 6-11 8 5 2 7 6 9 4 2 4 5 1 6H8c-4-1-3-4 1-4Zm-2 7h18l-3 10H10Z"
              stroke="currentColor"
              strokeWidth="1.3"
            />
          </svg>
          Creamy & smooth
        </span>
        <span>
          <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <path
              d="M16 29V3M3 16h26M7 7l18 18M25 7 7 25M12 5l4 4 4-4M12 27l4-4 4 4M5 12l4 4-4 4M27 12l-4 4 4 4"
              stroke="currentColor"
              strokeWidth="1.3"
            />
          </svg>
          Refreshing all day
        </span>
      </div>
    </section>
  );
}
