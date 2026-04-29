import { Link, useNavigate } from "react-router-dom";


export default function Navbar() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-row justify-between items-center mt-2 bg-black/40 px-4 py-2 
               sm:backdrop-blur-lg rounded-lg border border-blue-500/40 w-11/12 mx-auto lg:w-1/2">
      
      {/* Logo */}
      <div>
        <span className="text-blue-400 text-lg font-bold tracking-wide">Sokka</span>
        <span className="text-sm text-purple-400 font-semibold">AI</span>
      </div>

      {/* Links */}
      <div className="flex space-x-3 px-3">
        <Link className="text-slate-300 hover:text-blue-400 transition-colors font-medium">Home</Link>
        <Link to="/contact" className="text-slate-300 hover:text-blue-400 transition-colors font-medium">Contact Us</Link>
        <Link className="text-slate-300 hover:text-blue-400 transition-colors font-medium">Services</Link>
      </div>

      {/* Button */}
      <div 
       onClick={() => navigate("/login")}
       className="px-4 py-1 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 cursor-pointer transition-all">
        <h2 className="text-white font-semibold">Get Started</h2>
      </div>

    </div>
  );
}