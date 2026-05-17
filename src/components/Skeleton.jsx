export function SkeletonCard() {
  return (
    <div className="skeleton-card skeleton-pulse" />
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="movies-content">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonHero() {
  return <div className="skeleton-hero skeleton-pulse" style={{ minHeight: "100vh" }} />;
}
