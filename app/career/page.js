"use client";

import { useState } from "react";
import { Compass, Sparkles, AlertCircle, TrendingUp, BookOpen, Star, Clock, DollarSign, ArrowRight } from "lucide-react";
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

const PRI_STYLE = {
  High:   { bg: "bg-red-50",    text: "text-red-600",    border: "border-red-200" },
  Medium: { bg: "bg-amber-50",  text: "text-amber-600",  border: "border-amber-200" },
  Low:    { bg: "bg-emerald-50",text: "text-emerald-600",border: "border-emerald-200" },
};

export default function CareerPage() {
  const [form, setForm] = useState({ skills: "", interests: "", currentRole: "", experience: "" });
  const { generate, loading, error, result } = useAI();

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.skills.trim() || !form.interests.trim()) {
      toast({ title: "Missing fields", description: "Please enter your skills and interests.", variant: "destructive" });
      return;
    }
    try {
      await generate("career", form);
      toast({ title: "✅ Career paths mapped!", description: "Your personalized roadmap is ready." });
    } catch {
      toast({ title: "Generation failed", description: error || "Please try again.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/20">
      <PageHeader icon={Compass} title="Career Guidance" description="Discover ideal career paths and get a personalized learning roadmap." color="32,95%,50%" />

      <div className="p-8 max-w-6xl space-y-8">
        <Card>
          <CardHeader><CardTitle>Tell Us About Yourself</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="skills">Current Skills *</Label>
                  <Textarea id="skills" name="skills" placeholder="e.g. Python, Machine Learning, Data Analysis, SQL, Tableau..." className="h-28" value={form.skills} onChange={handleChange} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="interests">Interests & Passions *</Label>
                  <Textarea id="interests" name="interests" placeholder="e.g. AI research, building products, solving real-world problems, finance..." className="h-28" value={form.interests} onChange={handleChange} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="currentRole">Current Role <span className="text-xs font-normal text-muted-foreground">(optional)</span></Label>
                  <Input id="currentRole" name="currentRole" placeholder="e.g. Junior Developer" value={form.currentRole} onChange={handleChange} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="experience">Years of Experience <span className="text-xs font-normal text-muted-foreground">(optional)</span></Label>
                  <Input id="experience" name="experience" placeholder="e.g. 3" value={form.experience} onChange={handleChange} />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full h-11 text-white border-0 shadow-md hover:opacity-90"
                style={{ background: "linear-gradient(135deg, hsl(32 95% 50%), hsl(20 90% 55%))" }}>
                {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing your profile...</> : <><Sparkles className="w-4 h-4" /> Map My Career Paths</>}
              </Button>
            </form>
          </CardContent>
        </Card>

        {loading && <div className="grid grid-cols-1 md:grid-cols-3 gap-5">{[...Array(3)].map((_, i) => <ResultSkeleton key={i} />)}</div>}

        {error && !loading && (
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div><p className="font-semibold text-sm">Generation Failed</p><p className="text-sm opacity-80 mt-0.5">{error}</p></div>
          </div>
        )}

        {result && !loading && (
          <>
            {result.insights && (
              <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/60 flex items-start gap-3">
                <Star className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-amber-900 mb-0.5">Personal Insight</p>
                  <p className="text-sm text-amber-800 leading-relaxed">{result.insights}</p>
                </div>
              </div>
            )}

            {result.careerPaths?.length > 0 && (
              <div>
                <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-400" /> Recommended Career Paths
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {result.careerPaths.map((path, i) => (
                    <Card key={i} className="overflow-hidden card-hover">
                      <div className="h-1.5" style={{ background: `linear-gradient(90deg, hsl(${32 - i * 10} 95% ${50 + i * 3}%), hsl(${20 - i * 8} 90% ${55 + i * 2}%))` }} />
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-sm leading-snug">{path.title}</CardTitle>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 bg-orange-50 text-orange-600">{path.match}%</span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Progress value={path.match} indicatorClassName="bg-orange-400" />
                        <p className="text-xs text-muted-foreground leading-relaxed">{path.description}</p>
                        <div className="space-y-1.5 pt-1">
                          {path.avgSalary && <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><DollarSign className="w-3.5 h-3.5 text-emerald-500" /><span className="font-medium text-foreground/80">{path.avgSalary}</span></div>}
                          {path.growthOutlook && <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><TrendingUp className="w-3.5 h-3.5 text-blue-500" /><span className="font-medium text-foreground/80">{path.growthOutlook} growth</span></div>}
                          {path.timeToTransition && <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Clock className="w-3.5 h-3.5 text-orange-400" /><span className="font-medium text-foreground/80">{path.timeToTransition}</span></div>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {result.roadmap?.length > 0 && (
              <div>
                <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-500" /> Your Learning Roadmap
                </h2>
                <div className="relative">
                  <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-gradient-to-b from-indigo-300 to-orange-300 hidden md:block" />
                  <div className="space-y-4">
                    {result.roadmap.map((phase, i) => (
                      <div key={i} className="relative flex gap-6">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 z-10"
                          style={{ background: `linear-gradient(135deg, hsl(${246 - i * 20} 80% 60%), hsl(${32 + i * 10} 95% 55%))` }}>
                          {phase.phase}
                        </div>
                        <Card className="flex-1">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <h3 className="font-bold text-sm text-foreground">{phase.title}</h3>
                              {phase.duration && <Badge variant="outline" className="flex-shrink-0 text-xs"><Clock className="w-3 h-3 mr-1" />{phase.duration}</Badge>}
                            </div>
                            <ul className="space-y-1.5">
                              {phase.actions?.map((action, j) => (
                                <li key={j} className="flex items-start gap-2 text-xs text-muted-foreground">
                                  <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-indigo-400" />{action}
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {result.skillsToLearn?.length > 0 && (
              <div>
                <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" /> Skills to Develop
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {result.skillsToLearn.map((skill, i) => {
                    const style = PRI_STYLE[skill.priority] || PRI_STYLE.Medium;
                    return (
                      <Card key={i} className="card-hover">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-sm text-foreground">{skill.skill}</h3>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${style.bg} ${style.text} ${style.border}`}>{skill.priority}</span>
                          </div>
                          {skill.timeToLearn && <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Clock className="w-3 h-3" />{skill.timeToLearn}</div>}
                          {skill.resources?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {skill.resources.map((r, j) => (
                                <span key={j} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">{r}</span>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {!result && !loading && !error && (
          <div className="flex flex-col items-center justify-center h-52 rounded-2xl border-2 border-dashed border-border text-center">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-3"><Compass className="w-6 h-6 text-orange-400" /></div>
            <p className="text-sm font-semibold text-muted-foreground">Share your skills and interests to get started</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Your personalized roadmap will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
