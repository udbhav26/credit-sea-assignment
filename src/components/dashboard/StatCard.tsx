
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  className?: string;
}

export const StatCard = ({ icon, title, value, subtitle, className }: StatCardProps) => {
  return (
    <div className={cn("bg-white rounded-md shadow-sm flex overflow-hidden", className)}>
      <div className="bg-app-green p-4 flex items-center justify-center text-white">
        {icon}
      </div>
      <div className="p-4 flex-1">
        <div className="font-bold text-2xl">{value}</div>
        <div className="text-gray-600 uppercase text-xs font-semibold">{title}</div>
        {subtitle && <div className="text-gray-500 text-xs mt-1">{subtitle}</div>}
      </div>
    </div>
  );
};
