// app/page.js
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default function RootPage() {
  const user = getCurrentUser();
  if (user) redirect("/dashboard");
  redirect("/login");
}
