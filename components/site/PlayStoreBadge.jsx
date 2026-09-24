export const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.leadnator.app";

/** "Get it on Google Play" badge linking to the Android app listing. */
export default function PlayStoreBadge({ className = "" }) {
  return (
    <a
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`ln-play-badge ${className}`}
      aria-label="Download the Leadnator app on Google Play"
    >
      <svg className="ln-play-badge-icon" viewBox="0 0 24 26" aria-hidden="true">
        <path fill="#00d7fe" d="M1.1.6C.8.9.6 1.4.6 2v22c0 .6.2 1.1.5 1.4l.1.1L13.5 13.2v-.3L1.2.5 1.1.6z" />
        <path fill="#ffce00" d="M17.6 17.3l-4.1-4.1v-.3l4.1-4.1.1.1 4.9 2.8c1.4.8 1.4 2.1 0 2.9l-4.9 2.8-.1-.1z" />
        <path fill="#ff3a44" d="M17.7 17.2L13.5 13 1.1 25.4c.5.5 1.2.5 2.1.1l14.5-8.3" />
        <path fill="#00f076" d="M17.7 8.8L3.2.5C2.3 0 1.6.1 1.1.6L13.5 13l4.2-4.2z" />
      </svg>
      <span className="ln-play-badge-text">
        <small>GET IT ON</small>
        <strong>Google Play</strong>
      </span>
    </a>
  );
}
