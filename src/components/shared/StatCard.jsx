export default function StatCard({ icon: Icon, label, value, color = 'text-[hsl(var(--primary))]' }) {
  return (
    <div className="bg-[hsl(var(--card))] rounded-2xl p-4 shadow-sm border border-[hsl(var(--border))] flex flex-col gap-2">
      {Icon && <Icon className={`w-5 h-5 ${color}`} />}
      <p className="text-2xl font-bold text-[hsl(var(--foreground))]">{value}</p>
      <p className="text-xs text-[hsl(var(--muted-foreground))]">{label}</p>
    </div>
  );
}
