import { cn } from "@/lib/utils";

interface CircularProgressProps {
  current: number;
  total: number;
}

export function CircularProgress({ current, total }: CircularProgressProps) {
  const progress = (current / total) * 100;
  const strokeWidth = 15;
  const size = 200;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-muted"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-primary transition-all duration-300 ease-in-out"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className={cn(
          "text-4xl font-bold",
          current === total && "text-primary"
        )}>
          {current}
        </span>
        <span className="text-lg text-muted-foreground">/ {total}</span>
      </div>
    </div>
  );
}
