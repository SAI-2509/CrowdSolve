import { ArrowRight, MapPinned, Radar, ShieldCheck } from "lucide-react";
import StatCard from "../components/StatCard";

export default function LandingPage({ publicMetrics, onStart }) {
  const metrics = publicMetrics || {
    totalIssues: 184,
    resolvedIssues: 129,
    activeUsers: 3200,
    activeIssues: 55
  };

  return (
    <section className="section-shell pb-12 pt-6">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <div className="inline-flex rounded-full border border-teal/20 bg-teal/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-teal">
            Smart City Civic Intelligence
          </div>
          <h1 className="mt-5 max-w-4xl text-3xl font-black leading-tight text-slate-800 md:text-4xl">
            Spot it. Post it. CrowdSolve helps your city fix what matters first.
          </h1>
          <p className="mt-6 max-w-2xl text-sm text-slate-600 md:text-base">
            A social-style civic feed where residents document issues, neighbors amplify them, and authorities receive a
            ranked action queue based on community impact and AI urgency scoring.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={onStart}
              className="inline-flex items-center gap-2 rounded-full bg-orange px-6 py-3 font-bold text-white transition hover:scale-[1.02]"
            >
              Launch CrowdSolve
              <ArrowRight size={18} />
            </button>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white px-5 py-3 text-sm text-slate-700">
              <MapPinned size={18} />
              Geo-tagged local feed
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="soft-panel hover-lift p-5">
              <Radar className="text-teal" />
                <h3 className="mt-4 text-base font-bold text-slate-800">Hyper-local visibility</h3>
              <p className="mt-2 text-sm text-slate-600">
                Home Zone onboarding ensures users first see the problems affecting their own streets and neighborhoods.
              </p>
            </div>
            <div className="soft-panel hover-lift p-5">
              <ShieldCheck className="text-orange" />
                <h3 className="mt-4 text-base font-bold text-slate-800">Transparent resolution journey</h3>
              <p className="mt-2 text-sm text-slate-600">
                Every issue shows its journey from report to fix, with proof photos and visible accountability.
              </p>
            </div>
          </div>
        </div>

        <div className="soft-panel hover-lift relative overflow-hidden p-6">
          <div className="absolute inset-0 bg-grid bg-[size:22px_22px] opacity-20" />
          <div className="relative overflow-hidden rounded-[32px] bg-[url('https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard label="Issues Resolved" value={metrics.resolvedIssues} accent="bg-teal/15 text-teal" />
              <StatCard label="Active Users" value={metrics.activeUsers} accent="bg-orange/15 text-orange" />
              <StatCard label="Open Reports" value={metrics.activeIssues} accent="bg-sky-100 text-sky-700" />
              <StatCard label="Total Logged" value={metrics.totalIssues} accent="bg-teal/10 text-teal" />
            </div>
          </div>

          <div className="relative mt-6 rounded-[28px] border border-sky-100 bg-gradient-to-r from-white to-orange-50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-teal">Trending Urgent</p>
                <h3 className="mt-1 text-base font-bold text-slate-800">Burst pipe near Green Market</h3>
              </div>
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-red-700">
                AI 88
              </span>
            </div>
            <div className="mt-5 h-56 rounded-[24px] bg-[url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center p-5">
              <div className="flex h-full flex-col justify-between">
                <div className="max-w-xs rounded-2xl bg-white/85 p-4 backdrop-blur">
                  <p className="text-sm text-slate-700">Localized civic posts look and feel like a trusted urban operations feed.</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {["Reported", "Verified", "Assigned"].map((step) => (
                    <div key={step} className="rounded-2xl bg-white/85 px-3 py-2 text-center text-xs font-semibold text-slate-700">
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
