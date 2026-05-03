import { useState, useEffect } from "react";
import { ChevronRight, RefreshCw, AlertCircle, Bug } from "lucide-react";

const BASE_URL = "https://elliott888-epl-model.hf.space";

// ─── Field resolver ───────────────────────────────────────────────────────────
// Tries multiple key names so we're resilient to whatever the API actually returns
function resolveFields(m) {
  const home = m.home_team  ?? m.homeTeam  ?? m.home  ?? null;
  const away = m.away_team  ?? m.awayTeam  ?? m.away  ?? null;

  // Result: "H" | "D" | "A"  OR  "home" | "draw" | "away"  OR  numeric goals
  let result = m.result ?? m.outcome ?? m.match_result ?? null;

  // Normalise text variants → H / D / A
  if (typeof result === "string") {
    const r = result.toUpperCase();
    if (r === "HOME" || r === "HOME WIN" || r === "1") result = "H";
    else if (r === "DRAW" || r === "X"   || r === "0") result = "D";
    else if (r === "AWAY" || r === "AWAY WIN" || r === "2") result = "A";
    else result = r; // already H/D/A hopefully
  }

  // Goals — derive result from goals if result is missing
  const hg = m.home_goals ?? m.homeGoals ?? m.home_score ?? m.fthg ?? null;
  const ag = m.away_goals ?? m.awayGoals ?? m.away_score ?? m.ftag ?? null;

  if (result === null && hg !== null && ag !== null) {
    const h = Number(hg), a = Number(ag);
    result = h > a ? "H" : h < a ? "A" : "D";
  }

  return {
    home,
    away,
    result,
    hg: hg !== null ? Number(hg) : 0,
    ag: ag !== null ? Number(ag) : 0,
  };
}

// ─── Build standings ──────────────────────────────────────────────────────────
function buildStandings(matches) {
  const table = {};
  let skipped = 0;

  matches.forEach((m) => {
    const { home, away, result, hg, ag } = resolveFields(m);

    if (!home || !away || !result || !["H", "D", "A"].includes(result)) {
      skipped++;
      return;
    }

    [home, away].forEach((team) => {
      if (!table[team]) {
        table[team] = { team, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0, form: [] };
      }
    });

    table[home].played++;
    table[home].gf += hg;
    table[home].ga += ag;

    table[away].played++;
    table[away].gf += ag;
    table[away].ga += hg;

    if (result === "H") {
      table[home].won++;    table[home].points += 3; table[home].form.push("W");
      table[away].lost++;                            table[away].form.push("L");
    } else if (result === "D") {
      table[home].drawn++;  table[home].points += 1; table[home].form.push("D");
      table[away].drawn++;  table[away].points += 1; table[away].form.push("D");
    } else {
      table[home].lost++;                            table[home].form.push("L");
      table[away].won++;    table[away].points += 3; table[away].form.push("W");
    }
  });

  console.log(`[Leaderboard] Processed ${matches.length - skipped} matches, skipped ${skipped}`);

  return Object.values(table)
    .map((t) => ({ ...t, gd: t.gf - t.ga, form: t.form.slice(-5) }))
    .sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf)
    .map((t, i) => ({ ...t, pos: i + 1 }));
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formStyle = { W: "bg-green-500", D: "bg-slate-500", L: "bg-red-500" };

