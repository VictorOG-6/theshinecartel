import { cn, formatToNaira } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface UserStatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  iconBg: string;
}

export default function UserStatCard({
  title,
  value,
  icon: Icon,
  iconBg,
}: UserStatCardProps) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <p className="text-sm text-tertiary font-medium">{title}</p>
          <p className="text-2xl md:text-3xl font-heading font-bold tracking-tight text-black">
            {title === "Total Spent" ? formatToNaira(value) : value}
          </p>
        </div>
        <div
          className={cn(
            "w-11 h-11 rounded-xl hidden md:flex items-center justify-center",
            iconBg || "bg-primary/10",
          )}
        >
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
    </div>
  );
}
