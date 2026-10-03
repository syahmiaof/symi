export function LeafMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 60 46"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M30 2C19 15 21 26 30 34C39 24 41 15 30 2Z" />
      <path d="M5 19C7 34 16 42 28 42C27 28 18 21 5 19Z" />
      <path d="M55 19C53 34 44 42 32 42C33 28 42 21 55 19Z" />
    </svg>
  );
}
export function Wordmark({ large = false }: { large?: boolean }) {
  return (
    <span className={`wordmark${large ? " wordmark-large" : ""}`}>
      <LeafMark />
      <span>SYMI</span>
      <small>Crafted Frozen Yogurt</small>
    </span>
  );
}
export function Arrow({
  direction = "right",
}: {
  direction?: "right" | "left" | "down";
}) {
  return (
    <svg
      className={`arrow arrow-${direction}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function BrandStamp() {
  return (
    <div className="brand-stamp" aria-hidden="true">
      <LeafMark />
      <span>
        Real fruit
        <br />
        Real joy
      </span>
    </div>
  );
}
