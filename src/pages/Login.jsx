import { useState } from "react";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
=======
import Footer from "../components/Footer";
>>>>>>> 83451b7 (break)

export default function Login() {
  const [focusedInput, setFocusedInput] = useState(null);
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirm: "" });
<<<<<<< HEAD
=======
  const [loading, setLoading] = useState(false);
>>>>>>> 83451b7 (break)
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

<<<<<<< HEAD
  const handleSubmit = () => {
    navigate("/dashboard");
=======
  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // Validation
      if (isSignup && formData.password !== formData.confirm) {
        alert("Passwords do not match");
        setLoading(false);
        return;
      }
      
      if (!formData.email || !formData.password) {
        alert("Fill all required fields");
        setLoading(false);
        return;
      }

      if (isSignup) {
        const payload = {
          email: formData.email,
          password: formData.password,
          full_name: formData.name || undefined
        };
      
        if (formData.name) {
          
        }

        const response = await fetch("https://elliott888-epl-model.hf.space/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || data.detail || "Registration failed");
        }

        console.log("Registration success:", data);
        alert("Registration successful! Please login.");
        setIsSignup(false); 
        setFormData({ ...formData, password: "", confirm: "" }); 
        
      } else {
        const formBody = new URLSearchParams();
        formBody.append("username", formData.email);  // Use email as username
        formBody.append("password", formData.password);

        const response = await fetch("https://elliott888-epl-model.hf.space/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formBody,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || data.message || "Login failed");
        }

        // Store the token
        if (data.access_token) {
          localStorage.setItem("token", data.access_token);
          localStorage.setItem("token_type", data.token_type || "bearer");
          console.log("Login success, token stored");
          navigate("/dashboard");
        } else {
          throw new Error("No access token received");
        }
        
      }
      
    } catch (error) {
      console.error("Error:", error);
      
      
      let errorMessage = error.message;
      if (error.message.includes("EMAIL_ALREADY_REGISTERED")) {
        errorMessage = "Email already registered. Please login instead.";
      } else if (error.message.includes("Incorrect")) {
        errorMessage = "Invalid email or password";
      } else if (error.message.includes("INTERNAL_SERVER_ERROR")) {
        errorMessage = "Server error. The login endpoint is currently being fixed by the API owner. Please try again later or use registration for now.";
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
>>>>>>> 83451b7 (break)
  };

  const fields = isSignup
    ? [
        { name: "name", label: "Full Name", type: "text", placeholder: "John Doe" },
        { name: "email", label: "Email", type: "email", placeholder: "you@example.com" },
        { name: "password", label: "Password", type: "password", placeholder: "••••••••" },
        { name: "confirm", label: "Confirm Password", type: "password", placeholder: "••••••••" },
      ]
    : [
        { name: "email", label: "Email", type: "email", placeholder: "you@example.com" },
        { name: "password", label: "Password", type: "password", placeholder: "••••••••" },
      ];

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-black/60 backdrop-blur-md border border-blue-500/30 
=======
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4">
      <div className="mb-10 w-full max-w-md bg-black/60 backdrop-blur-md border border-blue-500/30 
>>>>>>> 83451b7 (break)
                      rounded-2xl px-8 py-10 shadow-2xl shadow-blue-500/10 animate-fade-in">

        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">
            <span className="text-blue-400">Sokka</span>
            <span className="text-purple-400">AI</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {isSignup ? "Create your account to get started" : "Welcome back! Please login to continue"}
          </p>
        </div>

        {/* Toggle Tabs */}
        <div className="flex bg-slate-800 rounded-lg p-1 mb-6">
          <button
            onClick={() => setIsSignup(false)}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all duration-300
                       ${!isSignup
                         ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                         : "text-slate-400 hover:text-white"}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsSignup(true)}
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

          {/* Forgot Password - login only */}
          {!isSignup && (
            <div className="text-right">
              <button className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
<<<<<<< HEAD
            className="w-full py-3 rounded-lg font-semibold text-white mt-2
                       bg-gradient-to-r from-blue-500 to-purple-500
                       hover:from-blue-600 hover:to-purple-600
                       transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/40
                       active:scale-95"
          >
            {isSignup ? "Create Account 🚀" : "Login"}
=======
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white mt-2
                       bg-gradient-to-r from-blue-500 to-purple-500
                       hover:from-blue-600 hover:to-purple-600
                       transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/40
                       active:scale-95 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Processing..." : (isSignup ? "Create Account" : "Login")}
>>>>>>> 83451b7 (break)
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-700"></div>
            <span className="text-slate-500 text-sm">or</span>
            <div className="flex-1 h-px bg-slate-700"></div>
          </div>

          {/* Switch */}
          <p className="text-center text-slate-400 text-sm">
            {isSignup ? "Already have an account? " : "Don't have an account? "}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              {isSignup ? "Login" : "Sign Up"}
            </button>
          </p>

        </div>
      </div>
<<<<<<< HEAD
    </div>
=======
      <Footer/>
    </div>
    
>>>>>>> 83451b7 (break)
  );
}