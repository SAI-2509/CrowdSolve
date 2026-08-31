import { useEffect, useMemo, useState } from "react";
import { Building2, LogOut, Radar, ScrollText, SquarePen, Users } from "lucide-react";
import { useCrowdSolve } from "./hooks/useCrowdSolve";
import AuthPanel from "./pages/AuthPanel";
import AuthorityDashboard from "./pages/AuthorityDashboard";
import CitizenDashboard from "./pages/CitizenDashboard";
import LandingPage from "./pages/LandingPage";

const citizenViews = [
  { id: "feed", label: "Feed", icon: Users },
  { id: "report", label: "Report", icon: SquarePen },
  { id: "tracking", label: "My Reports", icon: ScrollText }
];

const authorityViews = [
  { id: "map", label: "Map", icon: Radar },
  { id: "queue", label: "Queue", icon: Building2 }
];

function DashboardShell({ user, views, activeView, onChangeView, onLogout, children }) {
  return (
    <div className="section-shell relative py-6">
      <div className="pointer-events-none absolute inset-x-4 top-0 -z-10 h-72 rounded-[48px] bg-[radial-gradient(circle_at_top_left,rgba(19,181,166,0.24),transparent_28%),radial-gradient(circle_at_top_right,rgba(255,143,63,0.22),transparent_24%),linear-gradient(135deg,#f5fffd_0%,#eef8ff_52%,#fff5ea_100%)]" />
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="soft-panel hover-lift hidden h-fit p-5 lg:block lg:sticky lg:top-6">
          <p className="text-xs uppercase tracking-[0.28em] text-teal">CROWDSOLVE</p>
          <h1 className="mt-2 text-2xl font-black text-slate-800">CROWDSOLVE</h1>
          <p className="mt-2 text-sm text-slate-600">{user.area}, {user.city}</p>

          <div className="mt-6 rounded-[24px] bg-gradient-to-br from-teal/10 via-white to-orange/10 p-4">
            <p className="text-sm font-semibold text-slate-800">{user.name}</p>
            <p className="mt-1 text-sm text-slate-600 capitalize">{user.role}</p>
          </div>

          <nav className="mt-6 space-y-2">
            {views.map((item) => {
              const Icon = item.icon;
              const active = item.id === activeView;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onChangeView(item.id)}
                  className={`nav-button w-full justify-start ${active ? "bg-slate-800 text-white shadow-[0_12px_28px_rgba(15,23,42,0.18)]" : "bg-white text-slate-700 hover:bg-sky-50"}`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <button type="button" onClick={onLogout} className="nav-button mt-8 w-full justify-start bg-orange text-white hover:translate-y-[-2px] hover:shadow-[0_14px_30px_rgba(255,143,63,0.25)]">
            <LogOut size={18} />
            Logout
          </button>
        </aside>

        <div className="space-y-6 pb-24 lg:pb-0">
          <div className="soft-panel hover-lift flex items-center justify-between p-4 lg:hidden">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-teal">CROWDSOLVE</p>
              <h2 className="mt-1 text-lg font-black text-slate-800">CROWDSOLVE</h2>
            </div>
            <button type="button" onClick={onLogout} className="nav-button bg-slate-800 text-white">
              <LogOut size={16} />
              Logout
            </button>
          </div>

          {children}
        </div>
      </div>

      <div className="fixed inset-x-4 bottom-4 z-30 lg:hidden">
        <div className="glass-card grid grid-cols-3 gap-2 rounded-[28px] p-2">
          {views.map((item) => {
            const Icon = item.icon;
            const active = item.id === activeView;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangeView(item.id)}
                className={`flex flex-col items-center gap-1 rounded-[20px] px-3 py-3 text-xs font-semibold transition ${active ? "bg-teal text-white shadow-[0_12px_22px_rgba(19,181,166,0.28)]" : "text-slate-600 hover:bg-sky-50"}`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const app = useCrowdSolve();
  const [started, setStarted] = useState(false);
  const views = useMemo(() => (app.user?.role === "authority" ? authorityViews : citizenViews), [app.user?.role]);
  const [activeView, setActiveView] = useState("feed");

  useEffect(() => {
    if (!app.user) {
      setActiveView("feed");
      return;
    }

    setActiveView(app.user.role === "authority" ? "map" : "feed");
    app.loadFeed("local");
    app.loadMyIssues();
    if (app.user.role === "authority") {
      app.loadAuthorityDashboard();
    }
  }, [app.user]);

  if (!app.user) {
    return (
      <div className="min-h-screen pb-12 text-slate-800">
        <header className="section-shell sticky top-0 z-20 py-5">
          <div className="glass-card flex items-center justify-between rounded-[30px] px-5 py-4">
            <div>
              <h1 className="text-xl font-black text-slate-800">CROWDSOLVE</h1>
              <p className="mt-1 text-sm text-slate-500">Community-first city issue reporting and action tracking.</p>
            </div>

            <button
              type="button"
              onClick={() => setStarted(true)}
              className="rounded-full bg-orange px-5 py-3 text-sm font-bold text-white shadow-[0_14px_30px_rgba(255,143,63,0.3)] transition hover:translate-y-[-2px]"
            >
              Join CrowdSolve
            </button>
          </div>
        </header>

        <LandingPage publicMetrics={app.publicMetrics} onStart={() => setStarted(true)} />
        {!app.user && started ? (
          <AuthPanel onLogin={app.login} onSignup={app.signup} error={app.error} loading={app.loading} />
        ) : null}
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-800">
      <DashboardShell
        user={app.user}
        views={views}
        activeView={activeView}
        onChangeView={setActiveView}
        onLogout={app.logout}
      >
        {app.user.role === "citizen" ? (
          <CitizenDashboard
            user={app.user}
            activeView={activeView}
            feed={app.feed}
            myIssues={app.myIssues}
            onLoadFeed={app.loadFeed}
            onCreateIssue={app.createIssue}
            onUpvote={app.upvoteIssue}
            onComment={app.commentOnIssue}
          />
        ) : (
          <AuthorityDashboard
            activeView={activeView}
            dashboard={app.authorityView}
            onUpvote={app.upvoteIssue}
            onComment={app.commentOnIssue}
            onStatusChange={app.updateIssueStatus}
          />
        )}
      </DashboardShell>
    </div>
  );
}
