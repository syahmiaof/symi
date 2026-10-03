export function BenefitIcon({ type }: { type: number }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="18" />
      {type === 0 ? (
        <>
          <path d="M12 27C9 14 19 11 28 9c1 13-4 21-13 17M12 30l11-15" />
        </>
      ) : type === 1 ? (
        <>
          <path d="M12 17h16l-3 14H15zM11 17h18M15 14c0-4 5-3 5-8 4 4 5 6 5 8M17 21h6" />
        </>
      ) : type === 2 ? (
        <path
          fill="currentColor"
          stroke="none"
          d="M20 29C0 17 15 8 20 17c5-9 20 0 0 12Z"
        />
      ) : (
        <>
          <path d="M20 7v26M9 13l22 14M9 27l22-14M16 9l4 4 4-4M16 31l4-4 4 4M9 18l5-2-1-5M27 29l-1-5 5-2M9 22l5 2-1 5M27 11l-1 5 5 2" />
        </>
      )}
    </svg>
  );
}
const labels = [
  ["Natural", "ingredients"],
  ["Creamy", "& smooth"],
  ["Lower fat", "lifestyle"],
  ["Refreshing", "all day"],
];
export default function Benefits() {
  return (
    <ul className="benefits" aria-label="The SYMI experience">
      {labels.map((label, i) => (
        <li key={i}>
          <BenefitIcon type={i} />
          <span>
            {label[0]}
            <br />
            {label[1]}
          </span>
        </li>
      ))}
    </ul>
  );
}
