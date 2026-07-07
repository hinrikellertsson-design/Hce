"use client";

import type { ComponentTaskInstance } from "@/lib/sceneView";
import { ProgressPill } from "./ProgressPill";

export function ComponentChecklist({
  instance,
  onToggleItem,
}: {
  instance: ComponentTaskInstance;
  onToggleItem: (componentItemId: string, completed: boolean) => void;
}) {
  const completed = instance.items.filter((i) => i.completion?.completed).length;
  const total = instance.items.length;

  return (
    <li className="px-4 py-3 bg-surface-muted/60">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div>
          <p className="text-[13px] font-medium text-ink">{instance.task.label}</p>
          {instance.task.note && <p className="text-[12px] text-ink-muted mt-0.5">{instance.task.note}</p>}
        </div>
        <ProgressPill completed={completed} total={total} />
      </div>
      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-1.5">
        {instance.items.map(({ item, completion }) => {
          const done = completion?.completed ?? false;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onToggleItem(item.id, !done)}
                className="flex items-center gap-2 text-left w-full group"
              >
                <span
                  className={`h-3.5 w-3.5 shrink-0 rounded-[3px] border flex items-center justify-center transition-colors ${
                    done ? "bg-success border-success" : "border-ink-muted/50 group-hover:border-accent"
                  }`}
                >
                  {done && (
                    <svg viewBox="0 0 16 16" fill="none" className="h-2.5 w-2.5">
                      <path
                        d="M3 8.5L6.2 11.5L13 4.5"
                        stroke="var(--accent-ink)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
                <span className={`text-[12px] leading-snug ${done ? "line-through text-ink-muted" : "text-ink"}`}>
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </li>
  );
}
