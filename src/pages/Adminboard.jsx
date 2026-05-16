import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, ShieldCheck, TrendingUp, Bell, LogOut, ChevronRight, MoreHorizontal, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react";

const BASE_URL = "https://elliott888-epl-model.hf.space";

const navItems = [
  { label: "Dashboard",   icon: LayoutDashboard },
  { label: "Users",       icon: Users           },
  { label: "Predictions", icon: TrendingUp      },
  { label: "Moderation",  icon: ShieldCheck     },
];

const colorMap = {
  blue:   { border: "border-blue-500/30",   text: "text-blue-400"   },
  purple: { border: "border-purple-500/30", text: "text-purple-400" },
  cyan:   { border: "border-cyan-500/30",   text: "text-cyan-400"   },
  red:    { border: "border-red-500/30",    text: "text-red-400"    },
};

export default function AdminDashboard() {
  const [activeNav, setActiveNav]               = useState("Dashboard");
  const [users, setUsers]                       = useState([]);
  const [predictions, setPredictions]           = useState([]);
  const [accuracy, setAccuracy]                 = useState(null);
  const [notifications, setNotifications]       = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [adminUser, setAdminUser]               = useState(null);
  const [loadingUsers, setLoadingUsers]         = useState(true);
  const [loadingPredictions, setLoadingPredictions] = useState(true);
  const navigate = useNavigate();

  const token       = localStorage.getItem("token");
  const authHeaders = { Authorization: `Bearer ${token}` };

  // Fetch admin profile
  useEffect(() => {
    const fetch_ = async () => {
      try {
        if (!token) { navigate("/"); return; }
        const res  = await fetch(`${BASE_URL}/user`, { headers: authHeaders });
        const data = await res.json();
        if (res.ok && data.is_admin) setAdminUser(data);
        else { navigate("/dashboard"); } // not admin → redirect
      } catch (err) { console.error(err); }
    };
    fetch_();
  }, [navigate]);

  // Fetch all users
  useEffect(() => {
    const fetch_ = async () => {
      try {
        setLoadingUsers(true);
        const res  = await fetch(`${BASE_URL}/users?skip=0&limit=5`, { headers: authHeaders });
        if (res.ok) {
          const data = await res.json();
          setUsers(Array.isArray(data) ? data : data.items ?? []);
        }
      } catch (err) { console.error(err); }
      finally { setLoadingUsers(false); }
    };
    fetch_();
  }, []);

  // Fetch recent predictions
  useEffect(() => {
    const fetch_ = async () => {
      try {
        setLoadingPredictions(true);
        const res  = await fetch(`${BASE_URL}/predictions?skip=0&limit=4`, { headers: authHeaders });
        if (res.ok) {
          const data = await res.json();
          setPredictions(Array.isArray(data) ? data : data.items ?? []);
        }
      } catch (err) { console.error(err); }
      finally { setLoadingPredictions(false); }
    };
    fetch_();
  }, []);

  // Fetch accuracy stats
  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch(`${BASE_URL}/prediction-accuracy`, { headers: authHeaders });
        if (res.ok) setAccuracy(await res.json());
      } catch (err) { console.error(err); }
    };
    fetch_();
  }, []);

  // Fetch notifications
  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch(`${BASE_URL}/notifications?limit=5&unread_only=false`, { headers: authHeaders });
        if (res.ok) setNotifications(await res.json());
      } catch (err) { console.error(err); }
    };
    fetch_();
  }, []);

  const handleLogout = async () => {
    try { await fetch(`${BASE_URL}/logout`, { method: "POST", headers: authHeaders }); }
    catch (err) { console.error(err); }
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleMarkRead = async (id) => {
    try {
      await fetch(`${BASE_URL}/notifications/${id}`, {
        method: "PUT",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ is_read: true }),
      });
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) { console.error(err); }
  };

  const handleRefreshAccuracy = async () => {
    try {
      const res = await fetch(`${BASE_URL}/prediction-accuracy/refresh`, { method: "POST", headers: authHeaders });
      if (res.ok) setAccuracy(await res.json());
    } catch (err) { console.error(err); }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const avatarUrl   = `https://api.dicebear.com/7.x/identicon/svg?seed=${adminUser?.email}`;

  // Build stats from live data
  const stats = [
    { label: "Total Users",        value: "—",     change: "Live from API",  color: "blue"   },
    { label: "Active Predictions", value: accuracy ? accuracy.total_predictions_analyzed.toLocaleString() : "—", change: accuracy ? `Updated ${new Date(accuracy.last_updated).toLocaleDateString()}` : "Loading...", color: "purple" },
    { label: "Model Accuracy",     value: accuracy ? `${(accuracy.overall_accuracy).toFixed(1)}%` : "—",   change: accuracy ? `${accuracy.correct_predictions} correct` : "Loading...", color: "cyan" },
    { label: "High Confidence",    value: accuracy ? `${(accuracy.high_confidence_accuracy * 100).toFixed(1)}%` : "—", change: accuracy ? `${accuracy.high_confidence_predictions} predictions` : "Loading...", color: "red" },
  ];

  const formatDate = (dateStr) => {
    if (!dateStr) return "Unknown";
    return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  const confidenceColor = (val) => {
    if (!val) return "text-slate-400";
    const pct = val <= 1 ? val * 100 : val;
    if (pct >= 75) return "text-green-400";
    if (pct >= 55) return "text-yellow-400";
    return "text-red-400";
  };

  const outcomeIcon = (outcome) => {
    if (!outcome) return <Clock size={14} className="text-yellow-400" />;
    const o = outcome.toLowerCase();
    if (o === "h" || o.includes("home")) return <CheckCircle size={14} className="text-green-400" />;
    if (o === "a" || o.includes("away")) return <CheckCircle size={14} className="text-blue-400" />;
    if (o === "d" || o.includes("draw")) return <CheckCircle size={14} className="text-yellow-400" />;
    return <Clock size={14} className="text-slate-400" />;
  };

  return (
    <div className="fixed inset-0 bg-slate-950 text-white overflow-y-auto flex z-50">

      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-slate-900 border-r border-slate-800 px-4 py-6 fixed h-full">

        {/* Logo */}
        <div className="mb-8 px-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚽</span>
            <span className="font-bold text-lg">
              <span className="text-blue-400">Kick</span>
              <span className="text-purple-400">Predict</span>
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => setActiveNav(label)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${activeNav === label
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"}`}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="mt-auto space-y-2">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700">
            {adminUser ? (
              <img src={avatarUrl} alt="admin" className="w-8 h-8 rounded-full border border-blue-500" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">A</div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">{adminUser?.full_name || "Admin"}</p>
              <p className="text-[10px] text-slate-500 truncate">{adminUser?.email || "admin@kickpredict.com"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 lg:ml-60 px-6 lg:px-10 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Admin <span className="text-blue-400">Dashboard</span></h1>
            <p className="text-slate-500 text-sm mt-0.5">Platform overview and management</p>
          </div>
          <div className="flex items-center gap-3">

            {/* Refresh accuracy */}
            <button
              onClick={handleRefreshAccuracy}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-400 transition-colors px-3 py-2 rounded-lg bg-slate-800 border border-slate-700"
            >
              <RefreshCw size={13} /> Refresh Stats
            </button>

            {/* Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg bg-slate-800 border border-slate-700 hover:border-blue-500/40 transition-all"
              >
                <Bell size={18} className="text-slate-400" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] font-black flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-400">Notifications</p>
                    <span className="text-[10px] text-slate-500">{unreadCount} unread</span>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-slate-500 text-sm">No notifications</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleMarkRead(n.id)}
                        className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-800/60 cursor-pointer transition-all border-b border-slate-800/50 last:border-0 ${!n.is_read ? "bg-blue-500/5" : ""}`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-200 font-semibold">{n.title}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 truncate">{n.message}</p>
                          <p className="text-[10px] text-slate-600 mt-0.5">{formatDate(n.created_at)}</p>
                        </div>
                        {!n.is_read && <span className="w-2 h-2 rounded-full bg-blue-400 mt-1 flex-shrink-0" />}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Admin avatar */}
            {adminUser ? (
              <img src={avatarUrl} alt="admin" className="w-9 h-9 rounded-full border border-blue-500" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-sm font-bold">A</div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => {
            const c = colorMap[s.color];
            return (
              <div key={s.label} className={`bg-slate-900 border ${c.border} rounded-xl p-5 hover:scale-105 transition-all duration-300`}>
                <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-2">{s.label}</p>
                {!accuracy && s.label !== "Total Users" ? (
                  <div className="h-8 w-20 bg-slate-800 rounded animate-pulse mt-1" />
                ) : (
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                )}
                <p className={`text-xs mt-1.5 font-medium ${c.text}`}>{s.change}</p>
              </div>
            );
          })}
        </div>

        {/* Tables */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Recent Users */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold uppercase tracking-widest text-blue-400">Recent Users</h3>
              <button className="text-xs text-slate-500 hover:text-blue-400 flex items-center gap-1 transition-colors">
                View all <ChevronRight size={13} />
              </button>
            </div>

            {loadingUsers ? (
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-12 bg-slate-800 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : users.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-6">No users found.</p>
            ) : (
              <div className="space-y-2">
                {users.map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all group">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.profile_photo_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${u.email}`}
                        alt={u.full_name}
                        className="w-8 h-8 rounded-full border border-slate-700"
                      />
                      <div>
                        <p className="text-sm font-semibold leading-tight">{u.full_name || u.email}</p>
                        <p className="text-[10px] text-slate-500 truncate max-w-[140px]">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${u.is_admin ? "bg-purple-500/15 text-purple-400 border-purple-500/30" : "bg-slate-800 text-slate-400 border-slate-700"}`}>
                        {u.is_admin ? "Admin" : "Member"}
                      </span>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-white">
                        <MoreHorizontal size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Predictions */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold uppercase tracking-widest text-purple-400">Recent Predictions</h3>
              <button className="text-xs text-slate-500 hover:text-purple-400 flex items-center gap-1 transition-colors">
                View all <ChevronRight size={13} />
              </button>
            </div>

            {loadingPredictions ? (
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-12 bg-slate-800 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : predictions.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-6">No predictions found.</p>
            ) : (
              <div className="space-y-2">
                {predictions.map((p) => {
                  const confPct = p.confidence ? Math.round(p.confidence * 100) : null;
                  return (
                    <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {p.home_team ?? "TBD"} vs {p.away_team ?? "TBD"}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{formatDate(p.match_date)}</p>
                      </div>
                      <div className="flex items-center gap-3 ml-3">
                        <div className="text-right">
                          <p className="text-xs text-slate-300 font-medium">{p.outcome ?? "Pending"}</p>
                          {confPct && (
                            <p className={`text-[10px] font-medium ${confidenceColor(p.confidence)}`}>{confPct}% conf.</p>
                          )}
                        </div>
                        {outcomeIcon(p.outcome)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Summary row */}
            {accuracy && (
              <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-3 gap-3 text-center">
                {[
                  { label: "Correct",   val: accuracy.correct_predictions,                                     cls: "text-green-400"  },
                  { label: "Incorrect", val: accuracy.total_predictions_analyzed - accuracy.correct_predictions, cls: "text-red-400"  },
                  { label: "30-Day",    val: accuracy.recent_predictions_count,                                 cls: "text-blue-400"   },
                ].map((r) => (
                  <div key={r.label} className="bg-slate-800/50 rounded-lg py-2">
                    <p className={`text-lg font-bold ${r.cls}`}>{r.val}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">{r.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