const zoneStyle = (pos, total) => {
  if (pos <= 4)           return "border-l-2 border-blue-500";
  if (pos <= 6)           return "border-l-2 border-orange-500";
  if (pos >= total - 2)   return "border-l-2 border-red-500";
  return "";
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function Leaderboard() {
  const [standings, setStandings]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [debugOpen, setDebugOpen]     = useState(false);
  const [rawSample, setRawSample]     = useState(null);
  const [stats, setStats]             = useState({ total: 0, skipped: 0 });

  const fetchStandings = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated — please log in first.");

      const res = await fetch(`${BASE_URL}/historical-matches?skip=0&limit=380`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) throw new Error("Session expired. Please log in again.");
      if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);

      const data = await res.json();
      console.log("[Leaderboard] Raw API response:", data);

      // Unwrap common envelope shapes
      const matches =
        Array.isArray(data)        ? data         :
        Array.isArray(data.items)  ? data.items   :
        Array.isArray(data.data)   ? data.data    :
        Array.isArray(data.matches)? data.matches :
        [];

      // Save a sample for the debug panel
      setRawSample(matches.length > 0 ? matches[0] : data);

      if (matches.length === 0) {
        setStandings([]);
        setStats({ total: 0, skipped: 0 });
        setLastUpdated(new Date().toLocaleTimeString());
        return;
      }

      // Count skips by doing a dry run
      let skipped = 0;
      matches.forEach((m) => {
        const { home, away, result } = resolveFields(m);
        if (!home || !away || !["H","D","A"].includes(result)) skipped++;
      });

      const table = buildStandings(matches);
      setStandings(table);
      setStats({ total: matches.length, skipped });
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("[Leaderboard] Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStandings(); }, []);

  return (
    <section className="bg-slate-950 p-6 rounded-xl border border-slate-800">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-white text-xl font-bold uppercase tracking-wider">
            🏴󠁧󠁢󠁥󠁮󠁧󠁿 EPL Standings
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            Built from match history.
            {lastUpdated && <span className="ml-1 text-slate-600">Updated {lastUpdated}</span>}
            {stats.total > 0 && (
              <span className="ml-2 text-slate-600">
                {stats.total - stats.skipped}/{stats.total} matches used
                {stats.skipped > 0 && (
                  <button
                    onClick={() => setDebugOpen((o) => !o)}
                    className="ml-1 text-yellow-500 hover:text-yellow-400 underline"
                  >
                    ({stats.skipped} skipped — debug)
                  </button>
                )}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDebugOpen((o) => !o)}
            title="Inspect raw API response"
            className="text-slate-600 hover:text-yellow-400 transition-colors"
          >
            <Bug size={14} />
          </button>
          <button
            onClick={fetchStandings}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-400 transition-colors disabled:opacity-40"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Debug Panel ───────────────────────────────────────────── */}
      {debugOpen && (
        <div className="mb-4 bg-slate-900 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-yellow-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Bug size={12} /> Raw API Sample (first record)
            </p>
            <button onClick={() => setDebugOpen(false)} className="text-slate-500 hover:text-white text-xs">✕ Close</button>
          </div>
          {rawSample ? (
            <>
              <pre className="text-green-400 text-xs overflow-auto max-h-60 bg-black/40 rounded p-3">
                {JSON.stringify(rawSample, null, 2)}
              </pre>
              <p className="text-slate-500 text-xs mt-2">
                👆 Check the field names above. Update <code className="text-yellow-400">resolveFields()</code> if
                your API uses different keys for home team, away team, or result.
              </p>
            </>
          ) : (
            <p className="text-slate-500 text-xs">No data fetched yet.</p>
          )}
        </div>
      )}

      {/* Zone legend */}
      <div className="flex gap-4 mb-4 flex-wrap">
        {[
          { color: "bg-blue-500",   label: "Champions League" },
          { color: "bg-orange-500", label: "Europa League"    },
          { color: "bg-red-500",    label: "Relegation Zone"  },
        ].map((z) => (
          <div key={z.label} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-sm ${z.color}`} />
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{z.label}</span>
          </div>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <RefreshCw size={28} className="animate-spin text-blue-500" />
          <p className="text-slate-500 text-sm">Loading standings…</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg mb-4">
          <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-400 text-sm font-medium">Failed to load standings</p>
            <p className="text-red-400/70 text-xs mt-0.5">{error}</p>
          </div>
          <button
            onClick={fetchStandings}
            className="text-xs text-red-400 hover:text-white border border-red-500/30 px-3 py-1.5 rounded hover:bg-red-500 transition-all flex-shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty — but no error */}
      {!loading && !error && standings.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-2">
          <span className="text-4xl">⚽</span>
          <p className="text-slate-400 font-medium">No match data could be processed.</p>
          <p className="text-slate-600 text-sm">
            {stats.total > 0
              ? `${stats.total} records were fetched but none had usable result data. Click the 🐛 debug button to inspect the raw API fields.`
              : "No historical matches returned from the API."}
          </p>
          <button
            onClick={() => setDebugOpen(true)}
            className="mt-2 text-xs text-yellow-400 border border-yellow-500/30 px-3 py-1.5 rounded hover:bg-yellow-500/10 transition-all flex items-center gap-1.5"
          >
            <Bug size={12} /> Open Debug Panel
          </button>
        </div>
      )}

      {/* Table */}
      {!loading && standings.length > 0 && (
        <>
          {/* Header row */}
          <div className="grid grid-cols-12 px-3 pb-2 border-b border-slate-800">
            {["#", "Club", "P", "W", "D", "L", "GD", "Form", "Pts"].map((h, i) => (
              <span
                key={h}
                className={`text-[10px] text-slate-600 uppercase font-bold
                  ${i === 0 ? "col-span-1" : i === 1 ? "col-span-3" : i === 7 ? "col-span-2 hidden md:block text-center" : "col-span-1 text-center"}`}
              >
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          <div className="space-y-1 mt-1">
            {standings.map((team) => (
              <div
                key={team.team}
                className={`group grid grid-cols-12 items-center bg-slate-900/40 rounded-lg px-3 py-2.5
                            hover:bg-slate-800/60 transition-all duration-200 ${zoneStyle(team.pos, standings.length)}`}
              >
                <span className="col-span-1 text-slate-400 text-sm font-bold">{team.pos}</span>
                <span className="col-span-3 text-white text-sm font-semibold truncate">{team.team}</span>
                <span className="col-span-1 text-slate-400 text-xs text-center">{team.played}</span>
                <span className="col-span-1 text-green-400 text-xs font-bold text-center">{team.won}</span>
                <span className="col-span-1 text-slate-400 text-xs text-center">{team.drawn}</span>
                <span className="col-span-1 text-red-400 text-xs text-center">{team.lost}</span>
                <span className={`col-span-1 text-xs font-bold text-center ${team.gd > 0 ? "text-green-400" : team.gd < 0 ? "text-red-400" : "text-slate-400"}`}>
                  {team.gd > 0 ? `+${team.gd}` : team.gd}
                </span>

                {/* Form pills */}
                <div className="col-span-2 hidden md:flex items-center justify-center gap-0.5">
                  {team.form.map((f, i) => (
                    <span
                      key={i}
                      className={`w-4 h-4 rounded-sm text-[8px] font-black flex items-center justify-center text-white ${formStyle[f]}`}
                    >
                      {f}
                    </span>
                  ))}
                </div>

                <span className="col-span-1 text-white text-sm font-black text-center">{team.points}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
