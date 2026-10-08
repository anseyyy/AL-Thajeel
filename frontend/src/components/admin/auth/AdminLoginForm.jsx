"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { images } from "@/assets/images";
import { LuLock, LuMail, LuEye, LuEyeOff, LuArrowRight, LuShieldCheck } from "react-icons/lu";
import "@/app/admin/admin.css";

export default function AdminLoginForm() {
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      showSuccess("Welcome back, Administrator.");
    } catch (err) {
      const msg =
        err.message || "Invalid email or password. Please try again.";
      setErrorMessage(msg);
      showError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-shell min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#F2EFE7] relative overflow-hidden">
      {/* Decorative ambient background accents */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#C8DFDB]/50 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#66A3BF]/20 blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-[0_10px_30px_rgba(51,104,160,0.10)] border border-[rgba(51,104,160,0.16)] p-8 sm:p-10 relative z-10 animate-[rise_0.4s_ease-out]">
        
        {/* Logo Container */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#F2EFE7] border border-[rgba(51,104,160,0.16)] flex items-center justify-center p-3 shadow-xs mb-4">
            <img
              src={images.logos.logo}
              alt="Al Thajeel Real Estates"
              className="w-full h-full object-contain"
            />
          </div>

          <h1 className="font-serif text-2xl sm:text-[1.75rem] font-bold text-[#18324A] tracking-tight">
            Admin Portal
          </h1>
          <p className="text-[0.88rem] text-[#60788A] mt-1 font-sans">
            Al Thajeel Real Estates Management System
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[0.85rem] flex items-start gap-2.5">
            <span className="font-semibold">Error:</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-[0.82rem] font-semibold uppercase tracking-wider text-[#18324A] mb-1.5 font-sans">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#60788A]">
                <LuMail className="text-base" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@althajeel.ae"
                className="w-full pl-10 pr-4 py-3 bg-white border border-[rgba(51,104,160,0.22)] rounded-xl text-[#18324A] text-[0.92rem] focus:outline-none focus:border-[#66A3BF] focus:ring-3 focus:ring-[#66A3BF]/20 transition-all font-sans"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-[0.82rem] font-semibold uppercase tracking-wider text-[#18324A] mb-1.5 font-sans">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#60788A]">
                <LuLock className="text-base" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-11 py-3 bg-white border border-[rgba(51,104,160,0.22)] rounded-xl text-[#18324A] text-[0.92rem] focus:outline-none focus:border-[#66A3BF] focus:ring-3 focus:ring-[#66A3BF]/20 transition-all font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#60788A] hover:text-[#18324A] transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <LuEyeOff className="text-base" /> : <LuEye className="text-base" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-6 rounded-xl bg-[#3368A0] hover:bg-[#285781] text-white font-semibold text-[0.95rem] shadow-[0_4px_14px_rgba(51,104,160,0.25)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed font-sans"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <LuArrowRight className="text-base" />
              </>
            )}
          </button>
        </form>

        {/* Security badge */}
        <div className="mt-8 pt-6 border-t border-[rgba(51,104,160,0.12)] flex items-center justify-center gap-2 text-[0.78rem] text-[#60788A]">
          <LuShieldCheck className="text-[#3368A0] text-base" />
          <span>Encrypted Administrator Session</span>
        </div>
      </div>
    </div>
  );
}
