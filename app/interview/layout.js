// app/interview/layout.js
import Sidebar from "@/components/Sidebar";
export default function InterviewLayout({ children }) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
