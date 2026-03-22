"use client";

import { useState } from "react";
import { MessageSquare, Sparkles, Copy, Check, AlertCircle, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResultSkeleton } from "@/components/LoadingSkeleton";
import PageHeader from "@/components/PageHeader";
import { useAI } from "@/hooks/useAI";
import { toast } from "@/hooks/use-toast";
import { copyToClipboard } from "@/lib/utils";

const TONES = ["Professional", "Enthusiastic", "Concise", "Creative"];

export default function CoverLetterPage() {
  const [form, setForm] = useState({ jobRole: "", company: "", background: "", tone: "Professional" });
  const [copied, setCopied] = useState(false);
  const { generate, loading, error, result } = useAI();

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.jobRole || !form.company || !form.background) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    try {
      await generate("coverLetter", form);
      toast({ title: "✅ Cover letter ready!" });
    } catch {
      toast({ title: "Generation failed", description: error || "Please try again.", variant: "destructive" });
    }
  };

  const handleCopy = async () => {
    if (!result?.coverLetter) return;
    await copyToClipboard(result.coverLetter);
    setCopied(true);
    toast({ title: "Copied to clipboard!" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/20">
      <PageHeader icon={MessageSquare} title="Cover Letter Generator" description="Craft a compelling, tailored cover letter in seconds." color="173,80%,40%" />

      <div className="p-8 grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-7xl">
        <Card>
          <CardHeader><CardTitle>Cover Letter Details</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="jobRole">Job Role *</Label>
                  <Input id="jobRole" name="jobRole" placeholder="e.g. Frontend Engineer" value={form.jobRole} onChange={handleChange} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="company">Company *</Label>
                  <Input id="company" name="company" placeholder="e.g. Google" value={form.company} onChange={handleChange} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="background">Your Background *</Label>
                <Textarea id="background" name="background" placeholder="Describe your experience, key achievements, and why you're excited about this role..." className="h-40" value={form.background} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>Tone</Label>
                <div className="flex flex-wrap gap-2">
                  {TONES.map((t) => (
                    <button key={t} type="button" onClick={() => setForm((p) => ({ ...p, tone: t }))}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium border transition-all"
                      style={{
                        background: form.tone === t ? "hsl(173 80% 40% / 0.1)" : "transparent",
                        borderColor: form.tone === t ? "hsl(173 80% 40%)" : "hsl(var(--border))",
                        color: form.tone === t ? "hsl(173 80% 35%)" : "hsl(var(--muted-foreground))",
                      }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full h-11 text-white border-0 shadow-md hover:opacity-90"
                style={{ background: "linear-gradient(135deg, hsl(173 80% 40%), hsl(200 90% 45%))" }}>
                {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Writing your letter...</> : <><Sparkles className="w-4 h-4" /> Generate Cover Letter</>}
              </Button>
            </form>
          </CardContent>
        </Card>

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
              <Card>
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Your Cover Letter</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">{form.jobRole} @ {form.company} · {form.tone}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    {copied ? <><Check className="w-3.5 h-3.5 text-emerald-500" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/30 rounded-xl p-5 border border-border text-sm text-foreground/80 leading-7 whitespace-pre-wrap">
                    {result.coverLetter}
                  </div>
                </CardContent>
              </Card>
              {result.tips?.length > 0 && (
                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><Lightbulb className="w-4 h-4 text-amber-500" /> Pro Tips</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-amber-500 mt-0.5">✦</span>{tip}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </>
          )}
          {!result && !loading && !error && (
            <div className="flex flex-col items-center justify-center h-64 rounded-2xl border-2 border-dashed border-border text-center">
              <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center mb-3"><MessageSquare className="w-6 h-6 text-teal-400" /></div>
              <p className="text-sm font-semibold text-muted-foreground">Your cover letter will appear here</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Fill in the details and click generate</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
