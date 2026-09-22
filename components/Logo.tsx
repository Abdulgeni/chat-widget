export default function Logo({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="logoGrad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff8a8a" />
          <stop offset="1" stopColor="#ff6363" />
        </linearGradient>
      </defs>
      <path
        d="M6 9a5 5 0 015-5h6a5 5 0 015 5v3a5 5 0 01-5 5h-3l-4.5 4v-4H11a5 5 0 01-5-5V9z"
        fill="url(#logoGrad)"
        opacity="0.55"
      />
      <path
        d="M11 14a5 5 0 015-5h6a5 5 0 015 5v3a5 5 0 01-5 5h-1l-3.5 3.2V22h-1.5a5 5 0 01-5-5v-3z"
        fill="url(#logoGrad)"
      />
      <circle cx="24" cy="8" r="1.6" fill="#fff" opacity="0.9" />
    </svg>
  );
}