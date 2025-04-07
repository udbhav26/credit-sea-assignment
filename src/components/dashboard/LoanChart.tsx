
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useEffect, useState } from 'react';

interface ChartProps {
  title: string;
  data: number[];
  color: string;
  type: 'area' | 'bar';
  barColor?: string;
}

export const LoanChart = ({ title, data, color, type, barColor }: ChartProps) => {
  // Create data for the chart
  const chartData = data.map((value, index) => ({
    month: index + 1,
    value,
  }));

  const [chartHeight, setChartHeight] = useState(240);

  // Adjust chart height based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setChartHeight(180);
      } else {
        setChartHeight(240);
      }
    };

    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <div className="p-3 sm:p-4 border-b border-gray-200">
        <h2 className="text-base sm:text-lg font-semibold">{title}</h2>
      </div>
      <div className={`p-2 sm:p-4 h-[${chartHeight}px]`} style={{ height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          {type === 'area' ? (
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id={`color${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip contentStyle={{ fontSize: '12px' }} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                fillOpacity={1}
                fill={`url(#color${color.replace('#', '')})`}
              />
            </AreaChart>
          ) : (
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip contentStyle={{ fontSize: '12px' }} />
              <Bar dataKey="value" fill={barColor || color} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
