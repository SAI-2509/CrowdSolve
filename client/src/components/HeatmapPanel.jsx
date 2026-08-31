export default function HeatmapPanel({ heatmap = [] }) {
  const focus = heatmap[0];
  const mapQuery = focus
    ? `https://www.google.com/maps?q=${focus.coordinates?.lat},${focus.coordinates?.lng}&z=14&output=embed`
    : "https://www.google.com/maps?q=28.6139,77.209&z=12&output=embed";

  return (
    <div className="soft-panel hover-lift overflow-hidden p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">City Map</h3>
          <p className="mt-1 text-sm text-slate-600">Google Maps preview centered on the highest-priority report.</p>
        </div>
        <div className="rounded-full bg-teal/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-teal">
          Real map
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-[28px] border border-sky-100">
        <iframe
          title="Authority map preview"
          src={mapQuery}
          className="h-[360px] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="mt-5 space-y-3">
        {heatmap.slice(0, 4).map((point) => (
          <div key={point.id} className="rounded-[22px] border border-sky-100 bg-gradient-to-r from-white to-sky-50 p-4 transition hover:border-teal/25 hover:shadow-[0_14px_28px_rgba(19,181,166,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-800">{point.title}</p>
                <p className="mt-1 text-sm text-slate-600">{point.locationName}</p>
              </div>
              <span className="rounded-full bg-orange/10 px-3 py-1 text-sm font-bold text-orange">{point.urgencyScore}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
