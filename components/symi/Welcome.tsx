import { Arrow, Wordmark } from "./Brand";

export default function Welcome() {
  return (
    <div
      className="welcome-screen"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
    >
      <div className="welcome-orbit" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="welcome-content">
        <Wordmark />
        <p className="welcome-eyebrow">WELCOME TO A LITTLE EVERYDAY JOY</p>
        <p className="welcome-title" id="welcome-title">
          Brighter days
          <br />
          <em>start with a swirl.</em>
        </p>
        <span className="welcome-line" aria-hidden="true" />
        <p className="welcome-note">REAL INGREDIENTS. PURE JOY.</p>
      </div>
      <button type="button" className="welcome-enter">
        Enter SYMI <Arrow />
      </button>
    </div>
  );
}
