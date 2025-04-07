
import { cn } from '@/lib/utils';

interface RecoveryRateCardProps {
  title: string;
  rate: number;
  description: string;
  className?: string;
  textColor?: string;
}

export const RecoveryRateCard = ({ 
  title, 
  rate, 
  description, 
  className = "bg-orange-500", 
  textColor = "text-white" 
}: RecoveryRateCardProps) => {
  return (
    <div className={cn("rounded-md shadow-sm overflow-hidden", className)}>
      <div className={cn("p-3 sm:p-4", textColor)}>
        <h2 className="text-base sm:text-lg font-semibold">{title}</h2>
        <p className="text-xs sm:text-sm mt-1 opacity-80">{description}</p>
        <div className="flex items-center justify-center mt-3 sm:mt-4">
          <div className="text-3xl sm:text-5xl font-bold">{rate}%</div>
        </div>
      </div>
    </div>
  );
};
