import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Leaderboard from "./Leaderboard.jsx";
import {
  LayoutDashboard, TrendingUpDown, History, RefreshCw,
  Bell, LogOut, Trophy, ChevronRight,
  Zap, BarChart2, Clock, Shield, Star
} from "lucide-react";

const BASE_URL = "https://elliott888-epl-model.hf.space";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (d) => {
  if (!d) return "Unknown";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
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

  // ── Auth guard ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!token) { navigate("/"); return; }
    fetch(`${BASE_URL}/user`, { headers: authHeaders })
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => {
      console.log("Fetched user:", data);
      setUser(data);
    })
      .catch(() => { localStorage.removeItem("token"); navigate("/"); });
  }, []);

  // ── Accuracy ──────────────────────────────────────────────────────────────
  useEffect(() => {
    setLoadingStats(true);
    fetch(`${BASE_URL}/prediction-accuracy`, { headers: authHeaders })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d) setAccuracy(d); })
      .finally(() => setLoadingStats(false));
  }, []);

  // ── Recent history ────────────────────────────────────────────────────────
  useEffect(() => {
  fetch(`${BASE_URL}/prediction-history?skip=0&limit=5`, {
    headers: authHeaders,
  })
    .then((r) => r.ok ? r.json() : [])
    .then((d) => {
      console.log("Prediction API response:", d);

      setPredictions(Array.isArray(d) ? d : d.items ?? []);
    });
}, []);

  // ── All predictions (Predictions tab) ────────────────────────────────────
  useEffect(() => {
    setLoadingPreds(true);
    fetch(`${BASE_URL}/predictions?skip=0&limit=20`, { headers: authHeaders })
      .then((r) => r.ok ? r.json() : [])
      .then((d) => setAllPredictions(Array.isArray(d) ? d : d.items ?? []))
      .finally(() => setLoadingPreds(false));
  }, []);

  // ── Notifications ─────────────────────────────────────────────────────────
  useEffect(() => {
    fetch(`${BASE_URL}/notifications?limit=10&unread_only=false`, { headers: authHeaders })
      .then((r) => r.ok ? r.json() : [])
      .then((d) => setNotifications(Array.isArray(d) ? d : []));
  }, []);

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    try { await fetch(`${BASE_URL}/logout`, { method: "POST", headers: authHeaders }); } catch {}
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleRunInference = async () => {
    setRunningInference(true);
    try {
      const res = await fetch(`${BASE_URL}/run-inference`, { method: "POST", headers: authHeaders });
      if (res.ok) alert("✅ Inference triggered! New predictions will appear shortly.");
      else        alert("⚠️ Failed to trigger inference.");
    } catch (e) { alert("Error: " + e.message); }
    finally { setRunningInference(false); }
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

  // ── Derived ───────────────────────────────────────────────────────────────
  const avatarUrl   = `https://api.dicebear.com/7.x/identicon/svg?seed=${user?.email}`;
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const statCards = [
    {
      label: "Overall Accuracy",
      value: accuracy ? pct(accuracy.overall_accuracy) : "—",
      sub:   accuracy ? `${accuracy.correct_predictions}/${accuracy.total_predictions_analyzed} correct` : "Loading…",
      icon:  <Star size={16} className="text-yellow-400" />,
    },
    {
      label: "30-Day Accuracy",
      value: accuracy ? pct(accuracy.recent_accuracy_30_days) : "—",
      sub:   accuracy ? `${accuracy.recent_predictions_count} recent predictions` : "Loading…",
      icon:  <Clock size={16} className="text-blue-400" />,
    },
    {
      label: "High Confidence",
      value: accuracy ? pct(accuracy.high_confidence_accuracy) : "—",
      sub:   accuracy ? `${accuracy.high_confidence_predictions} predictions` : "Loading…",
      icon:  <Shield size={16} className="text-emerald-400" />,
    },
    {
      label: "Matches Analyzed",
      value: accuracy ? accuracy.total_predictions_analyzed.toLocaleString() : "—",
      sub:   accuracy ? `Updated ${new Date(accuracy.last_updated).toLocaleDateString()}` : "Loading…",
      icon:  <BarChart2 size={16} className="text-purple-400" />,
    },
  ];
  if (!user) {
  return <div className="text-white">Loading...</div>;
}

  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="fixed inset-0 bg-slate-950 text-white flex flex-col lg:flex-row overflow-hidden">

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-60 bg-slate-900/60 border-r border-slate-800 p-5 shrink-0">

        {/* Brand */}
        <div className="mb-8">
          <h1 className="text-xl font-black tracking-tight">
            <span className="text-blue-400">SOKKA</span>
            <span className="text-sm text-purple-400 font-semibold"> AI</span>
          </h1>
          <p className="text-[9px] text-slate-600 uppercase tracking-widest font-bold">EPL Intelligence</p>
        </div>

        {/* User card */}
        <div onClick={() => navigate("/profile")} className="flex hover:cursor-pointer items-center gap-3 mb-8 p-3 bg-slate-800/60 rounded-xl border border-slate-700">
          <img src={user.profile_photo_url || "https://via.placeholder.com/150"} alt="avatar" className="w-9 h-9 rounded-full border-2 border-blue-500/50" />
          <div className="truncate">
            <p className="text-sm font-bold truncate">{user ? user.full_name || user.email : "…"}</p>
            <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${user?.is_admin ? "text-purple-300 bg-purple-500/20" : "text-blue-300 bg-blue-500/20"}`}>
              {user?.is_admin ? "Admin" : "Member"}
            </span>
          </div>
        </div>

        {/* Nav */}
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

      {/* ── Main ────────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
          <div>
            <h2 className="text-lg font-bold">
              {activeNav === "Dashboard" && <>Welcome, <span className="text-blue-400">{user?.full_name?.split(" ")[0] || "User"}</span> 👋</>}
              {activeNav !== "Dashboard" && activeNav}
            </h2>
            <p className="text-slate-600 text-xs mt-0.5">Real-time EPL analytics & AI predictions</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Status */}
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Live
            </div>

            {/* Bell */}
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

        {/* ── Content area (scrollable) ────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-6 py-6">

          {/* ══ DASHBOARD TAB ══════════════════════════════════════════════════ */}
          {activeNav === "Dashboard" && (
            <div className="space-y-6">

              {/* Stat cards */}
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

              {/* Quick actions */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: "Predictions",   icon: <TrendingUpDown size={15} />, nav: "Predictions", style: "bg-blue-600 hover:bg-blue-700 text-white" },
                  { label: "Run Inference", icon: <Zap size={15} />,            action: handleRunInference, style: "bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200" },
                  { label: "Standings",     icon: <Trophy size={15} />,         nav: "Standings",   style: "bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200" },
                  { label: "History",       icon: <History size={15} />,        nav: "History",     style: "bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200" },
                ].map((a) => (
                  <button
                    key={a.label}
                    onClick={a.nav ? () => setActiveNav(a.nav) : a.action}
                    disabled={a.label === "Run Inference" && runningInference}
                    className={`${a.style} py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50`}
                  >
                    {a.label === "Run Inference" && runningInference ? <RefreshCw size={14} className="animate-spin" /> : a.icon}
                    {a.label === "Run Inference" && runningInference ? "Running…" : a.label}
                  </button>
                ))}
              </div>

              {/* Recent predictions*/}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-blue-400">Recent Predictions</h3>
                  <button
                    onClick={() => setActiveNav("Predictions")}
                    className="text-xs text-slate-500 hover:text-blue-400 flex items-center gap-1 transition-colors"
                  >
                    View all <ChevronRight size={13} />
                  </button>
                </div>
                {predictions.length === 0
                  ? <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
                      <p className="text-slate-500 text-sm">No prediction history yet.</p>
                    </div>
                  : <div className="grid lg:grid-cols-2 gap-3">
                      {predictions.map((p) => (
                        <div key={p.id} className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800 rounded-lg hover:border-slate-700 transition-all cursor-pointer">
                          <div className="flex justify-between w-[30%]">
                            <div className="flex flex-col items-center justify-center">
                              <img src={`${BASE_URL}${p.home_team_logo}`} className="h-6" />
                              <p className="text-xs text-white">{p.home_team ?? "TBD"}</p>
                            </div>
                            <span className="text-slate-600">vs</span>
                            <div className="flex flex-col items-center justify-center">
                              <img src={`${BASE_URL}${p.away_team_logo}`} className="h-6" />
                              <p className="text-xs text-white">{p.away_team ?? "TBD"}</p>
                            </div>
                            </div>
                            <p className="text-[10px] text-slate-600 mt-0.5">{formatDate(p.match_date)}</p>
                          
                          <div className="text-right">
                            <p className={`text-xs font-bold ${outcomeColor(p.outcome)}`}>{outcomeLabel(p.outcome)}</p>
                            {p.confidence != null && (
                              <p className="text-[10px] text-slate-600 mt-0.5">{confPct(p.confidence)}% confidence</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                }
              </div>
            </div>
          )}

          {/* ══ PREDICTIONS TAB ════════════════════════════════════════════════ */}
          {activeNav === "Predictions" && (
            <div className="space-y-4">
              <p className="text-slate-500 text-sm">{allPredictions.length} upcoming predictions</p>

              {loadingPreds ? (
                <div className="flex justify-center py-16"><RefreshCw size={24} className="animate-spin text-blue-500" /></div>
              ) : allPredictions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-2">
                  <span className="text-4xl">⚽</span>
                  <p className="text-slate-400">No predictions available yet.</p>
                  <button onClick={handleRunInference} disabled={runningInference}
                    className="mt-2 px-4 py-2 bg-blue-600 rounded-lg text-xs font-bold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-2">
                    <Zap size={13} /> {runningInference ? "Running…" : "Run Inference"}
                  </button>
                </div>
              ) : (
                <div className="grid lg:grid-cols-2 gap-4">
                  {allPredictions.map((p) => (
                    <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all">
                      {/* Match header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0 flex-col">
                          <img src={`${BASE_URL}${p.home_team_logo}`} className="h-20" />
                          <span className="text-sm font-bold truncate">{p.home_team ?? "TBD"}</span>
                        </div>
                        <span className="text-[10px] text-slate-600 font-bold uppercase px-2">vs</span>
                        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end flex-col">
                          <img src={`${BASE_URL}${p.away_team_logo}`} className="h-20" />
                          <span className="text-sm font-bold truncate text-right">{p.away_team ?? "TBD"}</span>
                          
                        </div>
                      </div>

                      {/* Date + outcome badge */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-slate-600">{formatDate(p.match_date)}</span>
                        <div className="flex items-center gap-2">
                          {p.confidence != null && (
                            <span className="text-[9px] font-bold text-slate-500 uppercase">{confPct(p.confidence)}% confidence</span>
                          )}
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                            outcomeColor(p.outcome) === "text-blue-400"   ? "border-blue-500/40 bg-blue-500/10 text-blue-400"
                            : outcomeColor(p.outcome) === "text-yellow-400" ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-400"
                            : "border-purple-500/40 bg-purple-500/10 text-purple-400"
                          }`}>{outcomeLabel(p.outcome)}</span>
                        </div>
                      </div>

                      {/* Probability bar */}
                      <ProbBar home={p.prob_home} draw={p.prob_draw} away={p.prob_away} />

                      {/* Team metrics */}
                      {(p.h_attacking != null || p.a_attacking != null) && (
                        <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] text-slate-600">
                          <div className="bg-slate-800/40 rounded-lg p-2 space-y-0.5">
                            <p className="text-[9px] font-bold text-blue-400 uppercase mb-1">Home</p>
                            {p.h_attacking  != null && <p>Attack: <span className="text-slate-300 font-bold">{p.h_attacking.toFixed(2)}</span></p>}
                            {p.h_defending  != null && <p>Defence: <span className="text-slate-300 font-bold">{p.h_defending.toFixed(2)}</span></p>}
                            {p.h_efficiency != null && <p>Efficiency: <span className="text-slate-300 font-bold">{p.h_efficiency.toFixed(2)}</span></p>}
                          </div>
                          <div className="bg-slate-800/40 rounded-lg p-2 space-y-0.5">
                            <p className="text-[9px] font-bold text-purple-400 uppercase mb-1">Away</p>
                            {p.a_attacking  != null && <p>Attack: <span className="text-slate-300 font-bold">{p.a_attacking.toFixed(2)}</span></p>}
                            {p.a_defending  != null && <p>Defence: <span className="text-slate-300 font-bold">{p.a_defending.toFixed(2)}</span></p>}
                            {p.a_efficiency != null && <p>Efficiency: <span className="text-slate-300 font-bold">{p.a_efficiency.toFixed(2)}</span></p>}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══ STANDINGS TAB ══════════════════════════════════════════════════ */}
          {activeNav === "Standings" && (
            <Leaderboard />
          )}

          {/* ══ HISTORY TAB ════════════════════════════════════════════════════ */}
          {activeNav === "History" && (
            <HistoryTab authHeaders={authHeaders} formatDate={formatDate} outcomeLabel={outcomeLabel} outcomeColor={outcomeColor} />
          )}

        </div>
      </main>
    </div>
  );
}

