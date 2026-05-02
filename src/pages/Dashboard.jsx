import { useState, useEffect } from "react";
import { data, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { User, CircleUserRound , LayoutDashboard, TrendingUpDown, History} from "lucide-react";

const stats = [
  { label: "Total Queries", value: "1,284", change: "+12%", color: "blue" },
  { label: "Active Sessions", value: "3", change: "+1", color: "purple" },
  { label: "Tokens Used", value: "84.2K", change: "+8%", color: "cyan" },
  { label: "Saved Chats", value: "27", change: "+3", color: "green" },
];

const recentChats = [
  {
    id: 1,
    title: "How to train a neural network?",
    time: "2 mins ago",
    icon: "🤖",
  },
  { id: 2, title: "Explain quantum computing", time: "1 hour ago", icon: "⚛️" },
  { id: 3, title: "Write a React component", time: "3 hours ago", icon: "💻" },
  { id: 4, title: "Best football tactics 2024", time: "Yesterday", icon: "⚽" },
  { id: 5, title: "Summarize this document", time: "2 days ago", icon: "📄" },
];

const quickActions = [
  { label: "New Chat", icon: "💬", color: "from-blue-500 to-blue-600" },
  { label: "Upload File", icon: "📁", color: "from-purple-500 to-purple-600" },
  { label: "Analytics", icon: "📊", color: "from-cyan-500 to-cyan-600" },
  { label: "Settings", icon: "⚙️", color: "from-slate-500 to-slate-600" },
];

const colorMap = {
  blue: "border-blue-500/30 shadow-blue-500/10 text-blue-400",
  purple: "border-purple-500/30 shadow-purple-500/10 text-purple-400",
  cyan: "border-cyan-500/30 shadow-cyan-500/10 text-cyan-400",
  green: "border-green-500/30 shadow-green-500/10 text-green-400",
};

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const avatarUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${user?.email}`;

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      await fetch("https://elliott888-epl-model.hf.space/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.log("Logout API failed but continuing:", err);
    }

    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return null;
        }

        const res = await fetch("https://elliott888-epl-model.hf.space/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch user");

        console.log("User:", data);
        setUser(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchUser();
  }, []);

  const navItems = ["Dashboard", "Predictions", "History"];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div
        class="topbar"
        className="flex justify-between px-4 py-3 rounded-sm border-b border-slate-600 bg-slate-700"
      >
        <div>
          <h1 className="text-2xl font-bold">
            <span className="text-blue-400">SOKKA</span>
            <span> </span>
            <span className="text-purple-400">AI</span>
          </h1>
        </div>
        <div>
          <CircleUserRound
            onClick={() => navigate("/profile")}
            className="text-slate-300"
          />
        </div>
      </div>

     
      <div>
         {/* Sidebar */}
        <div class="sidebar"
        className="lg:flex flex-col w-64 bg-blue/60 backdrop-blur-md 
                      border-r border-blue-500/20 px-4 py-6 fixed h-full"
      >
        
        <div
          className="flex items-center gap-3 px-2 mb-5"
          onClick={() => navigate("/profile")}
          style={{ cursor: "pointer" }}
        >
          <div
            className="w-9 h-9
                            flex items-center justify-center text-sm font-bold"
          >
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
          </div>
          <div>
            <p className="text-sm text-slate-300 font-medium">
              {user ? user.full_name : "loading..."}
            </p>
            <p className="text-xs text-green-400">
              {user ? user.email : "loading..."}
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-2">
          <button
            onClick={() => setActiveNav()}
            className="flex text-left px-4 py-3 font-medium text-slate-700 cursor-pointer hover:bg-green-500/20 hover:text-white rounded-lg transition-all duration-300">
            <LayoutDashboard />
            <span className="ml-3">Dashboard</span>
          </button>
          <button
            onClick={() => setActiveNav()}
            className="flex text-left px-4 py-3 font-medium text-slate-700 cursor-pointer hover:bg-green-500/20 hover:text-white rounded-lg transition-all duration-300">
            <TrendingUpDown />
            <span className="ml-3">Predictions</span>
          </button>
          <button
            onClick={() => setActiveNav()}
            className="flex text-left px-4 py-3 font-medium text-slate-700 cursor-pointer hover:bg-green-500/20 hover:text-white rounded-lg transition-all duration-300">
            <History />
            <span className="ml-3">History</span>
          </button>
          
        </nav>

        {/* User */}
        <div className="mt-auto border-t border-slate-700 pt-4">
          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300 mt-5 ml-4 bg-red-600/20 hover:bg-red-600/30 px-3 py-2 rounded-lg text-sm transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </div>
      </div>
      

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 px-4 lg:px-8 py-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Welcome back</h2>
            <p className="text-slate-400 text-sm mt-1">
              Here's what's happening today
            </p>
          </div>
          <div
            onClick={() => navigate("/profile")}
            className="w-9 h-9
                          flex items-center justify-center font-bold cursor-pointer"
          >
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`bg-black/40 backdrop-blur-md border rounded-xl px-4 py-5 
                         shadow-lg transition-all duration-300 hover:scale-105 ${colorMap[stat.color]}`}
            >
              <p className="text-slate-400 text-xs mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p
                className={`text-xs mt-1 ${colorMap[stat.color].split(" ").pop()}`}
              >
                {stat.change} this week
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action) => (
            <button
              key={action.label}
              className={`bg-gradient-to-r ${action.color} px-4 py-4 rounded-xl font-medium
                         flex items-center gap-3 hover:scale-105 hover:shadow-lg 
                         transition-all duration-300 active:scale-95`}
            >
              <span className="text-xl">{action.icon}</span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Chats */}
          <div className="bg-black/40 backdrop-blur-md border border-blue-500/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-400">
              Recent Chats
            </h3>
            <div className="flex flex-col gap-3">
              {recentChats.map((chat) => (
                <div
                  key={chat.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 
                             hover:bg-slate-700/50 cursor-pointer transition-all duration-200
                             border border-transparent hover:border-blue-500/20"
                >
                  <span className="text-xl">{chat.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{chat.title}</p>
                    <p className="text-xs text-slate-500">{chat.time}</p>
                  </div>
                  <span className="text-slate-600 text-xs">→</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Chat Box */}
          <div className="bg-black/40 backdrop-blur-md border border-purple-500/20 rounded-xl p-6 flex flex-col">
            <h3 className="text-lg font-semibold mb-4 text-purple-400">
              Quick Chat
            </h3>

            {/* Chat Area */}
            <div className="flex-1 bg-slate-800/40 rounded-lg p-4 mb-4 min-h-40 flex items-center justify-center">
              <p className="text-slate-500 text-sm text-center">
                Start a conversation with SokkaAI ✨
              </p>
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask SokkaAI anything..."
                className="flex-1 bg-slate-800 text-white placeholder-slate-500 px-4 py-2 
                           rounded-lg border border-slate-700 outline-none 
                           focus:border-purple-500 focus:shadow-md focus:shadow-purple-500/20
                           transition-all duration-300 text-sm"
              />
              <button
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 
                           rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 
                           transition-all duration-300 active:scale-95 text-sm"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
