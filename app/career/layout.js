// app/career/layout.js
import Sidebar from "@/components/Sidebar";
export default function CareerLayout({ children }) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
