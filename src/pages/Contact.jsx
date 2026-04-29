import { useState } from "react";
import { Link } from "react-router-dom";

export default function Contact() {
  const [focusedInput, setFocusedInput] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
    }
  };

  const contactInfo = [
    { icon: "📧", label: "Email", value: "support@sokkaai.com" },
    { icon: "📍", label: "Location", value: "Nairobi, Kenya" },
    { icon: "🕐", label: "Working Hours", value: "Mon - Fri, 9am - 6pm" },
  ];

  const socials = [
    { icon: "𝕏", label: "Twitter" },
    { icon: "in", label: "LinkedIn" },
    { icon: "f", label: "Facebook" },
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="text-center bg-black/60 backdrop-blur-md border border-blue-500/30 
                        rounded-2xl px-10 py-14 shadow-2xl shadow-blue-500/10 animate-fade-in">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold text-white mb-2">Message Sent!</h2>
          <p className="text-slate-400 mb-6">We'll get back to you as soon as possible.</p>
          <button
            onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", subject: "", message: "" }); }}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 
                       rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 
                       transition-all duration-300 active:scale-95"
          >
            Send Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white px-4 py-16">

      {/* Header */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl font-bold mb-3">
          Get in <span className="text-blue-400">Touch</span>
        </h1>
        <p className="text-slate-400 max-w-md mx-auto">
          Have a question or want to work with us? We'd love to hear from you.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10">

        {/* Left - Contact Info */}
        <div className="flex flex-col gap-6">

          {/* Info Cards */}
          {contactInfo.map((info) => (
            <div
              key={info.label}
              className="flex items-center gap-4 bg-black/40 backdrop-blur-md border 
                         border-blue-500/20 rounded-xl px-6 py-5 hover:border-blue-500/50 
                         hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
            >
              <span className="text-3xl">{info.icon}</span>
              <div>
                <p className="text-slate-400 text-sm">{info.label}</p>
                <p className="text-white font-medium">{info.value}</p>
              </div>
            </div>
          ))}

          {/* Socials */}
          <div className="bg-black/40 backdrop-blur-md border border-purple-500/20 
                          rounded-xl px-6 py-5">
            <p className="text-slate-400 text-sm mb-4">Follow us on</p>
            <div className="flex gap-3">
              {socials.map((s) => (
                <button
                  key={s.label}
                  className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 
                             flex items-center justify-center font-bold text-sm
                             hover:scale-110 hover:shadow-lg hover:shadow-blue-500/30 
                             transition-all duration-300 active:scale-95"
                >
                  {s.icon}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right - Form */}
        <div className="bg-black/60 backdrop-blur-md border border-blue-500/30 
                        rounded-2xl px-8 py-10 shadow-2xl shadow-blue-500/10">

          <div className="space-y-5">

            {/* Name & Email */}
            <div className="grid grid-cols-2 gap-4">
              {["name", "email"].map((field) => (
                <div key={field}>
                  <label className="text-slate-400 text-sm mb-1 block capitalize">{field}</label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    onFocus={() => setFocusedInput(field)}
                    onBlur={() => setFocusedInput(null)}
                    placeholder={field === "email" ? "you@example.com" : "John Doe"}
                    className={`w-full bg-slate-800/80 text-white placeholder-slate-500 px-4 py-3 
                               rounded-lg border outline-none transition-all duration-300 text-sm
                               ${focusedInput === field
                                 ? "border-blue-500 shadow-md shadow-blue-500/30"
                                 : "border-slate-700"}`}
                  />
                </div>
              ))}
            </div>

            {/* Subject */}
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                onFocus={() => setFocusedInput("subject")}
                onBlur={() => setFocusedInput(null)}
                placeholder="How can we help?"
                className={`w-full bg-slate-800/80 text-white placeholder-slate-500 px-4 py-3 
                           rounded-lg border outline-none transition-all duration-300 text-sm
                           ${focusedInput === "subject"
                             ? "border-blue-500 shadow-md shadow-blue-500/30"
                             : "border-slate-700"}`}
              />
            </div>

            {/* Message */}
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                onFocus={() => setFocusedInput("message")}
                onBlur={() => setFocusedInput(null)}
                placeholder="Write your message here..."
                rows={5}
                className={`w-full bg-slate-800/80 text-white placeholder-slate-500 px-4 py-3 
                           rounded-lg border outline-none transition-all duration-300 text-sm resize-none
                           ${focusedInput === "message"
                             ? "border-blue-500 shadow-md shadow-blue-500/30"
                             : "border-slate-700"}`}
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              className="w-full py-3 rounded-lg font-semibold text-white
                         bg-gradient-to-r from-blue-500 to-purple-500
                         hover:from-blue-600 hover:to-purple-600
                         transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/40
                         active:scale-95"
            >
              Send Message 🚀
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}