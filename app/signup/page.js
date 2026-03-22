// app/signup/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Brain, Loader2, AlertCircle, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const requirements = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "Contains a number", test: (p) => /\d/.test(p) },
];

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed. Please try again.");
        return;
      }

      toast({ title: `Account created! Welcome, ${data.user.name} 🎉` });
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "hsl(222 47% 5%)" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, hsl(286 90% 65%) 0%, transparent 70%)" }} />
        <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, hsl(246 80% 60%) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      </div>

      <div className="relative z-10 w-full max-w-md px-6 py-8">
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 gradient-bg shadow-lg shadow-indigo-500/30">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">SensAI</h1>
          <p className="text-white/40 text-sm mt-1 font-medium">Your AI Career Co-Pilot</p>
        </div>

        <div className="rounded-2xl border border-white/10 p-8"
          style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)" }}>
          <h2 className="text-xl font-bold text-white mb-1">Create your account</h2>
          <p className="text-white/40 text-sm mb-7">Start your AI-powered career journey</p>

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm mb-5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-white/70 text-sm font-medium">Full name</Label>
              <Input id="name" name="name" type="text" autoComplete="name"
                placeholder="Jane Smith"
                value={form.name} onChange={handleChange}
                className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-indigo-500" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-white/70 text-sm font-medium">Email address</Label>
              <Input id="email" name="email" type="email" autoComplete="email"
                placeholder="you@example.com"
                value={form.email} onChange={handleChange}
                className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-indigo-500" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-white/70 text-sm font-medium">Password</Label>
              <div className="relative">
                <Input id="password" name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  value={form.password} onChange={handleChange}
                  className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/25 pr-11 focus:border-indigo-500" />
                <button type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {form.password.length > 0 && (
                <div className="flex gap-4 mt-2">
                  {requirements.map((req) => {
                    const met = req.test(form.password);
                    return (
                      <div key={req.label} className={`flex items-center gap-1.5 text-xs transition-colors ${met ? "text-emerald-400" : "text-white/25"}`}>
                        <Check className="w-3 h-3" />
                        {req.label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <Button type="submit" disabled={loading}
              className="w-full h-11 gradient-bg text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-500/20 hover:opacity-90 transition-opacity border-0">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
            </Button>
          </form>

          <p className="text-center text-sm text-white/35 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
