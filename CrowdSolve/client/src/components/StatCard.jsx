export default function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-3xl border border-white bg-white/95 p-5 shadow-[0_16px_40px_rgba(15,60,90,0.08)]">
      <div className={`mb-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] ${accent}`}>
        {label}
      </div>
      <p className="text-3xl font-black text-slate-800">{value}</p>
    </div>
  );
}
