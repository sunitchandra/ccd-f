import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ExamAttempt } from '../types';
import './PerformanceChart.css';

interface PerformanceChartProps {
  attempts: ExamAttempt[];
}

export default function PerformanceChart({ attempts }: PerformanceChartProps) {
  const data = attempts.map((attempt, index) => ({
    attempt: index + 1,
    percentage: attempt.percentage,
  }));

  const passingLine = 72;

  return (
    <div className="performance-chart">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="attempt" label={{ value: 'Attempt', position: 'insideBottomRight', offset: -5 }} />
          <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} domain={[0, 100]} />
          <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />

          <Line
            type="monotone"
            dataKey="percentage"
            stroke="#0066cc"
            dot={{ fill: '#0066cc', r: 5 }}
            activeDot={{ r: 7 }}
            strokeWidth={2}
            name="Your Score"
          />

          <Line
            type="linear"
            dataKey={() => passingLine}
            stroke="#dc3545"
            strokeDasharray="5 5"
            dot={false}
            name="Passing Line (72%)"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
