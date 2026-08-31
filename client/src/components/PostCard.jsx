import { MapPin, MessageCircleMore, Siren, ThumbsUp } from "lucide-react";
import ScoreBadge from "./ScoreBadge";
import StatusTimeline from "./StatusTimeline";

export default function PostCard({ issue, onUpvote, onComment, authorityMode = false, onStatusChange }) {
  const handleComment = async () => {
    const body = window.prompt("Add context to this issue:");
    if (body?.trim()) {
      await onComment(issue.id, body);
    }
  };

  return (
    <article className="soft-panel hover-lift overflow-hidden transition duration-300 hover:border-teal/25">
      {issue.mediaUrl ? (
        <img src={issue.mediaUrl} alt={issue.title} className="h-48 w-full object-cover transition duration-500 hover:scale-[1.03]" />
      ) : (
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-teal/20 via-sky-100 to-orange-100">
          <img
            src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80"
            alt="City street"
            className="h-full w-full object-cover opacity-65 transition duration-500 hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/25 to-transparent" />
        </div>
      )}

      <div className="space-y-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-teal/15 bg-teal/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-teal">
              <MapPin size={14} />
              {issue.locationName}
            </p>
            <h3 className="text-xl font-bold text-slate-800">{issue.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{issue.description}</p>
          </div>
          <ScoreBadge score={issue.urgencyScore} />
        </div>

        <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.2em] text-slate-600">
          <span className="rounded-full bg-sky-50 px-3 py-1">{issue.category}</span>
          <span className="rounded-full bg-orange/10 px-3 py-1">{issue.status}</span>
          {issue.authorityFlagged ? <span className="rounded-full bg-red-100 px-3 py-1 text-red-700">Authority Alert</span> : null}
        </div>

        <StatusTimeline updates={issue.updates} />

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onUpvote(issue.id)}
            className={`nav-button ${issue.hasUpvoted ? "bg-teal text-white hover:shadow-[0_12px_24px_rgba(19,181,166,0.24)]" : "bg-sky-50 text-slate-700 hover:bg-sky-100"}`}
          >
            <ThumbsUp size={16} />
            {issue.hasUpvoted ? "Voted" : "Upvote"} ({issue.votesCount})
          </button>
          <button type="button" onClick={handleComment} className="nav-button bg-orange/10 text-slate-700 hover:bg-orange/20">
            <MessageCircleMore size={16} />
            Comment
          </button>
        </div>

        {authorityMode ? (
          <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            {["Pending", "In Progress", "Resolved"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => onStatusChange(issue.id, status)}
                className="nav-button border border-slate-200 bg-white text-slate-700 hover:border-orange hover:bg-orange/10"
              >
                <Siren size={14} />
                {status}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
