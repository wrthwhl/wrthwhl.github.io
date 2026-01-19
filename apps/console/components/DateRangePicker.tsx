'use client';

type DateRange = {
  from?: string;
  to?: string;
};

type Preset = {
  label: string;
  days: number;
};

const presets: Preset[] = [
  { label: '7 days', days: 7 },
  { label: '30 days', days: 30 },
  { label: '90 days', days: 90 },
];

type DateRangePickerProps = {
  value: DateRange;
  onChange: (range: DateRange) => void;
};

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const handlePresetClick = (days: number) => {
    const to = new Date();
    const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000);
    onChange({
      from: from.toISOString(),
      to: to.toISOString(),
    });
  };

  // Determine which preset is active (approximate match)
  const getActiveDays = (): number | null => {
    if (!value.from || !value.to) return 7; // default
    const diff = new Date(value.to).getTime() - new Date(value.from).getTime();
    const days = Math.round(diff / (24 * 60 * 60 * 1000));
    const preset = presets.find((p) => Math.abs(p.days - days) <= 1);
    return preset?.days ?? null;
  };

  const activeDays = getActiveDays();

  return (
    <div className="flex gap-2">
      {presets.map((preset) => (
        <button
          key={preset.days}
          onClick={() => handlePresetClick(preset.days)}
          className={`px-3 py-1.5 text-sm rounded-[var(--radius-phi)] transition-colors ${
            activeDays === preset.days
              ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
              : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]'
          }`}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}
