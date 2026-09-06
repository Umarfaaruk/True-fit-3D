export default function HangerIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 8.2a2.1 2.1 0 1 1 2.1-2.1" />
      <path d="M12 8.2v2.1" />
      <path d="M12 10.3 3.6 15.9a1.3 1.3 0 0 0 .7 2.4h15.4a1.3 1.3 0 0 0 .7-2.4L12 10.3Z" />
    </svg>
  );
}
