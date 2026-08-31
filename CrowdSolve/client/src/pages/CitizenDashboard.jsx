import { useEffect, useMemo, useState } from "react";
import { Building2, MapPinned, Radar, ScrollText, SquareStack } from "lucide-react";
import PostCard from "../components/PostCard";
import ReportForm from "../components/ReportForm";

function LocalMap({ user }) {
  const mapQuery = `https://www.google.com/maps?q=${user?.homeZone?.coordinates?.lat || 28.6139},${user?.homeZone?.coordinates?.lng || 77.209}&z=14&output=embed`;

  return (
    <div className="soft-panel hover-lift p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Local Map</h3>
          <p className="mt-1 text-sm text-slate-600">{user?.area}, {user?.city}</p>
        </div>
        <MapPinned className="text-teal" />
      </div>

      <div className="mt-5 overflow-hidden rounded-[24px] border border-sky-100">
        <iframe
          title="Citizen local map"
          src={mapQuery}
          className="h-[320px] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}

export default function CitizenDashboard({
  user,
  activeView,
  feed,
  myIssues,
  onLoadFeed,
  onCreateIssue,
  onUpvote,
  onComment
}) {
  const [tab, setTab] = useState("local");

  useEffect(() => {
    onLoadFeed(tab);
  }, [tab, onLoadFeed]);

  const stats = useMemo(
    () => [
      { label: "Local Issues", value: feed.length, icon: Radar },
      { label: "My Reports", value: myIssues.length, icon: ScrollText },
      { label: "Zone", value: user.homeZone?.label || "-", icon: SquareStack },
      { label: "Area", value: user.area || "-", icon: Building2 },
      { label: "City", value: user.city || "-", icon: MapPinned }
    ],
    [feed.length, myIssues.length, user.homeZone?.label, user.area, user.city]
  );

  return (
    <section className="space-y-6">
      <div className="soft-panel hover-lift p-5">
        <p className="text-sm uppercase tracking-[0.25em] text-teal">CROWDSOLVE</p>
        <h2 className="mt-2 text-3xl font-black text-slate-800">CROWDSOLVE</h2>
        <p className="mt-2 text-slate-600">{user.area}, {user.city}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="soft-panel hover-lift flex items-center gap-4 p-4">
              <div className="rounded-2xl bg-teal/10 p-3 text-teal">
                <Icon size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className="truncate text-lg font-bold text-slate-800">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {activeView === "feed" ? (
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <div className="soft-panel hover-lift flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Issue Feed</h3>
              </div>
              <div className="flex gap-2 rounded-full bg-sky-50 p-1">
                {[
                  { id: "local", label: "For You" },
                  { id: "trending", label: "Trending" }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTab(item.id)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${tab === item.id ? "bg-teal text-white shadow-[0_12px_22px_rgba(19,181,166,0.24)]" : "text-slate-600 hover:bg-white"}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {feed.length ? (
              feed.map((issue) => <PostCard key={issue.id} issue={issue} onUpvote={onUpvote} onComment={onComment} />)
            ) : (
              <div className="soft-panel p-8 text-center text-slate-600">No issues in this view yet.</div>
            )}
          </div>

          <LocalMap user={user} />
        </div>
      ) : null}

      {activeView === "report" ? (
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <ReportForm onSubmit={onCreateIssue} user={user} />
          <LocalMap user={user} />
        </div>
      ) : null}

      {activeView === "tracking" ? (
        <div className="soft-panel hover-lift p-5">
          <h3 className="text-xl font-bold text-slate-800">My Reports</h3>
          <div className="mt-5 space-y-3">
            {myIssues.map((issue) => (
              <div key={issue.id} className="rounded-[24px] border border-sky-100 bg-gradient-to-r from-white to-sky-50 p-4 transition hover:border-teal/25 hover:shadow-[0_14px_28px_rgba(19,181,166,0.08)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-800">{issue.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{issue.locationName} · {issue.area}, {issue.city}</p>
                  </div>
                  <span className="rounded-full bg-orange/10 px-3 py-1 text-sm font-semibold text-orange">{issue.status}</span>
                </div>
              </div>
            ))}
            {!myIssues.length ? <p className="text-sm text-slate-600">Your reports will appear here once posted.</p> : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
