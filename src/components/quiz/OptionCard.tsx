import type { ReactNode } from "react";

interface OptionCardProps {
  icon: ReactNode;
  label: string;
  selected?: boolean;
  onClick: () => void;
}

export function OptionCard({ icon, label, selected, onClick }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group flex w-full items-center gap-4 rounded-2xl border-2 bg-card p-4 text-left transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-card",
        selected
          ? "border-primary shadow-card"
          : "border-border hover:border-primary/50",
      ].join(" ")}
    >
      <div
        className={[
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl transition-colors",
          selected ? "bg-primary text-primary-foreground" : "bg-secondary text-primary",
        ].join(" ")}
      >
        {icon}
      </div>
      <span className="min-w-0 flex-1 text-base font-semibold text-foreground sm:text-lg">
        {label}
      </span>
      <span
        className={[
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          selected ? "border-primary bg-primary" : "border-border",
        ].join(" ")}
      >
        {selected && (
          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 text-primary-foreground">
            <path d="M5 10l3 3 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
    </button>
  );
}
