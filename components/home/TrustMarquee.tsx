const ITEMS = [
  { title: "Free Shipping", detail: "On orders over $150" },
  { title: "Easy Returns", detail: "30-day return policy" },
  { title: "Secure Checkout", detail: "Guest orders welcome" },
  { title: "Measured Fit", detail: "Sizing from your body, not a chart" },
];

function Row({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <ul
      className="flex shrink-0 items-center gap-12 pr-12"
      aria-hidden={ariaHidden ? "true" : undefined}
    >
      {ITEMS.map((item) => (
        <li key={item.title} className="flex items-center gap-3 whitespace-nowrap">
          <span className="h-1.5 w-1.5 rounded-full bg-brass" />
          <span className="text-sm font-medium text-ink">{item.title}</span>
          <span className="text-sm text-muted">{item.detail}</span>
        </li>
      ))}
    </ul>
  );
}

export default function TrustMarquee() {
  return (
    <section className="overflow-hidden border-b border-line bg-surface py-4">
      <div className="flex w-max animate-marquee">
        <Row />
        <Row ariaHidden />
      </div>
    </section>
  );
}
