import { cn, formatToNaira } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  change?: number | string;
  icon: LucideIcon;
  iconBg: string;
}

export default function StatCard({
  title,
  value,
  change,
  icon: Icon,
  iconBg,
}: StatCardProps) {
  const hasChange = change !== undefined && change !== null && change !== "";
  const numericChange = Number(change);
  const isValidChange = hasChange && !Number.isNaN(numericChange);
  const isPositive = isValidChange && numericChange >= 0;

  return (
    <div className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm text-neutral-500 font-medium">{title}</p>
          <p className="text-2xl md:text-3xl font-inter font-bold tracking-tight text-black">
            {title === "Total Revenue" ? formatToNaira(value) : value}
          </p>
          {isValidChange && (
            <p
              className={cn(
                "text-xs font-medium",
                isPositive ? "text-emerald-600" : "text-red-500",
              )}
            >
              {isPositive ? "+" : "-"}
              {Math.abs(numericChange)}% vs last month
            </p>
          )}
        </div>
        <div
          className={cn(
            "w-11 h-11 rounded-xl flex items-center justify-center",
            iconBg || "bg-primary/10",
          )}
        >
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
    </div>
  );
}
