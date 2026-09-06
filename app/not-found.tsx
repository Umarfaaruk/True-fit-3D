import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell py-32 text-center">
      <p className="label">404</p>
      <h1 className="mt-3 font-serif text-4xl tracking-tight text-ink">
        That piece is not in the wardrobe.
      </h1>
      <p className="mx-auto mt-3 max-w-sm text-sm text-muted">
        The page you were after does not exist, or has been retired from the collection.
      </p>
      <Link href="/shop" className="btn-primary mt-8">
        Browse the wardrobe
      </Link>
    </div>
  );
}
