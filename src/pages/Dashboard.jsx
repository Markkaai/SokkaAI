import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Leaderboard from "./Leaderboard.jsx";
import {
  LayoutDashboard, TrendingUpDown, History, RefreshCw,
  Bell, LogOut, Trophy, ChevronRight,
  Zap, BarChart2, Clock, Shield, Star,
  X, CheckCircle, XCircle,
} from "lucide-react";

const BASE_URL = "https://elliott888-epl-model.hf.space";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (d) => {
  if (!d) return "Unknown";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  });
};

const outcomeLabel = (o) => {
  if (!o) return "Pending";
  const u = o.toUpperCase();
  if (u === "H") return "Home Win";
  if (u === "D") return "Draw";
  if (u === "A") return "Away Win";
  return o;
};

const outcomeColor = (o) => {
  if (!o) return "text-slate-400";
  const u = o.toUpperCase();
  if (u === "H" || u.includes("HOME")) return "text-blue-400";
  if (u === "D" || u.includes("DRAW")) return "text-yellow-400";
  return "text-purple-400";
};

const pct = (v) => {
  if (v == null) return "—";
  const val = v > 1 ? v : v * 100;
  return `${val.toFixed(1)}%`;
};

const confPct = (v) => {
  if (v == null) return null;
  return v > 1 ? Math.round(v) : Math.round(v * 100);
};

// ─── Probability bar ──────────────────────────────────────────────────────────
function ProbBar({ home, draw, away }) {
  const h = ((home ?? 0) * 100).toFixed(0);
  const d = ((draw ?? 0) * 100).toFixed(0);
  const a = ((away ?? 0) * 100).toFixed(0);
  return (
    <div className="mt-3">
      <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
        <div style={{ width: `${h}%` }} className="bg-blue-500 rounded-full" />
        <div style={{ width: `${d}%` }} className="bg-yellow-500 rounded-full" />
        <div style={{ width: `${a}%` }} className="bg-purple-500 rounded-full" />
      </div>
      <div className="flex justify-between mt-1 text-[9px] font-bold uppercase tracking-widest">
        <span className="text-blue-400">H {h}%</span>
        <span className="text-yellow-400">D {d}%</span>
        <span className="text-purple-400">A {a}%</span>
      </div>
    </div>
  );
}

// ─── Stat Bar ─────────────────────────────────────────────────────────────────
function StatBar({ label, value, color }) {
  // Scale: assume max meaningful value is 3.0
  const pctWidth = value != null ? Math.min((Math.abs(value) / 3) * 100, 100).toFixed(0) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-slate-400 uppercase tracking-wider font-bold">{label}</span>
        <span className={`font-black ${color}`}>{value != null ? value.toFixed(3) : "—"}</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${
            color === "text-blue-400"    ? "bg-blue-500"
            : color === "text-emerald-400" ? "bg-emerald-500"
            : color === "text-yellow-400"  ? "bg-yellow-500"
            : "bg-purple-500"
          }`}
          style={{ width: `${pctWidth}%` }}
        />
      </div>
    </div>
  );
}

// ─── Team Stats Modal ─────────────────────────────────────────────────────────
function TeamModal({ team, data, side, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: "blur(8px)", background: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl"
        style={{ animation: "slideUp 0.25s ease-out" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        {/* Team header */}
        <div className="flex items-center gap-4 mb-6">
          {data?.logo && (
            <img src={`${BASE_URL}${data.logo}`} alt={team} className="h-14 object-contain" />
          )}
          <div>
            <p className="text-white text-lg font-black">{team}</p>
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
              side === "home" ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"
            }`}>
              {side === "home" ? "Home" : "Away"}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <StatBar label="Attacking"  value={data?.attacking}  color="text-blue-400"    />
          <StatBar label="Defence"    value={data?.defending}  color="text-emerald-400" />
          <StatBar label="Volatility" value={data?.volatility} color="text-yellow-400"  />
          <StatBar label="Efficiency" value={data?.efficiency} color="text-purple-400"  />
        </div>

        <p className="text-[10px] text-slate-600 text-center mt-5 uppercase tracking-widest">
          Tap outside to close
        </p>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

