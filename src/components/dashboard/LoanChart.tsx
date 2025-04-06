
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

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="p-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'area' ? (
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id={`color${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
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
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="month" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Bar dataKey="value" fill={barColor || color} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
