export default function Leaderboard({ contributors = [] }) {
  return (
    <div className="soft-panel p-5">
      <h3 className="text-lg font-bold text-slate-800">Civic Leaderboard</h3>
      <p className="mt-1 text-sm text-slate-600">Top residents driving visibility and action.</p>
      <div className="mt-4 space-y-3">
        {contributors.map((contributor, index) => (
          <div key={contributor._id || contributor.name} className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-sky-50 to-orange-50 px-4 py-3">
            <div>
              <p className="font-semibold text-slate-800">
                {index + 1}. {contributor.name}
              </p>
              <p className="text-sm text-slate-600">{contributor.neighborhood || "Smart City District"}</p>
            </div>
            <span className="rounded-full bg-teal/15 px-3 py-1 text-sm font-bold text-teal">
              {contributor.contributionPoints} pts
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
