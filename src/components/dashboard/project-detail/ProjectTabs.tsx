"use client";

import { useState, type ReactNode } from "react";

export interface TabDefinition {
    key: string;
    label: string;
    panel: ReactNode;
    visible?: boolean;
}

export default function ProjectTabs({ tabs }: { tabs: TabDefinition[] }) {
    const visible = tabs.filter((t) => t.visible !== false);
    const [active, setActive] = useState(visible[0]?.key);
    const current = visible.find((t) => t.key === active) ?? visible[0];

    return (
        <>
            <div role="tablist" className="mb-6 flex flex-wrap gap-2">
                {visible.map((tab) => {
                    const isActive = tab.key === current?.key;
                    return (
                        <button
                            key={tab.key}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => setActive(tab.key)}
                            className={`rounded-md px-4 py-2 transition-colors ${
                                isActive
                                    ? "border border-primary/20 bg-primary/10 text-primary"
                                    : "border border-transparent text-foreground/70 hover:bg-accent"
                            }`}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <div role="tabpanel" className="rounded-lg border border-border bg-card p-6">
                {current?.panel}
            </div>
        </>
    );
}
