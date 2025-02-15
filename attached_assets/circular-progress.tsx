import * as React from "react";

interface CircularProgressProps {
  current: number;
  total: number;
}

export function CircularProgress({ current, total }: CircularProgressProps) {
  const percentage = Math.round((current / total) * 100);
  const radius = 120;
  const strokeWidth = 7;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center cursor-pointer">
      <div className="relative w-[240px] h-[240px] mt-[-150px] md:mt-0">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            stroke="gray"
            // fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress circle */}
          <circle
          
            stroke="hsl(var(--primary))"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="transition-all duration-300 ease-in-out opacity-80"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className="text-3xl font-bold text-primary">{current}</span>
            <span className="text-3xl text-muted-foreground"> / {total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}