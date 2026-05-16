import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://elliott888-epl-model.hf.space";

export default function Login() {
  const [focusedInput, setFocusedInput] = useState(null);
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      if (!formData.email || !formData.password) {
        setError("Please fill in all required fields.");
        return;
      }

      if (isSignup && formData.password !== formData.confirm) {
        setError("Passwords do not match.");
        return;
      }

      // ── SIGN UP ──────────────────────────────────────────────────────────
      if (isSignup) {
        const payload = {
          email: formData.email,
          password: formData.password,
          ...(formData.name && { full_name: formData.name }),
        };

        const res = await fetch(`${BASE_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || data.message || "Registration failed.");

        if (data.access_token) {
          await loginWithToken(data.access_token, data.token_type || "bearer");
        } else {
          setIsSignup(false);
          setFormData((f) => ({ ...f, password: "", confirm: "" }));
          setError("");
          alert("Account created! Please log in.");
        }

      // ── LOG IN ───────────────────────────────────────────────────────────
      } else {
        const formBody = new URLSearchParams();
        formBody.append("username", formData.email);
        formBody.append("password", formData.password);

        const res = await fetch(`${BASE_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formBody,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || data.message || "Login failed.");
        if (!data.access_token) throw new Error("No access token received.");

        await loginWithToken(data.access_token, data.token_type || "bearer");
      }
    } catch (err) {
      console.error(err);
      let msg = err.message;
      if (msg.includes("EMAIL_ALREADY_REGISTERED"))  msg = "Email already registered. Please log in instead.";
      else if (msg.includes("Incorrect"))             msg = "Invalid email or password.";
      else if (msg.includes("INTERNAL_SERVER_ERROR")) msg = "Server error. Please try again later.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const loginWithToken = async (token, tokenType) => {
    localStorage.setItem("token", token);
    localStorage.setItem("token_type", tokenType);

    const profileRes = await fetch(`${BASE_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!profileRes.ok) {
      navigate("/dashboard");
      return;
    }

    const profile = await profileRes.json();
    localStorage.setItem("user", JSON.stringify(profile));

    if (profile.is_admin) navigate("/admin");
    else navigate("/dashboard");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const fields = isSignup
    ? [
        { name: "name",     label: "Full Name",       type: "text",     placeholder: "John Doe"        },
        { name: "email",    label: "Email",            type: "email",    placeholder: "you@example.com" },
        { name: "password", label: "Password",         type: "password", placeholder: "••••••••"        },
        { name: "confirm",  label: "Confirm Password", type: "password", placeholder: "••••••••"        },
      ]
    : [
        { name: "email",    label: "Email",    type: "email",    placeholder: "you@example.com" },
        { name: "password", label: "Password", type: "password", placeholder: "••••••••"        },
      ];

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background pitch grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.8) 40px, rgba(255,255,255,0.8) 41px),
                            repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.4) 60px, rgba(255,255,255,0.4) 61px)`,
        }}
      />

      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl px-8 py-10 shadow-2xl shadow-black/40 relative z-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="text-blue-400">EPL</span>
              <span className="text-purple-400"> Predictor</span>
            </h1>
          </div>
          <p className="text-slate-500 text-sm uppercase tracking-widest font-bold">
            AI Football Intelligence
          </p>
          <p className="text-slate-400 text-sm mt-3">
            {isSignup ? "Create your account to get started" : "Welcome back! Please login to continue"}
          </p>
        </div>

        {/* Toggle Tabs */}
        <div className="flex bg-slate-800 rounded-lg p-1 mb-6 border border-slate-700">
          <button
            onClick={() => { setIsSignup(false); setError(""); }}
            className={`flex-1 py-2 rounded-md text-sm font-bold uppercase tracking-widest transition-all duration-300
              ${!isSignup
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-white"}`}
          >
            Login
          </button>
          <button
            onClick={() => { setIsSignup(true); setError(""); }}
            className={`flex-1 py-2 rounded-md text-sm font-bold uppercase tracking-widest transition-all duration-300
              ${isSignup
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-white"}`}
          >
            Sign Up
          </button>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1.5 block">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocusedInput(field.name)}
                onBlur={() => setFocusedInput(null)}
                placeholder={field.placeholder}
                className={`w-full bg-slate-950 text-white placeholder-slate-600 px-4 py-3
                  rounded-lg border outline-none transition-all duration-300 text-sm font-medium
                  ${focusedInput === field.name
                    ? "border-blue-600 shadow-md shadow-blue-600/20"
                    : "border-slate-800 hover:border-slate-700"}`}
              />
            </div>
          ))}

          {/* Forgot Password */}
          {!isSignup && (
            <div className="text-right">
              <button className="text-blue-400 text-xs font-bold uppercase tracking-wider hover:text-blue-300 transition-colors">
                Forgot password?
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
              <span className="text-red-400 mt-0.5 text-sm">⚠️</span>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-3.5 rounded-lg font-bold text-sm uppercase tracking-widest text-white mt-2
              bg-blue-600 hover:bg-blue-700 transition-all duration-300
              hover:shadow-lg hover:shadow-blue-600/30 active:scale-95
              ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading
              ? (isSignup ? "Creating account…" : "Signing in…")
              : (isSignup ? "Create Account" : "Login")}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-slate-600 text-xs uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Switch */}
          <p className="text-center text-slate-500 text-sm">
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <button
              onClick={() => { setIsSignup(!isSignup); setError(""); }}
              className="text-blue-400 hover:text-blue-300 transition-colors font-bold"
            >
              {isSignup ? "Login" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
