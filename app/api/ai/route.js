// app/api/ai/route.js
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getCurrentUser } from "@/lib/auth";

// ✅ Groq — Free, OpenAI-compatible API
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(request) {
  try {
    const user = getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }

    const { feature, data } = await request.json();
    if (!feature || !data) {
      return NextResponse.json(
        { error: "Feature and data are required." },
        { status: 400 },
      );
    }

    let systemPrompt = "";
    let userPrompt = "";

    switch (feature) {
      case "resume": {
        systemPrompt =
          "You are an expert resume writer and ATS specialist with 15 years of hiring experience. You respond ONLY in valid JSON with no markdown, no code blocks, no extra text.";
        userPrompt = `Create an ATS-optimized professional resume and analysis.

CANDIDATE:
Name: ${data.name}
Skills: ${data.skills}
Experience: ${data.experience}
Education: ${data.education}
Target Job Description: ${data.jobDescription || "Not provided"}

Respond ONLY with this JSON (no markdown, no code blocks):
{
  "resume": "Full formatted resume text with proper sections",
  "atsScore": 85,
  "matchedKeywords": ["kw1","kw2","kw3","kw4","kw5"],
  "missedKeywords": ["kw1","kw2","kw3"],
  "suggestions": ["suggestion1","suggestion2","suggestion3","suggestion4","suggestion5"],
  "summary": "Two-sentence overall assessment"
}`;
        break;
      }

      case "coverLetter": {
        systemPrompt =
          "You are an expert career coach specializing in compelling cover letters. You respond ONLY in valid JSON with no markdown, no code blocks, no extra text.";
        userPrompt = `Write a tailored professional cover letter.

Role: ${data.jobRole}
Company: ${data.company}
Candidate Background: ${data.background}
Tone: ${data.tone || "professional"}

Respond ONLY with this JSON (no markdown, no code blocks):
{
  "coverLetter": "Complete cover letter 3-4 paragraphs ~320 words no placeholder brackets",
  "tips": ["tip1","tip2","tip3"]
}`;
        break;
      }

      case "interview": {
        systemPrompt =
          "You are a senior interview coach and hiring manager. You respond ONLY in valid JSON with no markdown, no code blocks, no extra text.";
        userPrompt = `Generate interview preparation material for the role below.

Job Role: ${data.jobRole}
Level: ${data.level || "Mid Level"}
Focus: ${data.focus || "Mixed"}

Respond ONLY with this JSON (no markdown, no code blocks):
{
  "questions": [
    {
      "id": 1,
      "category": "Behavioral",
      "question": "Question text",
      "answer": "Detailed STAR-method sample answer ~200 words",
      "tip": "Brief interviewer insight"
    }
  ]
}
Generate exactly 8 questions: 3 behavioral, 3 technical, 2 situational.`;
        break;
      }

      case "career": {
        systemPrompt =
          "You are a world-class career strategist. You respond ONLY in valid JSON with no markdown, no code blocks, no extra text.";
        userPrompt = `Provide personalized career guidance.

Current Skills: ${data.skills}
Interests: ${data.interests}
Current Role: ${data.currentRole || "Not specified"}
Experience: ${data.experience || "Not specified"}

Respond ONLY with this JSON (no markdown, no code blocks):
{
  "careerPaths": [
    {
      "title": "Career title",
      "match": 85,
      "description": "Two-sentence description",
      "avgSalary": "Salary range",
      "growthOutlook": "Growth descriptor",
      "timeToTransition": "Estimated transition time"
    }
  ],
  "roadmap": [
    {
      "phase": 1,
      "title": "Phase title",
      "duration": "Duration",
      "actions": ["action1","action2","action3"]
    }
  ],
  "skillsToLearn": [
    {
      "skill": "Skill name",
      "priority": "High",
      "resources": ["resource1","resource2"],
      "timeToLearn": "Est. time"
    }
  ],
  "insights": "2-3 sentences of personalized insight"
}
Provide 3 career paths, 4 roadmap phases, 5 skills.`;
        break;
      }

      default:
        return NextResponse.json(
          { error: "Unknown feature type." },
          { status: 400 },
        );
    }

    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2500,
    });

    const responseText = completion.choices[0].message.content;

    // Robust JSON parsing — handles markdown code blocks
    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      const jsonMatch =
        responseText.match(/```json\s*([\s\S]*?)\s*```/) ||
        responseText.match(/```\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[1]);
        } catch {
          return NextResponse.json(
            { error: "AI returned invalid JSON. Try again." },
            { status: 500 },
          );
        }
      } else {
        const objectMatch = responseText.match(/\{[\s\S]*\}/);
        if (objectMatch) {
          try {
            parsed = JSON.parse(objectMatch[0]);
          } catch {
            return NextResponse.json(
              { error: "Could not parse AI response. Try again." },
              { status: 500 },
            );
          }
        } else {
          return NextResponse.json(
            { error: "AI response was not in expected format. Try again." },
            { status: 500 },
          );
        }
      }
    }

    return NextResponse.json({ success: true, data: parsed });
  } catch (error) {
    console.error("AI route error:", error);
    if (error?.status === 401)
      return NextResponse.json(
        { error: "Invalid Groq API key. Check GROQ_API_KEY in .env" },
        { status: 500 },
      );
    if (error?.status === 429)
      return NextResponse.json(
        { error: "Rate limit reached. Please wait a moment." },
        { status: 429 },
      );
    if (error instanceof SyntaxError)
      return NextResponse.json(
        { error: "Failed to parse AI response. Try again." },
        { status: 500 },
      );
    return NextResponse.json(
      { error: error.message || "Unexpected server error." },
      { status: 500 },
    );
  }
}
