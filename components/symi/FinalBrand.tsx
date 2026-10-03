import { Arrow, LeafMark, Wordmark } from "./Brand";
export default function FinalBrand() {
  return (
    <>
      <section
        id="launch"
        className="final-brand"
        aria-labelledby="final-title"
      >
        <p className="eyebrow">Something brighter is on its way</p>
        <LeafMark className="final-leaf" />
        <h2 id="final-title">
          Good yogurt.
          <br />
          <em>Brighter days.</em>
        </h2>
        <p className="launch-date">Launching 2027</p>
        <div className="final-brand-line">
          <Wordmark large />
        </div>
      </section>
      <footer className="site-footer">
        <span>© {new Date().getFullYear()} SYMI</span>
        <span>Crafted frozen yogurt. Made for joy.</span>
        <a href="#home">
          Back to the bright side <Arrow direction="down" />
        </a>
      </footer>
    </>
  );
}
