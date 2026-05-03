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
      // --- Validation ---
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

        // Registration returns a token too — log user in directly
        if (data.access_token) {
          await loginWithToken(data.access_token, data.token_type || "bearer");
        } else {
          // Fallback: switch to login tab
          setIsSignup(false);
          setFormData((f) => ({ ...f, password: "", confirm: "" }));
          setError(""); // clear
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

  // Fetch /user to determine role, persist data, then route
  const loginWithToken = async (token, tokenType) => {
    localStorage.setItem("token", token);
    localStorage.setItem("token_type", tokenType);

    const profileRes = await fetch(`${BASE_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!profileRes.ok) {
      // Can't determine role — default to user dashboard
      console.warn("Could not fetch user profile, defaulting to /dashboard");
      navigate("/dashboard");
      return;
    }

    const profile = await profileRes.json();
    localStorage.setItem("user", JSON.stringify(profile));

    if (profile.is_admin) {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const fields = isSignup
    ? [
        { name: "name",     label: "Full Name",        type: "text",     placeholder: "John Doe" },
        { name: "email",    label: "Email",             type: "email",    placeholder: "you@example.com" },
        { name: "password", label: "Password",          type: "password", placeholder: "••••••••" },
        { name: "confirm",  label: "Confirm Password",  type: "password", placeholder: "••••••••" },
      ]
    : [
        { name: "email",    label: "Email",    type: "email",    placeholder: "you@example.com" },
        { name: "password", label: "Password", type: "password", placeholder: "••••••••" },
      ];

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div
        className="w-full max-w-md bg-black/60 backdrop-blur-md border border-blue-500/30
                   rounded-2xl px-8 py-10 shadow-2xl shadow-blue-500/10 animate-fade-in"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">
            <span className="text-blue-400">Sokka</span>
            <span className="text-purple-400">AI</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {isSignup
              ? "Create your account to get started"
              : "Welcome back! Please login to continue"}
          </p>
        </div>


        {/* Toggle Tabs */}
        <div className="flex bg-slate-800 rounded-lg p-1 mb-6">
          <button
            onClick={() => { setIsSignup(false); setError(""); }}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-300
                       ${!isSignup
                         ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                         : "text-slate-400 hover:text-white"}`}
          >
            Login
          </button>
          <button
            onClick={() => { setIsSignup(true); setError(""); }}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-300
                       ${isSignup
                         ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                         : "text-slate-400 hover:text-white"}`}
          >
            Sign Up
          </button>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="text-slate-400 text-sm mb-1 block">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocusedInput(field.name)}
                onBlur={() => setFocusedInput(null)}
                placeholder={field.placeholder}
                className={`w-full bg-slate-800/80 text-white placeholder-slate-500 px-4 py-3
                           rounded-lg border outline-none transition-all duration-300
                           ${focusedInput === field.name
                             ? "border-blue-500 shadow-md shadow-blue-500/30"
                             : "border-slate-700"}`}
              />
            </div>
          ))}

          {/* Forgot Password */}
          {!isSignup && (
            <div className="text-right">
              <button className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
                Forgot password?
              </button>
            </div>
          )}

          {/* Inline error */}
          {error && (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
              <span className="text-red-400 mt-0.5">⚠️</span>
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white mt-2
                       bg-gradient-to-r from-blue-500 to-purple-500
                       hover:from-blue-600 hover:to-purple-600
                       transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/40
                       active:scale-95 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading
              ? (isSignup ? "Creating account…" : "Signing in…")
              : (isSignup ? "Create Account" : "Login")}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-700" />
            <span className="text-slate-500 text-sm">or</span>
            <div className="flex-1 h-px bg-slate-700" />
          </div>

          {/* Switch */}
          <p className="text-center text-slate-400 text-sm">
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <button
              onClick={() => { setIsSignup(!isSignup); setError(""); }}
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              {isSignup ? "Login" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
