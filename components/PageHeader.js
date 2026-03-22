// components/PageHeader.js
export default function PageHeader({ icon: Icon, title, description, color = "246,80%,60%" }) {
  return (
    <div className="px-8 pt-10 pb-8 border-b border-border bg-white">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: `hsl(${color} / 0.1)` }}>
          <Icon className="w-5.5 h-5.5" style={{ color: `hsl(${color})` }} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">{title}</h1>
          <p className="text-muted-foreground text-sm mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
}
