"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "../../../action/auth";
import supabase from "../../../utils/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const result = await signIn(form);

      if (result.status === "success") {
        // Convert user object to plain object to avoid Next.js serialization issues
        const user = result.user ? JSON.parse(JSON.stringify(result.user)) : null;
        localStorage.setItem("user", JSON.stringify(user));
        setMessage("✅ Login successful!");
        
        // Add success animation delay before redirecting
        setTimeout(() => {
          router.push("/mainpage"); 
        }, 1500);
      } else {
        setMessage("❌ " + result.status);
      }
    } catch (err) {
      setMessage("❌ " + (err.message || "Unexpected error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-blue-300 opacity-20 animate-float"
            style={{
              width: `${50 + i * 20}px`,
              height: `${50 + i * 20}px`,
              top: `${10 + i * 15}%`,
              left: `${5 + i * 10}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${15 + i * 5}s`
            }}
          ></div>
        ))}
        {[...Array(5)].map((_, i) => (
          <div
            key={i + 5}
            className="absolute rounded-full bg-purple-300 opacity-20 animate-float-reverse"
            style={{
              width: `${40 + i * 15}px`,
              height: `${40 + i * 15}px`,
              top: `${20 + i * 10}%`,
              right: `${5 + i * 8}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${12 + i * 4}s`
            }}
          ></div>
        ))}
      </div>

      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md relative z-10 transform transition-all duration-500 hover:scale-105">
        {/* Decorative elements */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-4xl">👋</span>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2 pt-4">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-6">Sign in to continue your journey</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder=" "
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none peer transition-all duration-300"
            />
            <label className={`absolute left-4 top-3 px-1 text-gray-500 transition-all duration-300 pointer-events-none 
                              peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                              peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-600 peer-focus:bg-white
                              -top-2 text-sm bg-white text-blue-600`}>
              Email Address
            </label>
          </div>
          
          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder=" "
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none peer transition-all duration-300"
            />
            <label className={`absolute left-4 top-3 px-1 text-gray-500 transition-all duration-300 pointer-events-none 
                              peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                              peer-focus:-top-2 peer-focus:text-sm peer-focus:text-blue-600 peer-focus:bg-white
                              -top-2 text-sm bg-white text-blue-600`}>
              Password
            </label>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-medium transition-all duration-500 transform hover:scale-105
                      ${loading 
                        ? 'bg-blue-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg'}`}
          >
            <span className={`flex items-center justify-center ${loading ? 'opacity-0' : 'opacity-100'}`}>
              Login
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
            
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-center animate-fadeIn ${message.includes("✅") 
            ? "bg-green-100 text-green-700 border border-green-200" 
            : "bg-red-100 text-red-700 border border-red-200"}`}>
            {message}
          </div>
        )}

        <div className="flex justify-between mt-6 text-sm">
          <button
            onClick={() => router.push("/signup")}
            className="text-blue-600 hover:text-blue-800 transition-colors duration-300 flex items-center group"
          >
            <span className="mr-1 group-hover:scale-110 transition-transform duration-300">+</span>
            Create Account
          </button>
          <button
            onClick={() => router.push("/forgot-password")}
            className="text-blue-600 hover:text-blue-800 transition-colors duration-300 flex items-center group"
          >
            <span className="mr-1 group-hover:scale-110 transition-transform duration-300">🔑</span>
            Forgot Password?
          </button>
        </div>
      </div>

      {/* Add custom animations to Tailwind */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes floatReverse {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-5deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
        .animate-float-reverse {
          animation: floatReverse 12s ease-in-out infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}