// ─── History Tab ──────────────────────────────────────────────────────────────
function HistoryTab({ authHeaders, formatDate, outcomeLabel, outcomeColor }) {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [skip, setSkip]       = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 20;

  const load = async (newSkip = 0) => {
    setLoading(true);
    try {
      const res  = await fetch(`${BASE_URL}/prediction-history?skip=${newSkip}&limit=${LIMIT}`, { headers: authHeaders });
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
      <p className="text-slate-500 text-sm">{items.length} predictions loaded</p>

      {items.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <span className="text-4xl">📋</span>
          <p className="text-slate-400">No prediction history yet.</p>
        </div>
      )}

      {items.map((p) => (
        <div key={p.id} className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-lg shrink-0">⚽</div>
            <div>
              <p className="text-sm font-bold">{p.home_team ?? "TBD"} <span className="text-slate-600">vs</span> {p.away_team ?? "TBD"}</p>
              <p className="text-[10px] text-slate-600 mt-0.5">{formatDate(p.match_date)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-sm font-bold ${outcomeColor(p.outcome)}`}>{outcomeLabel(p.outcome)}</p>
            {p.confidence != null && (
              <div className="flex items-center justify-end gap-1 mt-0.5">
                <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${p.confidence > 1 ? Math.round(p.confidence) : Math.round(p.confidence * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-600">
                  {p.confidence > 1 ? Math.round(p.confidence) : Math.round(p.confidence * 100)}%
                </span>
              </div>
            )}
          </div>
        </div>
      ))}

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
