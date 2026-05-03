import { useState } from "react";
import { LayoutDashboard, Users, ShieldCheck, TrendingUp, Bell, LogOut, ChevronRight, MoreHorizontal, CheckCircle, XCircle, Clock } from "lucide-react";

const stats = [
  { label: "Total Users",        value: "4,821",  change: "+84 today",   color: "blue"   },
  { label: "Active Predictions", value: "1,340",  change: "+12%",        color: "purple" },
  { label: "Model Accuracy",     value: "84.2%",  change: "+2.1%",       color: "cyan"   },
  { label: "Flagged Reports",    value: "6",      change: "Needs review", color: "red"   },
];

const recentUsers = [
  { id: 1, name: "James Ochieng",  email: "james@email.com",  plan: "Pro",  status: "active",   joined: "2 mins ago"   },
  { id: 2, name: "Amina Hassan",   email: "amina@email.com",  plan: "Free", status: "active",   joined: "1 hour ago"   },
  { id: 3, name: "Brian Mutua",    email: "brian@email.com",  plan: "Pro",  status: "suspended",joined: "3 hours ago"  },
  { id: 4, name: "Linda Wanjiru",  email: "linda@email.com",  plan: "Free", status: "active",   joined: "Yesterday"    },
  { id: 5, name: "Sarah Kimani",   email: "sarah@email.com",  plan: "Elite",status: "active",   joined: "2 days ago"   },
];

const recentPredictions = [
  { match: "Man City vs Arsenal",    tip: "Man City Win", confidence: 82, status: "correct",  league: "Premier League" },
  { match: "Real Madrid vs Barca",   tip: "Draw",         confidence: 61, status: "incorrect",league: "La Liga"        },
  { match: "Bayern vs Dortmund",     tip: "Bayern Win",   confidence: 78, status: "correct",  league: "Bundesliga"     },
  { match: "PSG vs Lyon",            tip: "PSG Win",      confidence: 85, status: "pending",  league: "Ligue 1"        },
];

const navItems = [
  { label: "Dashboard",   icon: LayoutDashboard },
  { label: "Users",       icon: Users           },
  { label: "Predictions", icon: TrendingUp      },
  { label: "Moderation",  icon: ShieldCheck     },
];

const colorMap = {
  blue:   { border: "border-blue-500/30",   text: "text-blue-400",   bg: "bg-blue-500/10"   },
  purple: { border: "border-purple-500/30", text: "text-purple-400", bg: "bg-purple-500/10" },
  cyan:   { border: "border-cyan-500/30",   text: "text-cyan-400",   bg: "bg-cyan-500/10"   },
  red:    { border: "border-red-500/30",    text: "text-red-400",    bg: "bg-red-500/10"    },
};

const statusStyle = {
  active:    "bg-green-500/15 text-green-400 border border-green-500/30",
  suspended: "bg-red-500/15 text-red-400 border border-red-500/30",
  pending:   "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
};

const predStatusIcon = {
  correct:   <CheckCircle size={14} className="text-green-400" />,
  incorrect: <XCircle size={14} className="text-red-400" />,
  pending:   <Clock size={14} className="text-yellow-400" />,
};

export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard");

  return (
    <div className="min-h-screen bg-slate-950 text-white flex" style={{ fontFamily: "'Georgia', serif" }}>

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
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">Admin</p>
              <p className="text-[10px] text-slate-500 truncate">admin@kickpredict.com</p>
            </div>
          </div>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200">
            <LogOut size={16} />
            Sign Out
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
            <button className="relative p-2 rounded-lg bg-slate-800 border border-slate-700 hover:border-blue-500/40 transition-all">
              <Bell size={18} className="text-slate-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-sm font-bold">
              A
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => {
            const c = colorMap[s.color];
            return (
              <div key={s.label} className={`bg-slate-900 border ${c.border} rounded-xl p-5 hover:scale-105 transition-all duration-300`}>
                <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-2">{s.label}</p>
                <p className="text-2xl font-bold text-white">{s.value}</p>
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
            <div className="space-y-2">
              {recentUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/40 to-purple-500/40 flex items-center justify-center text-xs font-bold text-blue-300">
                      {u.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold leading-tight">{u.name}</p>
                      <p className="text-[10px] text-slate-500">{u.joined}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">{u.plan}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${statusStyle[u.status]}`}>{u.status}</span>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-white">
                      <MoreHorizontal size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Predictions */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold uppercase tracking-widest text-purple-400">Recent Predictions</h3>
              <button className="text-xs text-slate-500 hover:text-purple-400 flex items-center gap-1 transition-colors">
                View all <ChevronRight size={13} />
              </button>
            </div>
            <div className="space-y-2">
              {recentPredictions.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{p.match}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{p.league}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-3">
                    <div className="text-right">
                      <p className="text-xs text-slate-300 font-medium">{p.tip}</p>
                      <p className="text-[10px] text-cyan-400">{p.confidence}% conf.</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {predStatusIcon[p.status]}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary row */}
            <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-3 gap-3 text-center">
              {[
                { label: "Correct",   val: "2", cls: "text-green-400"  },
                { label: "Incorrect", val: "1", cls: "text-red-400"    },
                { label: "Pending",   val: "1", cls: "text-yellow-400" },
              ].map((r) => (
                <div key={r.label} className="bg-slate-800/50 rounded-lg py-2">
                  <p className={`text-lg font-bold ${r.cls}`}>{r.val}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">{r.label}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
