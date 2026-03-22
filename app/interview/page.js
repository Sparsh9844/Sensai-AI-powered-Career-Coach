"use client";

import { useState } from "react";
import { Zap, Sparkles, AlertCircle, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ResultSkeleton } from "@/components/LoadingSkeleton";
import PageHeader from "@/components/PageHeader";
import { useAI } from "@/hooks/useAI";
import { toast } from "@/hooks/use-toast";
import { copyToClipboard } from "@/lib/utils";

const LEVELS = ["Entry Level", "Mid Level", "Senior", "Lead / Manager"];
const FOCUSES = ["Technical", "Behavioral", "System Design", "Leadership", "Mixed"];

const CAT_COLORS = {
  Behavioral: "246,80%,60%",
  Technical: "173,80%,40%",
  "Technical/Role-specific": "173,80%,40%",
  Situational: "280,75%,60%",
  "Role-specific": "32,95%,50%",
};

export default function InterviewPage() {
  const [form, setForm] = useState({ jobRole: "", level: "Mid Level", focus: "Mixed" });
  const [copiedId, setCopiedId] = useState(null);
  const { generate, loading, error, result } = useAI();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.jobRole.trim()) {
      toast({ title: "Missing job role", description: "Please enter the role you're preparing for.", variant: "destructive" });
      return;
    }
    try {
      await generate("interview", form);
      toast({ title: "✅ Questions ready!", description: `Prep session for ${form.jobRole} generated.` });
    } catch {
      toast({ title: "Generation failed", description: error || "Please try again.", variant: "destructive" });
    }
  };

  const handleCopy = async (q, id) => {
    await copyToClipboard(`Q: ${q.question}\n\nA: ${q.answer}`);
    setCopiedId(id);
    toast({ title: "Question & answer copied!" });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/20">
      <PageHeader icon={Zap} title="Interview Preparation" description="Get role-specific questions with expert STAR-method sample answers." color="280,75%,60%" />

      <div className="p-8 max-w-4xl space-y-8">
        <Card>
          <CardHeader><CardTitle>Configure Prep Session</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="jobRole">Job Role *</Label>
                <Input id="jobRole" name="jobRole" placeholder="e.g. Senior Software Engineer, Product Manager, Data Scientist..."
                  value={form.jobRole} onChange={(e) => setForm((p) => ({ ...p, jobRole: e.target.value }))} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label>Experience Level</Label>
                  <div className="flex flex-wrap gap-2">
                    {LEVELS.map((l) => (
                      <button key={l} type="button" onClick={() => setForm((p) => ({ ...p, level: l }))}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
                        style={{
                          background: form.level === l ? "hsl(280 75% 60% / 0.1)" : "transparent",
                          borderColor: form.level === l ? "hsl(280 75% 60%)" : "hsl(var(--border))",
                          color: form.level === l ? "hsl(280 75% 50%)" : "hsl(var(--muted-foreground))",
                        }}>{l}</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Focus Area</Label>
                  <div className="flex flex-wrap gap-2">
                    {FOCUSES.map((f) => (
                      <button key={f} type="button" onClick={() => setForm((p) => ({ ...p, focus: f }))}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
                        style={{
                          background: form.focus === f ? "hsl(280 75% 60% / 0.1)" : "transparent",
                          borderColor: form.focus === f ? "hsl(280 75% 60%)" : "hsl(var(--border))",
                          color: form.focus === f ? "hsl(280 75% 50%)" : "hsl(var(--muted-foreground))",
                        }}>{f}</button>
                    ))}
                  </div>
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full h-11 text-white border-0 shadow-md hover:opacity-90"
                style={{ background: "linear-gradient(135deg, hsl(280 75% 58%), hsl(246 80% 60%))" }}>
                {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating questions...</> : <><Sparkles className="w-4 h-4" /> Generate Interview Questions</>}
              </Button>
            </form>
          </CardContent>
        </Card>

        {loading && <div className="space-y-3">{[...Array(3)].map((_, i) => <ResultSkeleton key={i} />)}</div>}

        {error && !loading && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div><p className="font-semibold text-sm">Generation Failed</p><p className="text-sm opacity-80 mt-0.5">{error}</p></div>
          </div>
        )}

        {result?.questions?.length > 0 && !loading && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">{result.questions.length} Interview Questions</h2>
              <div className="flex gap-2">
                <Badge style={{ background: "hsl(280 75% 60% / 0.1)", color: "hsl(280 75% 50%)", border: "none" }}>{form.jobRole}</Badge>
                <Badge variant="outline">{form.level}</Badge>
              </div>
            </div>
            <Accordion type="single" collapsible className="space-y-3">
              {result.questions.map((q, i) => {
                const color = CAT_COLORS[q.category] || "215,16%,47%";
                return (
                  <Card key={i} className="overflow-hidden">
                    <AccordionItem value={`q-${i}`} className="border-0">
                      <AccordionTrigger className="px-5 py-4 hover:no-underline">
                        <div className="flex items-start gap-3 text-left flex-1 pr-4">
                          <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                            style={{ background: `hsl(${color} / 0.12)`, color: `hsl(${color})` }}>{i + 1}</span>
                          <div className="space-y-1.5 flex-1">
                            <p className="font-semibold text-sm text-foreground leading-relaxed">{q.question}</p>
                            <span className="inline-block text-xs px-2 py-0.5 rounded-full"
                              style={{ background: `hsl(${color} / 0.08)`, color: `hsl(${color})` }}>{q.category}</span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-5 pb-5">
                        <div className="ml-9 space-y-3">
                          <div className="p-4 rounded-xl bg-muted/40 border border-border">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">✦ Sample Answer</p>
                            <p className="text-sm text-foreground/80 leading-relaxed">{q.answer}</p>
                          </div>
                          {q.tip && (
                            <div className="p-3 rounded-xl border flex items-start gap-2"
                              style={{ background: `hsl(${color} / 0.05)`, borderColor: `hsl(${color} / 0.2)` }}>
                              <span className="text-sm">💡</span>
                              <p className="text-xs leading-relaxed" style={{ color: `hsl(${color})` }}>
                                <strong>Interviewer tip:</strong> {q.tip}
                              </p>
                            </div>
                          )}
                          <Button variant="outline" size="sm" onClick={() => handleCopy(q, i)}>
                            {copiedId === i ? <><Check className="w-3.5 h-3.5 text-emerald-500" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy Q&amp;A</>}
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Card>
                );
              })}
            </Accordion>
          </div>
        )}

        {!result && !loading && !error && (
          <div className="flex flex-col items-center justify-center h-52 rounded-2xl border-2 border-dashed border-border text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mb-3"><Zap className="w-6 h-6 text-purple-400" /></div>
            <p className="text-sm font-semibold text-muted-foreground">Enter a job role to get started</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Questions will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
