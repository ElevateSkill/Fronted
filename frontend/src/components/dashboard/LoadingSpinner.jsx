export default function LoadingSpinner({ size = 24, text }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div
        className="rounded-full border-2 border-brand-primary/30 border-t-brand-primary animate-spin"
        style={{ width: size, height: size }}
      />
      {text && <p className="text-sm text-brand-muted">{text}</p>}
    </div>
  );
}
