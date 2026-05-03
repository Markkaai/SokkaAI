import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black/60 backdrop-blur-md border-t border-blue-500/20 text-white px-6 py-10">
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Logo & Description */}
        <div>
          <h2 className="text-2xl font-bold mb-2">
            <span className="text-blue-400">EPL</span>
            <span className="text-purple-400 text-sm">PREDICTOR</span>
          </h2>
          <p className="text-slate-400 mt-6 max-w-2xl text-sm leading-relaxed">
          Leverage elite machine learning models and deep historical data
          to predict match outcomes with unprecedented accuracy. Join the 0.1% of top-tier analysts.
        </p>
        </div>

       
       

        {/* Contact */}
        <div>
          <h3 className="text-blue-400 font-semibold mb-4">Contact</h3>
          <div className="flex flex-col gap-2 text-slate-400 text-sm">
            <p>📧 support@eplpredictor.com</p>
            <p>📍 Nairobi, Kenya</p>
            <p>🕐 Mon - Fri, 9am - 6pm</p>
          </div>

          
          
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-slate-800 
                      flex flex-col md:flex-row items-center justify-between gap-2">
        <p className="text-slate-500 text-xs">© 2026 EplPredictor. All rights reserved.</p>
        <div className="flex gap-4">
          {["Privacy Policy", "Terms of Service"].map((item) => (
            <Link
              key={item}
              className="text-slate-500 text-xs hover:text-blue-400 transition-colors duration-200"
            >
              {item}
            </Link>
          ))}
        </div>
      </div>

    </footer>
  );
}