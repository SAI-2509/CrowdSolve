import HeatmapPanel from "../components/HeatmapPanel";
import PostCard from "../components/PostCard";

function selectResultFile() {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => resolve(input.files?.[0] || null);
    input.click();
  });
}

export default function AuthorityDashboard({ activeView, dashboard, onUpvote, onComment, onStatusChange }) {
  async function handleStatusChange(issueId, status) {
    const note = window.prompt(`Add a note for ${status}:`, `CrowdSolve status updated to ${status}.`) || "";
    let payload;

    if (status === "Resolved") {
      const file = await selectResultFile();
      payload = new FormData();
      payload.append("status", status);
      payload.append("note", note);
      if (file) {
        payload.append("resultMedia", file);
      }
    } else {
      payload = { status, note };
    }

    await onStatusChange(issueId, payload);
  }

  const highPriority = dashboard.rankedIssues?.filter((issue) => issue.urgencyScore >= 50).length || 0;

  return (
    <section className="space-y-6">
      <div className="soft-panel hover-lift p-5">
        <p className="text-sm uppercase tracking-[0.25em] text-orange">CROWDSOLVE</p>
        <h2 className="mt-2 text-3xl font-black text-slate-800">Authority Dashboard</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="soft-panel hover-lift p-4">
          <p className="text-sm text-slate-500">Total Reports</p>
          <p className="mt-2 text-2xl font-black text-slate-800">{dashboard.rankedIssues?.length || 0}</p>
        </div>
        <div className="soft-panel hover-lift p-4">
          <p className="text-sm text-slate-500">High Priority</p>
          <p className="mt-2 text-2xl font-black text-slate-800">{highPriority}</p>
        </div>
        <div className="soft-panel hover-lift p-4">
          <p className="text-sm text-slate-500">Heatmap Pins</p>
          <p className="mt-2 text-2xl font-black text-slate-800">{dashboard.heatmap?.length || 0}</p>
        </div>
      </div>

      {activeView === "map" ? <HeatmapPanel heatmap={dashboard.heatmap} /> : null}

      {activeView === "queue" ? (
        <div className="space-y-5">
          {dashboard.rankedIssues?.length ? (
            dashboard.rankedIssues.map((issue) => (
              <PostCard
                key={issue._id || issue.id}
                issue={{ ...issue, id: issue._id || issue.id, hasUpvoted: false }}
                onUpvote={onUpvote}
                onComment={onComment}
                authorityMode
                onStatusChange={handleStatusChange}
              />
            ))
          ) : (
            <div className="soft-panel p-8 text-center text-slate-600">Authority queue is empty right now.</div>
          )}
        </div>
      ) : null}
    </section>
  );
}
