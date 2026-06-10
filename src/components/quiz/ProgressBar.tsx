interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (current / total) * 100));
  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span>Etapa {Math.min(current, total)} de {total}</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-gradient-brand transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
