import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CircleUserRound, LayoutDashboard, TrendingUpDown, History, Send } from "lucide-react";

const stats = [
  { label: "Prediction Accuracy", value: "84.2%", change: "+2.1%", color: "blue" },
  { label: "Active Models", value: "3", change: "Stable", color: "blue" },
  { label: "Matches Analyzed", value: "1,284", change: "+12%", color: "blue" },
  { label: "Win Streak", value: "7", change: "+3", color: "blue" },
];

const recentChats = [
  { id: 1, title: "Arsenal vs Man City Analysis", time: "2 mins ago", icon: "⚽" },
  { id: 2, title: "Top Scorer Trends: Erling Haaland", time: "1 hour ago", icon: "📈" },
  { id: 3, title: "Explain Expected Goals (xG)", time: "3 hours ago", icon: "🧠" },
  { id: 4, title: "Midfield Battles: Rodri vs Rice", time: "Yesterday", icon: "⚔️" },
];

const quickActions = [
  { label: "New Analysis", icon: "➕", color: "bg-blue-600 hover:bg-blue-700" },
  { label: "Upload CSV", icon: "📁", color: "bg-slate-800 hover:bg-slate-700" },
  { label: "Generate Report", icon: "📊", color: "bg-slate-800 hover:bg-slate-700" },
  { label: "Model Settings", icon: "⚙️", color: "bg-slate-800 hover:bg-slate-700" },
];

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const avatarUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${user?.email}`;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/"); return; }
        const res = await fetch("https://elliott888-epl-model.hf.space/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setUser(data);
      } catch (err) { console.error(err); }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    
    <div className="min-h-screen bg-slate-950 text-white pt-20 pb-10 flex flex-col lg:flex-row">
      
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900/50 border-r border-slate-800 p-6 fixed h-full">
        <div className="flex items-center gap-3 mb-10 p-2 bg-slate-800/40 rounded-lg border border-slate-700">
          <img src={avatarUrl} alt="avatar" className="w-10 h-10 rounded-full border border-blue-500" />
          <div className="truncate">
            <p className="text-sm font-bold truncate">{user ? user.full_name : "User"}</p>
            <p className="text-[10px] text-blue-400 uppercase tracking-widest font-bold">Elite Tier</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {[
            { name: "Dashboard", icon: <LayoutDashboard size={20}/> },
            { name: "Predictions", icon: <TrendingUpDown size={20}/> },
            { name: "History", icon: <History size={20}/> }
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveNav(item.name)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeNav === item.name 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-auto py-3 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all text-sm font-bold uppercase tracking-widest"
        >
          Sign Out
        </button>
      </aside>

      {/* Main Content Space */}
      <main className="flex-1 lg:ml-64 px-6 lg:px-12">
        
        {/* Welcome Header */}
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold">Workspace <span className="text-blue-500">Overview</span></h2>
            <p className="text-slate-500 mt-1">Real-time match analytics and model performance.</p>
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">System Status</p>
            <p className="text-xs text-emerald-400 flex items-center gap-1 justify-end">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> Operational
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-slate-900 border border-slate-800 p-5 rounded-xl hover:border-blue-500/50 transition-all">
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">{stat.label}</p>
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-xs mt-2 text-blue-400 font-medium">{stat.change} vs last session</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {quickActions.map((action) => (
            <button key={action.label} className={`${action.color} py-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg`}>
              <span>{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Analysis History */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-blue-500 mb-6">Recent Analyses</h3>
            <div className="space-y-3">
              {recentChats.map((chat) => (
                <div key={chat.id} className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-lg hover:border-slate-700 cursor-pointer transition-all">
                  <div className="flex items-center gap-4">
                    <span className="text-xl">{chat.icon}</span>
                    <div>
                      <p className="text-sm font-bold truncate max-w-[150px] md:max-w-none">{chat.title}</p>
                      <p className="text-[10px] text-slate-500 uppercase">{chat.time}</p>
                    </div>
                  </div>
                  <span className="text-blue-500 text-xs font-bold">VIEW</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Predictor Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col min-h-[350px]">
            <h3 className="text-sm font-bold uppercase tracking-widest text-blue-500 mb-6">AI Match Predictor</h3>
            
            <div className="flex-1 bg-slate-950/50 rounded-lg border border-slate-800 flex flex-col items-center justify-center p-8 mb-6 border-dashed">
              <div className="w-12 h-12 bg-blue-600/10 rounded-full flex items-center justify-center mb-4 text-blue-500">
                <Send size={24} />
              </div>
              <p className="text-slate-400 text-sm text-center font-medium">
                Enter a match or player name to generate a deep-data prediction report.
              </p>
            </div>

            <div className="relative group">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ex: 'Arsenal vs Man City Win Probabilities'..."
                className="w-full bg-slate-950 text-white placeholder-slate-600 px-5 py-4 rounded-lg border border-slate-800 focus:border-blue-600 focus:outline-none transition-all text-sm font-medium"
              />
              <button className="absolute right-2 top-2 bottom-2 bg-blue-600 px-4 rounded-md text-xs font-bold uppercase hover:bg-blue-700 transition-all active:scale-90">
                Predict
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}