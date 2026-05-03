const UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
    ["second", 1],
];

const FORMATTER = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

export function relativeTime(iso: string, now: number = Date.now()): string {
    const t = new Date(iso).getTime();
    if (Number.isNaN(t)) return "";
    const diffSeconds = (t - now) / 1000;
    const abs = Math.abs(diffSeconds);
    for (const [unit, secondsInUnit] of UNITS) {
        if (abs >= secondsInUnit || unit === "second") {
            return FORMATTER.format(Math.round(diffSeconds / secondsInUnit), unit);
        }
    }
    return FORMATTER.format(0, "second");
}
