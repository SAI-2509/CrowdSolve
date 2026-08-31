import { useState } from "react";

const citizenTemplate = {
  name: "",
  email: "",
  password: "",
  role: "citizen",
  area: "",
  city: "",
  neighborhood: "",
  homeZone: {
    label: "",
    address: "",
    coordinates: {
      lat: 28.6139,
      lng: 77.209
    }
  }
};

const authorityCredentials = {
  name: "CrowdSolve Authority",
  email: "authority@crowdsolve.gov",
  password: "Authority@123"
};

export default function AuthPanel({ onLogin, onSignup, error, loading }) {
  const [mode, setMode] = useState("signup");
  const [form, setForm] = useState(citizenTemplate);

  function updateCoordinate(key, value) {
    setForm({
      ...form,
      homeZone: {
        ...form.homeZone,
        coordinates: {
          ...form.homeZone.coordinates,
          [key]: Number(value)
        }
      }
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (mode === "login") {
      await onLogin({ email: form.email, password: form.password });
      return;
    }

    await onSignup({ ...form, role: "citizen" });
  }

  function fillAuthorityDemo() {
    setMode("login");
    setForm({
      ...form,
      email: authorityCredentials.email,
      password: authorityCredentials.password
    });
  }

  return (
    <section className="section-shell py-12">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <div className="inline-flex rounded-full border border-teal/30 bg-teal/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-teal">
            Localized Identity
          </div>
          <h1 className="max-w-3xl text-4xl font-black leading-tight text-slate-800 sm:text-5xl">
            CrowdSolve turns neighborhood frustration into visible, ranked civic action.
          </h1>
          <p className="max-w-2xl text-lg text-slate-600">
            Report street-level issues, rally nearby residents, and give municipal teams a live queue powered by votes,
            category severity, and elapsed time.
          </p>
        </div>

        <div className="soft-panel overflow-hidden p-6">
          <div className="mb-6 rounded-[24px] bg-[url('https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center p-5">
            <div className="max-w-sm rounded-[20px] bg-white p-4 shadow-[0_12px_24px_rgba(15,60,90,0.08)]">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-teal">Welcome in</p>
              <p className="mt-1 text-sm font-medium text-slate-800">Sign in fast or create a bright, localized civic profile.</p>
            </div>
          </div>

          <div className="mb-6 flex gap-2 rounded-full bg-sky-50 p-1">
            {["signup", "login"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setMode(tab)}
                className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold capitalize ${
                  mode === tab ? "bg-teal text-white" : "text-slate-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" ? (
              <>
                <input
                  required
                  placeholder="Full name"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  className="field-input w-full"
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    required
                    placeholder="Area"
                    value={form.area}
                    onChange={(event) => setForm({ ...form, area: event.target.value, neighborhood: event.target.value })}
                    className="field-input w-full"
                  />
                  <input
                    required
                    placeholder="City"
                    value={form.city}
                    onChange={(event) => setForm({ ...form, city: event.target.value })}
                    className="field-input w-full"
                  />
                </div>
              </>
            ) : null}

            <input
              required
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              className="field-input w-full"
            />
            <input
              required
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              className="field-input w-full"
            />

            {mode === "signup" ? (
              <>
                <input
                  required
                  placeholder="Zone / locality"
                  value={form.homeZone.label}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      homeZone: { ...form.homeZone, label: event.target.value }
                    })
                  }
                  className="field-input w-full"
                />
                <input
                  required
                  placeholder="Home address"
                  value={form.homeZone.address}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      homeZone: { ...form.homeZone, address: event.target.value }
                    })
                  }
                  className="field-input w-full"
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    required
                    type="number"
                    step="any"
                    placeholder="Latitude"
                    value={form.homeZone.coordinates.lat}
                    onChange={(event) => updateCoordinate("lat", event.target.value)}
                    className="field-input w-full"
                  />
                  <input
                    required
                    type="number"
                    step="any"
                    placeholder="Longitude"
                    value={form.homeZone.coordinates.lng}
                    onChange={(event) => updateCoordinate("lng", event.target.value)}
                    className="field-input w-full"
                  />
                </div>
              </>
            ) : null}

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-orange px-5 py-3 font-bold text-white transition hover:scale-[1.01] disabled:opacity-60"
            >
              {loading ? "Working..." : mode === "signup" ? "Create CrowdSolve account" : "Enter dashboard"}
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-sky-100 bg-sky-50 p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-800">Fixed authority login</p>
            <p className="mt-2">Name: {authorityCredentials.name}</p>
            <p>Email: {authorityCredentials.email}</p>
            <p>Password: {authorityCredentials.password}</p>
            <button type="button" onClick={fillAuthorityDemo} className="mt-3 rounded-full bg-slate-800 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:translate-y-[-1px]">
              Use authority login
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
