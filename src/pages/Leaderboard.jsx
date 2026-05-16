import { useState, useEffect } from "react";
import { RefreshCw, AlertCircle, Trophy, Zap } from "lucide-react";

const BASE_URL = "https://elliott888-epl-model.hf.space";

export default function Leaderboard({ authHeaders }) {
  const [standings, setStandings] = useState([]);
  const [scorers, setScorers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [standingsRes, scorersRes] = await Promise.all([
          fetch(`${BASE_URL}/standings?skip=0&limit=20`, { headers }),
          fetch(`${BASE_URL}/top-scorers?skip=0&limit=20`, { headers }),
        ]);

        if (!standingsRes.ok || !scorersRes.ok) throw new Error("Failed to fetch data");

        const standingsData = await standingsRes.json();
        const scorersData = await scorersRes.json();

        setStandings(standingsData.data || []);
        setScorers(scorersData.data || []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load standings and top scorers");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <RefreshCw size={24} className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 p-6 rounded-lg bg-red-500/10 border border-red-500/30">
        <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  const getZoneClass = (position) => {
    if (position <= 4) return "bg-blue-500/10 border-l-4 border-blue-500";
    if (position <= 6) return "bg-orange-500/10 border-l-4 border-orange-500";
    if (position >= standings.length - 2) return "bg-red-500/10 border-l-4 border-red-500";
    return "border-l-4 border-slate-700";
  };

  return (
    <div className="space-y-6">
      {/* Headers */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div>
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Trophy size={20} className="text-blue-400" />
            EPL Standings
          </h3>
          <p className="text-slate-500 text-xs mt-1">Season 2025/26 Table</p>
        </div>
        <div>
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Zap size={20} className="text-yellow-400" />
            Top Scorers
          </h3>
          <p className="text-slate-500 text-xs mt-1">Golden Boot Race</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* ═══ STANDINGS TABLE ═══════════════════════════════════════════════════ */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-900/60">
                  <th className="px-3 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">POS</th>
                  <th className="px-3 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">TEAM</th>
                  <th className="px-3 py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">P</th>
                  <th className="px-3 py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">W</th>
                  <th className="px-3 py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">D</th>
                  <th className="px-3 py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">L</th>
                  <th className="px-3 py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">GD</th>
                  <th className="px-3 py-3 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">PTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {standings.map((team) => (
                  <tr key={team.position} className={`${getZoneClass(team.position)} transition-all hover:bg-slate-700/30 cursor-pointer`}>
                    <td className="px-3 py-3 font-bold text-white">{team.position}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        {team.Logo && <img src={team.Logo} alt={team.team} className="w-5 h-5 rounded-full" />}
                        <span className="text-white truncate">{team.team}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center text-slate-400">{team.played}</td>
                    <td className="px-3 py-3 text-center text-green-400 font-semibold">{team.won}</td>
                    <td className="px-3 py-3 text-center text-yellow-400 font-semibold">{team.draw}</td>
                    <td className="px-3 py-3 text-center text-red-400 font-semibold">{team.lost}</td>
                    <td className="px-3 py-3 text-center text-slate-300">{team.gd > 0 ? '+' : ''}{team.gd}</td>
                    <td className="px-3 py-3 text-right font-black text-blue-400">{team.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Zone Legend */}
          <div className="bg-slate-900/40 border-t border-slate-700 p-3 flex gap-3 flex-wrap justify-center text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-blue-500 rounded-sm" />
              <span className="text-slate-400">Champions League</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-orange-500 rounded-sm" />
              <span className="text-slate-400">Europa League</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-red-500 rounded-sm" />
              <span className="text-slate-400">Relegation</span>
            </div>
          </div>
        </div>

        {/* ═══ TOP SCORERS TABLE ════════════════════════════════════════════════ */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-900/60">
                  <th className="px-3 py-2 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">RANK</th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">PLAYER</th>
                  <th className="px-3 py-2 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">TEAM</th>
                  <th className="px-3 py-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">GOALS</th>
                  <th className="px-3 py-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">AST</th>
                  <th className="px-3 py-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">PLAYED</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {scorers.map((scorer, idx) => {
                  const position = idx + 1;
                  const medal = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : '';
                  return (
                    <tr key={position} className="hover:bg-slate-700/30 transition-all cursor-pointer">
                      <td className="px-3 py-2 font-bold text-white">{medal || position}</td>
                      <td className="px-3 py-2 text-white">{scorer.name}</td>
                      <td className="px-3 py-2 text-slate-400">{scorer.team}</td>
                      <td className="px-3 py-2 text-center text-yellow-400 font-semibold">{scorer.goals}</td>
                      <td className="px-3 py-2 text-center text-green-400 font-semibold">{scorer.assists || 0}</td>
                      <td className="px-3 py-2 text-center text-slate-400">{scorer.played}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {scorers.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <p>No scorers data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
