import { useState, useEffect } from "react";
import { data, Link, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { User, CircleUserRound , LayoutDashboard, TrendingUpDown, History} from "lucide-react";


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
        className="flex fixed top-0 z-50 w-full justify-between px-4 py-3 rounded-sm border-b border-slate-600 bg-slate-700"
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
        <div
        className="lg:flex flex-col pt-18 w-64 bg-blue/60 backdrop-blur-md bg-slate-800
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
            onClick={() => navigate("/dashboard")}
            className="flex text-left px-4 py-3 font-medium text-slate-700 cursor-pointer hover:bg-green-500/20 hover:text-white rounded-lg transition-all duration-300">
            <LayoutDashboard />
            <span className="ml-3">Dashboard</span>
          </button>
          <button
            onClick={() => navigate("/dashboard/predictions")}
            className="flex text-left px-4 py-3 font-medium text-slate-700 cursor-pointer hover:bg-green-500/20 hover:text-white rounded-lg transition-all duration-300">
            <TrendingUpDown />
            <span className="ml-3">Predictions</span>
          </button>
          <button
            onClick={() => navigate("/dashboard/history")}
            className="flex text-left px-4 py-3 font-medium text-slate-700 cursor-pointer hover:bg-green-500/20 hover:text-white rounded-lg transition-all duration-300">
            <History />
            <span className="ml-3">History</span>
          </button>
          
        </nav>

        {/* User */}
        <div className="mt-auto border-t border-slate-700 pt-3 ">
          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300 mb-1 ml-4 bg-red-600/20 hover:bg-red-600/30 px-3 py-2 rounded-lg text-sm transition-all duration-300"
          >
            Logout
          </button>
          <p className="text-slate-500 text-sm">@ 2026 Sokka AI</p>
          <span className="text-slate-500 text-sm">Made by Jeremiah</span>
        </div>
      </div>
      </div>
      

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 px-4 lg:px-8 py-8 bg-slate-900">
        {/* Top Bar */}
        <div className="flex items-center justify-between mt-6 mb-4">
          <div>
            <h2 className="text-2xl font-bold">Upcoming Matchweek</h2>
            <p className="text-slate-400 text-sm mt-1">
              AI powered match analysis and predictions for the next round of Premier League fixtures
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
          <Outlet />

        {/* Stats */}
      </div>
    </div>
  );
}
