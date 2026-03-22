"use client";

import { useState } from "react";
import {
  FileText, Sparkles, Copy, Check, AlertCircle,
  TrendingUp, TrendingDown, Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ResultSkeleton } from "@/components/LoadingSkeleton";
import PageHeader from "@/components/PageHeader";
import { useAI } from "@/hooks/useAI";
import { toast } from "@/hooks/use-toast";
import { copyToClipboard, formatScore } from "@/lib/utils";

export default function ResumePage() {
  const [form, setForm] = useState({ name: "", skills: "", experience: "", education: "", jobDescription: "" });
  const [copied, setCopied] = useState(false);
  const { generate, loading, error, result } = useAI();

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.skills || !form.experience) {
      toast({ title: "Missing fields", description: "Please fill in name, skills, and experience.", variant: "destructive" });
      return;
    }
    try {
      await generate("resume", form);
      toast({ title: "✅ Resume generated!", description: "Your ATS-optimized resume is ready." });
    } catch {
      toast({ title: "Generation failed", description: error || "Please try again.", variant: "destructive" });
    }
  };

  const handleCopy = async () => {
    if (!result?.resume) return;
    await copyToClipboard(result.resume);
    setCopied(true);
    toast({ title: "Copied to clipboard!" });
    setTimeout(() => setCopied(false), 2000);
  };

  const scoreInfo = result ? formatScore(result.atsScore) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20">
      <PageHeader icon={FileText} title="Resume Builder" description="Generate an ATS-optimized resume and get your keyword match score instantly." color="246,80%,60%" />

      <div className="p-8 grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-7xl">
        {/* Form */}
        <Card>
          <CardHeader><CardTitle>Your Information</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" name="name" placeholder="e.g. Priya Sharma" value={form.name} onChange={handleChange} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="skills">Skills *</Label>
                <Textarea id="skills" name="skills" placeholder="e.g. React, Node.js, Python, SQL, Docker, AWS..." className="h-24" value={form.skills} onChange={handleChange} />
                <p className="text-xs text-muted-foreground">Separate skills with commas</p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="experience">Work Experience *</Label>
                <Textarea id="experience" name="experience" placeholder="e.g. Software Engineer at TechCorp (2021–2023): Built scalable REST APIs serving 1M users, reduced latency by 40%..." className="h-32" value={form.experience} onChange={handleChange} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="education">Education</Label>
                <Textarea id="education" name="education" placeholder="e.g. B.Tech Computer Science, IIT Delhi (2017–2021), CGPA 8.9/10" className="h-20" value={form.education} onChange={handleChange} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="jobDescription">
                  Job Description
                  <span className="ml-2 text-xs font-normal text-indigo-500">(Paste for ATS scoring)</span>
                </Label>
                <Textarea id="jobDescription" name="jobDescription" placeholder="Paste the full job description here for accurate ATS scoring and keyword matching..." className="h-36" value={form.jobDescription} onChange={handleChange} />
              </div>
              <Button type="submit" disabled={loading} className="w-full h-11 gradient-bg text-white border-0 shadow-md shadow-indigo-200 hover:opacity-90">
                {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing & Building...</> : <><Sparkles className="w-4 h-4" /> Generate Resume + ATS Score</>}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-5">
          {loading && <ResultSkeleton />}

          {error && !loading && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div><p className="font-semibold text-sm">Generation Failed</p><p className="text-sm opacity-80 mt-0.5">{error}</p></div>
            </div>
          )}

          {result && !loading && (
            <>
              {/* ATS Score */}
              <Card className="overflow-hidden">
                <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, hsl(${result.atsScore >= 70 ? "142 71% 45%" : result.atsScore >= 40 ? "45 93% 47%" : "0 84% 60%"}), transparent)` }} />
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-base">
                    ATS Compatibility Score
                    <Badge variant={result.atsScore >= 70 ? "success" : result.atsScore >= 40 ? "warning" : "destructive"}>{scoreInfo?.label}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-black text-foreground">{result.atsScore}</span>
                    <span className="text-xl text-muted-foreground mb-1">/100</span>
                  </div>
                  <Progress value={result.atsScore} indicatorClassName={scoreInfo?.bar} />
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    {result.matchedKeywords?.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-emerald-600 flex items-center gap-1 mb-2"><TrendingUp className="w-3.5 h-3.5" /> Matched</p>
                        <div className="flex flex-wrap gap-1.5">
                          {result.matchedKeywords.map((k) => (
                            <span key={k} className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">{k}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {result.missedKeywords?.length > 0 && (
                      <div>
                        <p className="text-xs font-bold text-red-500 flex items-center gap-1 mb-2"><TrendingDown className="w-3.5 h-3.5" /> Missing</p>
                        <div className="flex flex-wrap gap-1.5">
                          {result.missedKeywords.map((k) => (
                            <span key={k} className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">{k}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Suggestions */}
              {result.suggestions?.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2"><Lightbulb className="w-4 h-4 text-amber-500" /> Improvement Suggestions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2.5">
                      {result.suggestions.map((s, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                          <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 bg-indigo-50 text-indigo-600">{i + 1}</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Resume Preview */}
              <Card>
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Generated Resume</CardTitle>
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    {copied ? <><Check className="w-3.5 h-3.5 text-emerald-500" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                  </Button>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap text-xs font-mono text-foreground/80 bg-muted/40 rounded-xl p-4 max-h-80 overflow-y-auto leading-relaxed border border-border">{result.resume}</pre>
                </CardContent>
              </Card>
            </>
          )}

          {!result && !loading && !error && (
            <div className="flex flex-col items-center justify-center h-64 rounded-2xl border-2 border-dashed border-border text-center">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-3"><FileText className="w-6 h-6 text-indigo-400" /></div>
              <p className="text-sm font-semibold text-muted-foreground">Your AI-powered resume will appear here</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Fill in the form and click generate</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
