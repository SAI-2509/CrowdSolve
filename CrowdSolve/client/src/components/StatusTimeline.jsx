const steps = ["Reported", "Verified", "Assigned", "Fixed"];

export default function StatusTimeline({ updates = [] }) {
  const reached = new Set(updates.map((item) => item.status));

  return (
    <div className="flex flex-wrap gap-3">
      {steps.map((step) => {
        const active = reached.has(step);

        return (
          <div
            key={step}
            className={`rounded-full border px-3 py-2 text-xs font-semibold ${
              active ? "border-teal/40 bg-teal/10 text-teal" : "border-slate-200 bg-white text-slate-500"
            }`}
          >
            {step}
          </div>
        );
      })}
    </div>
  );
}