// ─── Nav config ───────────────────────────────────────────────────────────────
const navItems = [
  { name: "Dashboard",   icon: <LayoutDashboard size={18} /> },
  { name: "Predictions", icon: <TrendingUpDown  size={18} /> },
  { name: "Standings",   icon: <Trophy          size={18} /> },
  { name: "History",     icon: <History         size={18} /> },
];

// ═══════════════════════════════════════════════════════════════════════════════
export default function Dashboard() {
  const [activeNav, setActiveNav]                 = useState("Dashboard");
  const [user, setUser]                           = useState(null);
  const [accuracy, setAccuracy]                   = useState(null);
  const [predictions, setPredictions]             = useState([]);
  const [allPredictions, setAllPredictions]       = useState([]);
  const [notifications, setNotifications]         = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loadingStats, setLoadingStats]           = useState(true);
  const [loadingPreds, setLoadingPreds]           = useState(true);
  const [runningInference, setRunningInference]   = useState(false);

  const navigate    = useNavigate();
  const token       = localStorage.getItem("token");
  const authHeaders = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { navigate("/"); return; }
    fetch(`${BASE_URL}/user`, { headers: authHeaders })
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then(setUser)
      .catch(() => { localStorage.removeItem("token"); navigate("/"); });
  }, []);

  useEffect(() => {
    setLoadingStats(true);
    fetch(`${BASE_URL}/prediction-accuracy`, { headers: authHeaders })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d) setAccuracy(d); })
      .finally(() => setLoadingStats(false));
  }, []);

  useEffect(() => {
    fetch(`${BASE_URL}/prediction-history?skip=0&limit=5`, { headers: authHeaders })
      .then((r) => r.ok ? r.json() : [])
      .then((d) => setPredictions(Array.isArray(d) ? d : d.items ?? []));
  }, []);

  useEffect(() => {
    setLoadingPreds(true);
    fetch(`${BASE_URL}/predictions?skip=0&limit=20`, { headers: authHeaders })
      .then((r) => r.ok ? r.json() : [])
      .then((d) => setAllPredictions(Array.isArray(d) ? d : d.items ?? []))
      .finally(() => setLoadingPreds(false));
  }, []);

  useEffect(() => {
    fetch(`${BASE_URL}/notifications?limit=10&unread_only=false`, { headers: authHeaders })
      .then((r) => r.ok ? r.json() : [])
      .then((d) => setNotifications(Array.isArray(d) ? d : []));
  }, []);

  const handleLogout = async () => {
    try { await fetch(`${BASE_URL}/logout`, { method: "POST", headers: authHeaders }); } catch {}
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleMarkRead = async (id) => {
    try {
      await fetch(`${BASE_URL}/notifications/${id}`, {
        method: "PUT",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ is_read: true }),
      });
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));
    } catch {}
  };

  const avatarUrl   = `https://api.dicebear.com/7.x/identicon/svg?seed=${user?.email}`;
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const statCards = [
    { label: "Overall Accuracy", value: accuracy ? pct(accuracy.overall_accuracy) : "—",            sub: accuracy ? `${accuracy.correct_predictions}/${accuracy.total_predictions_analyzed} correct` : "Loading…", icon: <Star size={16} className="text-yellow-400" /> },
    { label: "30-Day Accuracy",  value: accuracy ? pct(accuracy.recent_accuracy_30_days) : "—",     sub: accuracy ? `${accuracy.recent_predictions_count} recent predictions` : "Loading…",                         icon: <Clock size={16} className="text-blue-400" /> },
    { label: "High Confidence",  value: accuracy ? pct(accuracy.high_confidence_accuracy) : "—",    sub: accuracy ? `${accuracy.high_confidence_predictions} predictions` : "Loading…",                             icon: <Shield size={16} className="text-emerald-400" /> },
    { label: "Matches Analyzed", value: accuracy ? accuracy.total_predictions_analyzed.toLocaleString() : "—", sub: accuracy ? `Updated ${new Date(accuracy.last_updated).toLocaleDateString()}` : "Loading…",     icon: <BarChart2 size={16} className="text-purple-400" /> },
  ];

  if (!user) return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center">
      <RefreshCw size={24} className="animate-spin text-blue-500" />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-950 text-white flex flex-col lg:flex-row overflow-hidden">

      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-slate-900/60 border-r border-slate-800 p-5 shrink-0">
        <div className="mb-8">
          <h1 className="text-xl font-black tracking-tight">
            <span className="text-blue-400">EPL</span>
            <span className="text-sm text-purple-400 font-semibold"> PREDICTOR</span>
          </h1>
          <p className="text-[9px] text-slate-600 uppercase tracking-widest font-bold">EPL Intelligence</p>
        </div>

        <div
          onClick={() => navigate("/profile")}
          className="flex hover:cursor-pointer items-center gap-3 mb-8 p-3 bg-slate-800/60 rounded-xl border border-slate-700"
        >
          <img
            src={user.profile_photo_url || avatarUrl}
            alt="avatar"
            className="w-9 h-9 rounded-full border-2 border-blue-500/50"
          />
          <div className="truncate">
            <p className="text-sm font-bold truncate">{user.full_name || user.email}</p>
            <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
              user?.is_admin ? "text-purple-300 bg-purple-500/20" : "text-blue-300 bg-blue-500/20"
            }`}>
              {user?.is_admin ? "Admin" : "Member"}
            </span>
          </div>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveNav(item.name)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeNav === item.name
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "text-slate-500 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {item.icon} {item.name}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 py-2.5 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest"
        >
          <LogOut size={14} /> Sign Out
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
          <div>
            <h2 className="text-lg font-bold">
              {activeNav === "Dashboard" && <>Welcome, <span className="text-blue-400">{user?.full_name?.split(" ")[0] || "User"}</span> 👋</>}
              {activeNav !== "Dashboard" && activeNav}
            </h2>
            <p className="text-slate-600 text-xs mt-0.5">Real-time EPL analytics & predictions</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Live
            </div>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg bg-slate-800 border border-slate-700 hover:border-blue-500/50 transition-all"
              >
                <Bell size={16} className="text-slate-400" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] font-black flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-800 flex justify-between items-center">
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Notifications</p>
                    <span className="text-[10px] text-slate-500">{unreadCount} unread</span>
                  </div>
                  {notifications.length === 0
                    ? <p className="text-center text-slate-500 text-sm py-6">No notifications</p>
                    : notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => handleMarkRead(n.id)}
                          className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-800/60 cursor-pointer border-b border-slate-800/50 last:border-0 transition-all ${!n.is_read ? "bg-blue-500/5" : ""}`}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-200 font-semibold">{n.title}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5 truncate">{n.message}</p>
                            <p className="text-[10px] text-slate-600 mt-0.5">{formatDate(n.created_at)}</p>
                          </div>
                          {!n.is_read && <span className="w-2 h-2 rounded-full bg-blue-400 mt-1 shrink-0" />}
                        </div>
                      ))
                  }
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6">

          {/* DASHBOARD TAB */}
          {activeNav === "Dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((s) => (
                  <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{s.label}</p>
                      {s.icon}
                    </div>
                    {loadingStats
                      ? <div className="h-7 w-16 bg-slate-800 rounded animate-pulse" />
                      : <p className="text-2xl font-black tracking-tight">{s.value}</p>
                    }
                    <p className="text-[10px] mt-1.5 text-slate-500 font-medium">{s.sub}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { label: "Predictions", icon: <TrendingUpDown size={15} />, nav: "Predictions", style: "bg-blue-600 hover:bg-blue-700 text-white" },
                  { label: "Standings",   icon: <Trophy size={15} />,         nav: "Standings",   style: "bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200" },
                  { label: "History",     icon: <History size={15} />,        nav: "History",     style: "bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200" },
                ].map((a) => (
                  <button
                    key={a.label}
                    onClick={() => setActiveNav(a.nav)}
                    className={`${a.style} py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95`}
                  >
                    {a.icon} {a.label}
                  </button>
                ))}
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-blue-400">Recent Predictions</h3>
                  <button onClick={() => setActiveNav("Predictions")} className="text-xs text-slate-500 hover:text-blue-400 flex items-center gap-1 transition-colors">
                    View all <ChevronRight size={13} />
                  </button>
                </div>
                {predictions.length === 0
                  ? <div className="flex flex-col items-center justify-center py-10 text-center gap-2"><p className="text-slate-500 text-sm">No prediction history yet.</p></div>
                  : <div className="grid lg:grid-cols-2 gap-3">
                      {predictions.map((p) => (
                        <div key={p.id} className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800 rounded-lg hover:border-slate-700 transition-all cursor-pointer">
                          <div className="flex justify-between w-[40%]">
                            <div className="flex flex-col items-center justify-center">
                              <img src={`${BASE_URL}${p.home_team_logo}`} className="h-6" alt="" />
                              <p className="text-xs text-white">{p.home_team ?? "TBD"}</p>
                            </div>
                            <span className="text-slate-600">vs</span>
                            <div className="flex flex-col items-center justify-center">
                              <img src={`${BASE_URL}${p.away_team_logo}`} className="h-6" alt="" />
                              <p className="text-xs text-white">{p.away_team ?? "TBD"}</p>
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-600">{formatDate(p.match_date)}</p>
                          <div className="text-right">
                            <p className={`text-xs font-bold ${outcomeColor(p.outcome)}`}>{outcomeLabel(p.outcome)}</p>
                            {p.confidence != null && <p className="text-[10px] text-slate-600 mt-0.5">{confPct(p.confidence)}% confidence</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                }
              </div>
            </div>
          )}

          {/* PREDICTIONS TAB */}
          {activeNav === "Predictions" && (
            <div className="space-y-4">
              <p className="text-slate-500 text-sm">{allPredictions.length} upcoming predictions</p>
              {loadingPreds ? (
                <div className="flex justify-center py-16"><RefreshCw size={24} className="animate-spin text-blue-500" /></div>
              ) : allPredictions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-2">
                  <span className="text-4xl">⚽</span>
                  <p className="text-slate-400">No predictions available yet.</p>
                </div>
              ) : (
                <div className="grid lg:grid-cols-2 gap-4">
                  {allPredictions.map((p) => (
                    <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0 flex-col">
                          <img src={`${BASE_URL}${p.home_team_logo}`} className="h-20" alt="" />
                          <span className="text-sm font-bold truncate">{p.home_team ?? "TBD"}</span>
                        </div>
                        <span className="text-[10px] text-slate-600 font-bold uppercase px-2">vs</span>
                        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end flex-col">
                          <img src={`${BASE_URL}${p.away_team_logo}`} className="h-20" alt="" />
                          <span className="text-sm font-bold truncate text-right">{p.away_team ?? "TBD"}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-slate-600">{formatDate(p.match_date)}</span>
                        <div className="flex items-center gap-2">
                          {p.confidence != null && <span className="text-[9px] font-bold text-slate-500 uppercase">{confPct(p.confidence)}% confidence</span>}
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                            outcomeColor(p.outcome) === "text-blue-400"    ? "border-blue-500/40 bg-blue-500/10 text-blue-400"
                            : outcomeColor(p.outcome) === "text-yellow-400" ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-400"
                            : "border-purple-500/40 bg-purple-500/10 text-purple-400"
                          }`}>{outcomeLabel(p.outcome)}</span>
                        </div>
                      </div>

                      <ProbBar home={p.prob_home} draw={p.prob_draw} away={p.prob_away} />

                      {(p.h_attacking != null || p.a_attacking != null) && (
                        <div className="mt-4 space-y-4">
                          {[
                            { label: "Attack",     h: p.h_attacking,  a: p.a_attacking  },
                            { label: "Defence",    h: p.h_defending,  a: p.a_defending  },
                            { label: "Efficiency", h: p.h_efficiency, a: p.a_efficiency },
                          ].map(({ label, h, a }) => h != null && a != null && (
                            <div key={label}>
                              <div className="flex justify-between text-[11px] mb-1">
                                <span className="font-bold text-blue-400">{h.toFixed(2)}</span>
                                <span className="text-slate-400 uppercase tracking-wide">{label}</span>
                                <span className="font-bold text-purple-400">{a.toFixed(2)}</span>
                              </div>
                              <div className="flex h-2 rounded-full overflow-hidden bg-slate-700">
                                <div className="bg-blue-500" style={{ width: `${(h / (h + a)) * 100}%` }} />
                                <div className="bg-purple-500" style={{ width: `${(a / (h + a)) * 100}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STANDINGS TAB */}
          {activeNav === "Standings" && <Leaderboard />}

          {/* HISTORY TAB */}
          {activeNav === "History" && (
            <HistoryTab authHeaders={authHeaders} formatDate={formatDate} />
          )}
        </div>
      </main>
    </div>
  );
}

// ─── History Tab ──────────────────────────────────────────────────────────────
function HistoryTab({ authHeaders, formatDate }) {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip]       = useState(0);
  const [modal, setModal]     = useState(null);
  const LIMIT = 20;

  const resultLabel = (ftr) => {
    if (ftr === "H") return "Home Win";
    if (ftr === "A") return "Away Win";
    if (ftr === "D") return "Draw";
    return "Unknown";
  };

  const resultColor = (ftr) => {
    if (ftr === "H") return "text-green-400";
    if (ftr === "A") return "text-red-400";
    if (ftr === "D") return "text-yellow-400";
    return "text-slate-400";
  };

  const predictionStatus = (p) => {
    if (!p.outcome || !p.ftr) return null;
    const predicted = p.outcome.toUpperCase();
    const actual    = p.ftr.toUpperCase();
    const norm = predicted === "HOME WIN" || predicted === "HOME" ? "H"
               : predicted === "AWAY WIN" || predicted === "AWAY" ? "A"
               : predicted === "DRAW"                             ? "D"
               : predicted;
    return norm === actual;
  };

  // ── Fixed: read h_attacking, h_defending, h_volatility, h_efficiency directly ──
  const openModal = (team, logo, side, p) => {
    const isHome = side === "home";
    setModal({
      team,
      side,
      data: {
        logo,
        attacking:  isHome ? p.h_attacking  : p.a_attacking,
        defending:  isHome ? p.h_defending  : p.a_defending,
        volatility: isHome ? p.h_volatility : p.a_volatility,
        efficiency: isHome ? p.h_efficiency : p.a_efficiency,
      },
    });
  };

  const load = async (newSkip = 0) => {
    setLoading(true);
    try {
      const res  = await fetch(`${BASE_URL}/historical-matches?skip=${newSkip}&limit=${LIMIT}`, { headers: authHeaders });
      const data = await res.json();
      const arr  = Array.isArray(data) ? data : data.items ?? [];
      if (newSkip === 0) setItems(arr);
      else setItems((prev) => [...prev, ...arr]);
      setHasMore(arr.length === LIMIT);
      setSkip(newSkip + LIMIT);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(0); }, []);

  return (
    <div className="space-y-3">

      {/* Modal */}
      {modal && (
        <TeamModal
          team={modal.team}
          data={modal.data}
          side={modal.side}
          onClose={() => setModal(null)}
        />
      )}

      <p className="text-slate-500 text-sm">{items.length} matches loaded</p>

      {items.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <span className="text-4xl">📋</span>
          <p className="text-slate-400">No match history yet.</p>
        </div>
      )}

      {items.map((p) => {
        const status = predictionStatus(p);
        return (
          <div key={p.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-all space-y-4">

            {/* Match row */}
            <div className="flex items-center justify-between">

              {/* Home — clickable */}
              <button
                onClick={() => openModal(p.home_team, p.home_team_logo, "home", p)}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
              >
                <img src={`${BASE_URL}${p.home_team_logo}`} alt={p.home_team} className="h-10 object-contain" />
                <div className="text-left">
                  <p className="text-sm font-bold group-hover:text-blue-400 transition-colors">{p.home_team}</p>
                  <p className="text-[10px] text-slate-500">{p.date ? new Date(p.date).toLocaleDateString() : ""}</p>
                </div>
              </button>

              {/* Score */}
              <div className="text-center">
                <p className="text-lg font-black">{p.fthg} – {p.ftag}</p>
                <p className={`text-[10px] font-bold ${resultColor(p.ftr)}`}>{resultLabel(p.ftr)}</p>
              </div>

              {/* Away — clickable */}
              <button
                onClick={() => openModal(p.away_team, p.away_team_logo, "away", p)}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
              >
                <div className="text-right">
                  <p className="text-sm font-bold group-hover:text-purple-400 transition-colors">{p.away_team}</p>
                </div>
                <img src={`${BASE_URL}${p.away_team_logo}`} alt={p.away_team} className="h-10 object-contain" />
              </button>
            </div>

            {/* Model Prediction badge */}
            {(p.outcome || p.ftr) && (
              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="flex items-center gap-2">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Model Prediction</p>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                    outcomeLabel(p.outcome) === "Home Win" ? "border-blue-500/40 bg-blue-500/10 text-blue-400"
                    : outcomeLabel(p.outcome) === "Draw"   ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-400"
                    : "border-purple-500/40 bg-purple-500/10 text-purple-400"
                  }`}>
                    {outcomeLabel(p.outcome) || "—"}
                  </span>
                </div>

                {status !== null && (
                  <div className={`flex items-center gap-1.5 text-xs font-black ${status ? "text-green-400" : "text-red-400"}`}>
                    {status ? <><CheckCircle size={14} /> Correct</> : <><XCircle size={14} /> Incorrect</>}
                  </div>
                )}

                {p.confidence != null && (
                  <span className="text-[10px] text-slate-500 font-medium">{confPct(p.confidence)}% conf.</span>
                )}
              </div>
            )}

            {/* Match stats */}
            <div className="space-y-3">
              {[
                { label: "Shots",     h: p.hs,  a: p.as_ },
                { label: "On Target", h: p.hst, a: p.ast },
              ].map(({ label, h, a }) => {
                if (h == null || a == null || h + a === 0) return null;
                return (
                  <div key={label}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-blue-400 font-bold">{h}</span>
                      <span className="text-slate-500 uppercase">{label}</span>
                      <span className="text-purple-400 font-bold">{a}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1/2 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 ml-auto" style={{ width: `${(h / (h + a)) * 100}%` }} />
                      </div>
                      <div className="w-1/2 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500" style={{ width: `${(a / (h + a)) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {loading && <div className="flex justify-center py-6"><RefreshCw size={20} className="animate-spin text-blue-500" /></div>}

      {!loading && hasMore && (
        <button
          onClick={() => load(skip)}
          className="w-full py-3 border border-slate-800 rounded-xl text-sm text-slate-400 hover:border-blue-500/50 hover:text-blue-400 transition-all font-semibold"
        >
          Load More
        </button>
      )}
    </div>
  );
}

Dashboard.hideFooter = true;
