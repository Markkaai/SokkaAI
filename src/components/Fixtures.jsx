import { useState, useEffect } from "react";
import { ChevronRight, Info, RefreshCw, AlertCircle } from "lucide-react";

const BASE_URL = "https://elliott888-epl-model.hf.space";

export default function Fixtures() {
  const [fixtures, setFixtures]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchFixtures = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/predictions?skip=0&limit=20`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
      const data = await res.json();
      const items = Array.isArray(data) ? data : data.items ?? [];
      setFixtures(items);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFixtures();
  }, []);

  // Convert 0-1 probability to percentage string for bar widths
  const toPercent = (val) => `${Math.round((val ?? 0) * 100)}%`;

  // Format match date
  const formatDate = (dateStr) => {
    if (!dateStr) return "TBD";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }).toUpperCase();
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "--:--";
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  };

  // Confidence colour
  const confidenceColor = (val) => {
    if (!val) return "text-slate-500";
    if (val >= 0.75) return "text-green-400";
    if (val >= 0.55) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <section className="bg-slate-950 p-6 rounded-xl border border-slate-900">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-white text-xl font-bold uppercase tracking-wider">Upcoming Fixtures</h2>
          <p className="text-slate-500 text-sm">
            AI-powered match predictions.
            {lastUpdated && <span className="ml-1 text-slate-600">Updated {lastUpdated}</span>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchFixtures}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-400 transition-colors disabled:opacity-40"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button className="text-blue-500 text-sm font-semibold hover:underline flex items-center gap-1">
            View All <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw size={28} className="animate-spin text-blue-500" />
            <p className="text-slate-500 text-sm">Loading fixtures...</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg mb-4">
          <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
          <div>
            <p className="text-red-400 text-sm font-medium">Failed to load fixtures</p>
            <p className="text-red-400/70 text-xs mt-0.5">{error}</p>
          </div>
          <button
            onClick={fetchFixtures}
            className="ml-auto text-xs text-red-400 hover:text-white border border-red-500/30 px-3 py-1.5 rounded hover:bg-red-500 transition-all"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && fixtures.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="text-4xl mb-3">⚽</span>
          <p className="text-slate-400 font-medium">No fixtures available.</p>
          <p className="text-slate-600 text-sm mt-1">Check back once predictions have been generated.</p>
        </div>
      )}

      {/* Fixtures List */}
      {!loading && fixtures.length > 0 && (
        <div className="space-y-4">
          {fixtures.map((match) => {
            const probHome = match.prob_home ?? 0;
            const probDraw = match.prob_draw ?? 0;
            const probAway = match.prob_away ?? 0;

            return (
              <div
                key={match.id}
                className="group bg-slate-900/50 border border-slate-800 rounded-lg p-5 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">

                  {/* Match Info & Teams */}
                  <div className="flex items-center gap-8 flex-1 justify-center md:justify-start">

                    {/* Date & Time */}
                    <div className="text-center md:text-left flex-shrink-0">
                      <p className="text-blue-500 text-xs font-bold uppercase">{formatDate(match.match_date)}</p>
                      <p className="text-white text-lg font-bold">{formatTime(match.match_date)}</p>
                    </div>

                    {/* Teams */}
                    <div className="flex items-center gap-4">
                      {/* Home */}
                      <div className="flex items-center gap-2">
                        {match.home_team_logo && (
                          <img src={match.home_team_logo} alt={match.home_team} className="w-6 h-6 object-contain" />
                        )}
                        <span className="text-white font-semibold text-lg">{match.home_team ?? "TBD"}</span>
                      </div>

                      <span className="text-slate-600 text-sm font-normal">VS</span>

                      {/* Away */}
                      <div className="flex items-center gap-2">
                        {match.away_team_logo && (
                          <img src={match.away_team_logo} alt={match.away_team} className="w-6 h-6 object-contain" />
                        )}
                        <span className="text-white font-semibold text-lg">{match.away_team ?? "TBD"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Prediction Metrics */}
                  <div className="flex flex-col items-center md:items-end gap-2 w-full md:w-auto">

                    <div className="flex items-center justify-between w-full md:w-64 mb-1">
                      <div className="flex items-center gap-1.5">
                        <Info size={13} className="text-slate-500" />
                        <span className="text-slate-400 text-xs uppercase tracking-tighter">Win Probability</span>
                      </div>
                      {match.confidence != null && (
                        <span className={`text-xs font-bold ${confidenceColor(match.confidence)}`}>
                          {Math.round(match.confidence * 100)}% conf.
                        </span>
                      )}
                    </div>

                    {/* Probability Bar */}
                    <div className="flex w-full md:w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div style={{ width: toPercent(probHome) }} className="bg-blue-600 h-full transition-all duration-500" title="Home Win" />
                      <div style={{ width: toPercent(probDraw) }} className="bg-slate-600 h-full transition-all duration-500" title="Draw" />
                      <div style={{ width: toPercent(probAway) }} className="bg-blue-400 h-full transition-all duration-500" title="Away Win" />
                    </div>

                    <div className="flex justify-between w-full md:w-64 text-[10px] font-bold uppercase mt-1">
                      <span className="text-blue-500">{toPercent(probHome)} Home</span>
                      <span className="text-slate-500">{toPercent(probDraw)} Draw</span>
                      <span className="text-blue-300">{toPercent(probAway)} Away</span>
                    </div>

                    {/* Predicted outcome */}
                    {match.outcome && (
                      <div className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">
                        Prediction: <span className="text-blue-400 font-bold">{match.outcome}</span>
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  <button className="bg-blue-600/10 text-blue-500 border border-blue-600/20 px-4 py-2 rounded text-xs font-bold uppercase hover:bg-blue-600 hover:text-white transition-all flex-shrink-0">
                    Analyze
                  </button>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
