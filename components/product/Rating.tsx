export default function Rating({
  value,
  count,
  size = "sm",
}: {
  value: number;
  count?: number;
  size?: "sm" | "md";
}) {
  const px = size === "sm" ? 13 : 16;
  const label = count === undefined ? `Rated ${value} out of 5` : `Rated ${value} out of 5 from ${count} reviews`;

  return (
    <span className="inline-flex items-center gap-1.5" title={label}>
      <span className="flex" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, value - i));
          return (
            <svg key={i} width={px} height={px} viewBox="0 0 20 20" className="block">
              <defs>
                <linearGradient id={`star-${i}-${Math.round(fill * 100)}`}>
                  <stop offset={`${fill * 100}%`} stopColor="rgb(var(--brass))" />
                  <stop offset={`${fill * 100}%`} stopColor="rgb(var(--line))" />
                </linearGradient>
              </defs>
              <path
                d="M10 1.6l2.47 5.16 5.53.74-4.04 3.86 1.02 5.5L10 14.2l-4.98 2.66 1.02-5.5L2 7.5l5.53-.74z"
                fill={`url(#star-${i}-${Math.round(fill * 100)})`}
              />
            </svg>
          );
        })}
      </span>
      <span className="sr-only">{label}</span>
      {count !== undefined && (
        <span className="text-xs text-faint" aria-hidden="true">
          {value.toFixed(1)} ({count})
        </span>
      )}
    </span>
  );
}
