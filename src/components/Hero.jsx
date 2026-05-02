import image from "../assets/img.png";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate=useNavigate();
  return (
    <section className="relative h-screen w-full overflow-hidden">
      
      {/* Background Image */}
      <img src={image} alt="hero" className="absolute inset-0 w-full h-full object-cover" />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/80"></div>

      {/* Hero Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <h1 className="text-white text-5xl font-bold">AI-powered</h1>
          <h1 className="text-blue-500 text-5xl font-bold italic">Premier League</h1>
        </div>
        <h1 className="text-white text-5xl font-bold mt-2">match predictions</h1>
        <p className="text-slate-400 mt-6 max-w-2xl text-lg leading-relaxed">
          Leverage elite machine learning models and deep historical data
          to predict match outcomes with unprecedented accuracy. Join the 0.1% of top-tier analysts.
        </p>

        {/* Buttons Group */}
        <div className="flex flex-row space-x-4 mt-10">
          
          {/* Get started Button */}
          <button className="
            bg-blue-600 text-white
            text-sm font-bold tracking-wide uppercase
            px-8 py-3 rounded-md
            hover:bg-blue-700
            active:scale-95
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black
            transition-all duration-200
            cursor-pointer" onClick={()=>navigate("/login")}>
            Get Started
          </button>

          {/* login Button */}
          <button className="
            bg-blue-600 text-white
            text-sm font-bold tracking-wide uppercase
            px-8 py-3 rounded-md
            hover:bg-blue-700
            active:scale-95
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black
            transition-all duration-200
            cursor-pointer" onClick={()=>navigate("/login")}>
            Login
          </button>

        </div>
      </div>
    </section>
  );
}