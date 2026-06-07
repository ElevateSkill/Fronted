export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="rounded-2xl border border-brand-border bg-brand-card p-12 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary/10 mb-4">
        {Icon && <Icon size={32} className="text-brand-primary/60" />}
      </div>
      <h3 className="text-lg font-bold text-brand-text mb-1">{title || 'No data yet'}</h3>
      <p className="text-sm text-brand-muted/60 mb-4 max-w-sm mx-auto">{description}</p>
      {action}
    </div>
  );
}
