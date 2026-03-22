// lib/utils.js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
  } else {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.cssText = "position:absolute;opacity:0;";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  }
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatScore(score) {
  if (score >= 80) return { label: "Excellent", color: "text-emerald-600", bg: "bg-emerald-50", bar: "bg-emerald-500" };
  if (score >= 60) return { label: "Good", color: "text-amber-600", bg: "bg-amber-50", bar: "bg-amber-500" };
  if (score >= 40) return { label: "Fair", color: "text-orange-600", bg: "bg-orange-50", bar: "bg-orange-500" };
  return { label: "Needs Work", color: "text-red-600", bg: "bg-red-50", bar: "bg-red-500" };
}

export function apiResponse(data, status = 200) {
  return Response.json(data, { status });
}

export function apiError(message, status = 400) {
  return Response.json({ error: message }, { status });
}
