import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  className?: string;
}

export function StatCard({ icon, label, value, className = "" }: StatCardProps) {
  return (
    <div className={`bg-[#0a0a0a] border border-white/5 rounded-xl p-4 flex flex-col justify-between ${className}`}>
      <div className="flex items-start justify-between mb-3 pb-2 border-b border-white/5">
        <div className="text-white/50">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold text-white tracking-tight leading-none mb-1.5">{value}</div>
        <div className="text-xs text-gray-500 font-medium">{label}</div>
      </div>
    </div>
  );
}
