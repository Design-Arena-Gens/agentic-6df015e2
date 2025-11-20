"use client";
import { useState } from "react";

export default function Home() {
  const [niche, setNiche] = useState("AI tools for creators");
  const [persona, setPersona] = useState("Creator coach");
  const [offer, setOffer] = useState("Starter Notion template");
  const [goal, setGoal] = useState("grow followers and conversions");
  const [cadence, setCadence] = useState(5);
  const [count, setCount] = useState(10);
  const [tone, setTone] = useState("concise and energetic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<any | null>(null);

  async function generatePlan(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPlan(null);
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche,
          persona,
          productOrOffer: offer,
          goal,
          cadencePerWeek: cadence,
          videoCount: count,
          tone,
        }),
      });
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const data = await res.json();
      setPlan(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-bold tracking-tight">TikTok Agent</h1>
        <p className="mt-1 text-zinc-600">
          Generate a high-signal TikTok content plan, hooks, scripts, and hashtags.
        </p>

        <form onSubmit={generatePlan} className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Niche</span>
            <input
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              placeholder="e.g., Home fitness, AI tools, Coffee"
              required
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Persona</span>
            <input
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              placeholder="e.g., Coach, Founder, Barista, Designer"
              required
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Product / Offer (optional)</span>
            <input
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              placeholder="e.g., Notion template, coaching, SaaS"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Primary Goal</span>
            <input
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              placeholder="e.g., grow followers and conversions"
              required
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Cadence per week</span>
            <input
              type="number"
              min={1}
              max={7}
              value={cadence}
              onChange={(e) => setCadence(Number(e.target.value))}
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Number of video ideas</span>
            <input
              type="number"
              min={5}
              max={30}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black"
            />
          </label>
          <label className="flex flex-col gap-1 md:col-span-2">
            <span className="text-sm font-medium">Tone</span>
            <input
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-black"
              placeholder="e.g., concise and energetic"
            />
          </label>
          <div className="md:col-span-2 mt-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-black px-4 py-2 font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
            >
              {loading ? "Generating?" : "Generate Plan"}
            </button>
            {error && <span className="text-sm text-red-600">{error}</span>}
          </div>
        </form>

        {plan && (
          <div className="mt-10 space-y-6">
            <div className="rounded-lg border border-zinc-200 bg-white p-5">
              <h2 className="text-xl font-semibold">Summary</h2>
              <p className="mt-1 text-zinc-700">{plan.summary}</p>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-5">
              <h3 className="text-lg font-semibold">Posting Schedule</h3>
              <ul className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {plan.postingSchedule?.map((s: string, i: number) => (
                  <li key={i} className="rounded-md bg-zinc-50 px-3 py-2 text-sm">{s}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-5">
              <h3 className="text-lg font-semibold">Content Pillars</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {plan.contentPillars?.map((p: string) => (
                  <span key={p} className="rounded-full border border-zinc-200 px-3 py-1 text-sm">{p}</span>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-5">
              <h3 className="text-lg font-semibold">Ideas</h3>
              <div className="mt-4 space-y-4">
                {plan.ideas?.map((idea: any, idx: number) => (
                  <div key={idx} className="rounded-md border border-zinc-200 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <h4 className="text-base font-semibold">{idea.title}</h4>
                      <span className="text-xs text-zinc-600">{idea.lengthSeconds}s</span>
                    </div>
                    <p className="mt-1 text-sm text-zinc-700">
                      Hook: <span className="font-medium">{idea.hook}</span>
                    </p>
                    <ol className="mt-3 list-decimal pl-5 text-sm text-zinc-700">
                      {idea.outline.map((o: string, i: number) => (
                        <li key={i}>{o}</li>
                      ))}
                    </ol>
                    <p className="mt-3 text-sm">
                      CTA: <span className="font-medium">{idea.callToAction}</span>
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {idea.hashtags.map((tag: string) => (
                        <span key={tag} className="rounded-full bg-zinc-100 px-2 py-1 text-xs">{tag}</span>
                      ))}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {idea.brollIdeas.map((b: string, i: number) => (
                        <span key={i} className="rounded-md border border-dashed border-zinc-300 px-2 py-1 text-xs">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
