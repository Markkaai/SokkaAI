import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black/60 backdrop-blur-md border-t border-blue-500/20 text-white px-6 py-10">
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Logo & Description */}
        <div>
          <h2 className="text-2xl font-bold mb-2">
            <span className="text-blue-400">Sokka</span>
            <span className="text-purple-400">AI</span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Your intelligent AI assistant. Powered by cutting-edge technology to help you work smarter.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-blue-400 font-semibold mb-4">Quick Links</h3>
          <div className="flex flex-col gap-2">
            {["Home", "Services", "Contact Us", "Dashboard"].map((link) => (
              <Link
                key={link}
                className="text-slate-400 text-sm hover:text-blue-400 transition-colors duration-200 w-fit"
              >
                {link}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-blue-400 font-semibold mb-4">Contact</h3>
          <div className="flex flex-col gap-2 text-slate-400 text-sm">
            <p>📧 support@sokkaai.com</p>
            <p>📍 Nairobi, Kenya</p>
            <p>🕐 Mon - Fri, 9am - 6pm</p>
          </div>

          {/* Socials */}
          <div className="flex gap-3 mt-4">
            {["𝕏", "in", "f"].map((icon) => (
              <button
                key={icon}
                className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500
                           flex items-center justify-center text-xs font-bold
                           hover:scale-110 transition-all duration-300 active:scale-95"
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-slate-800 
                      flex flex-col md:flex-row items-center justify-between gap-2">
        <p className="text-slate-500 text-xs">© 2026 SokkaAI. All rights reserved.</p>
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