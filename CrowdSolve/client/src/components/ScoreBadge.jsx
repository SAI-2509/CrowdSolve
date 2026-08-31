export default function ScoreBadge({ score }) {
  const tone =
    score >= 70
      ? "bg-red-100 text-red-700 border-red-200"
      : score >= 45
        ? "bg-orange-100 text-orange-700 border-orange-200"
        : "bg-emerald-100 text-emerald-700 border-emerald-200";

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] ${tone}`}>
      AI Score {score}
    </span>
  );
}
