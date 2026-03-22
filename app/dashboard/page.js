"use client";

import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import {
  FileText,
  MessageSquare,
  Zap,
  Compass,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Users,
  Star,
} from "lucide-react";

const FEATURES = [
  {
    icon: FileText,
    title: "Resume Builder",
    description:
      "Generate an ATS-optimized resume and get an instant keyword match score.",
    href: "/resume",
    color: "246,80%,60%",
    badge: "ATS Scoring",
    stat: "94% match rate",
  },
  {
    icon: MessageSquare,
    title: "Cover Letter",
    description:
      "Craft personalized cover letters tailored to any role and company in seconds.",
    href: "/cover-letter",
    color: "173,80%,40%",
    badge: "Tailored",
    stat: "3× more responses",
  },
  {
    icon: Zap,
    title: "Interview Prep",
    description: "Get role-specific questions with expert STAR-method answers.",
    href: "/interview",
    color: "280,75%,60%",
    badge: "8 Questions",
    stat: "Confidence booster",
  },
  {
    icon: Compass,
    title: "Career Guidance",
    description: "Discover career paths, learning roadmaps, and skills.",
    href: "/career",
    color: "32,95%,50%",
    badge: "Personalized",
    stat: "AI-powered",
  },
];

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {loading ? "Loading…" : `Welcome back, ${firstName}! 👋`}
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Continue building your career journey 🚀
        </p>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border rounded-2xl p-5 flex flex-wrap gap-3 items-center justify-between shadow-sm">
        <p className="text-sm font-medium text-muted-foreground">
          Jump back in:
        </p>

        <div className="flex gap-3 flex-wrap">
          <Link
            href="/resume"
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
          >
            Build Resume
          </Link>
          <Link
            href="/interview"
            className="px-4 py-2 rounded-lg border text-sm font-semibold hover:bg-slate-50"
          >
            Practice Interview
          </Link>
          <Link
            href="/career"
            className="px-4 py-2 rounded-lg border text-sm font-semibold hover:bg-slate-50"
          >
            Explore Careers
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-8 border-b pb-6">
        {[
          { icon: TrendingUp, label: "Resumes Built", value: "50K+" },
          { icon: Users, label: "Careers Guided", value: "12K+" },
          { icon: Star, label: "Success Rate", value: "89%" },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
              <Icon className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Cards */}
      <div>
        <p className="text-xs font-bold text-muted-foreground uppercase mb-6">
          AI Tools
        </p>

        <div className="grid md:grid-cols-2 gap-5">
          {FEATURES.map(
            ({ icon: Icon, title, description, href, color, badge, stat }) => (
              <Link
                key={title}
                href={href}
                className="group bg-white rounded-2xl p-6 border hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] transition-all"
              >
                <div className="flex justify-between mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: `hsl(${color} / 0.1)` }}
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{ color: `hsl(${color})` }}
                    />
                  </div>

                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      background: `hsl(${color} / 0.1)`,
                      color: `hsl(${color})`,
                    }}
                  >
                    {badge}
                  </span>
                </div>

                <h3 className="font-bold mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {description}
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{stat}</span>
                  <span className="flex items-center gap-1 text-sm font-semibold">
                    Get Started <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ),
          )}
        </div>
      </div>

      {/* Tip */}
      <div className="p-5 rounded-2xl border bg-indigo-50">
        <p className="text-sm font-bold text-indigo-900 mb-1">💡 Pro Tip</p>
        <p className="text-sm text-indigo-700">
          Start with <strong>Resume Builder</strong> and paste a job description
          to improve ATS score instantly.
        </p>
      </div>
    </div>
  );
}
