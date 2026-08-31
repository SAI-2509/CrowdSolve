import { useState } from "react";

const categories = [
  "Burst Pipe",
  "Water Leak",
  "Power Outage",
  "Road Damage",
  "Pothole",
  "Garbage Overflow",
  "Street Light",
  "Drainage Block",
  "Broken Bench",
  "Other"
];

export default function ReportForm({ onSubmit, user }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Pothole",
    locationName: user?.homeZone?.label || "",
    area: user?.area || "",
    city: user?.city || "",
    neighborhood: user?.neighborhood || "",
    lat: user?.homeZone?.coordinates?.lat || "",
    lng: user?.homeZone?.coordinates?.lng || "",
    mediaUrl: ""
  });
  const [file, setFile] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => payload.append(key, value));
    if (file) {
      payload.append("media", file);
    }

    await onSubmit(payload);
    setForm({
      title: "",
      description: "",
      category: "Pothole",
      locationName: user?.homeZone?.label || "",
      area: user?.area || "",
      city: user?.city || "",
      neighborhood: user?.neighborhood || "",
      lat: user?.homeZone?.coordinates?.lat || "",
      lng: user?.homeZone?.coordinates?.lng || "",
      mediaUrl: ""
    });
    setFile(null);
  }

  return (
    <form onSubmit={handleSubmit} className="soft-panel hover-lift p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Report Issue</h3>
          <p className="mt-1 text-sm text-slate-600">Fill the essentials and publish.</p>
        </div>
        <div className="rounded-full bg-orange/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-orange">
          Simple Form
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input required placeholder="Issue title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="field-input" />
        <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="field-input">
          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
        <input required placeholder="Street / landmark" value={form.locationName} onChange={(event) => setForm({ ...form, locationName: event.target.value })} className="field-input" />
        <input required placeholder="Area" value={form.area} onChange={(event) => setForm({ ...form, area: event.target.value, neighborhood: event.target.value })} className="field-input" />
        <input required placeholder="City" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} className="field-input" />
        <input required placeholder="Latitude" type="number" step="any" value={form.lat} onChange={(event) => setForm({ ...form, lat: event.target.value })} className="field-input" />
        <input required placeholder="Longitude" type="number" step="any" value={form.lng} onChange={(event) => setForm({ ...form, lng: event.target.value })} className="field-input" />
      </div>

      <textarea
        required
        placeholder="Describe the issue and impact."
        value={form.description}
        onChange={(event) => setForm({ ...form, description: event.target.value })}
        className="field-input mt-4 min-h-28 w-full"
      />

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <input type="url" placeholder="Fallback media URL (optional)" value={form.mediaUrl} onChange={(event) => setForm({ ...form, mediaUrl: event.target.value })} className="field-input" />
        <input type="file" accept="image/*,video/*" onChange={(event) => setFile(event.target.files?.[0] || null)} className="rounded-2xl border border-dashed border-teal/30 bg-teal/5 px-4 py-3 text-sm text-slate-600 transition hover:border-teal/60 hover:bg-teal/10" />
      </div>

      <button type="submit" className="nav-button mt-5 bg-orange text-white hover:translate-y-[-2px] hover:shadow-[0_14px_30px_rgba(255,143,63,0.25)]">
        Publish
      </button>
    </form>
  );
}
