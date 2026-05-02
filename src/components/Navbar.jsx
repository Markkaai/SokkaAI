import { CircleUserRound } from "lucide";
import { Bell, CircleUserRoundIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";


export default function Navbar() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-row justify-between items-center bg-black/40 px-4 py-2 
               sm:backdrop-blur-lg rounded-lg border border-blue-500/40  mx-auto lg:w-full">
      
      {/* Logo */}
      <div>
        <span className="text-blue-400 text-lg font-bold tracking-wide">EPL</span>
        <span className="text-sm text-purple-400 font-semibold">PREDICTOR</span>
      </div>

      {/* Links */}
      <div className="flex space-x-3 px-3">
        <Link to="/fixtures" className="text-slate-300 hover:text-blue-400 transition-colors font-medium">Fixtures</Link>
        <Link to="/contact" className="text-slate-300 hover:text-blue-400 transition-colors font-medium">Leaderboard</Link>
        <Link className="text-slate-300 hover:text-blue-400 transition-colors font-medium">Insights</Link>
        <Link to="/contact" className="text-slate-300 hover:text-blue-400 transition-colors font-medium">Contact Us</Link>
      </div>

      {/* Notification and profile */}
      <div className="flex flex-row space-x-2">
        <Bell className="text-purple-400 text-sm"/>
        <CircleUserRoundIcon className="text-purple-400 text-sm"/>
        

      
      </div>

    </div>
  );
}