export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center px-6">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-[hsl(var(--secondary))] flex items-center justify-center">
          <Icon className="w-8 h-8 text-[hsl(var(--muted-foreground))]" />
        </div>
      )}
      <div className="space-y-1">
        <h3 className="font-semibold text-[hsl(var(--foreground))]">{title}</h3>
        {description && (
          <p className="text-sm text-[hsl(var(--muted-foreground))] max-w-xs">{description}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
