import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface RiskChartProps {
  type: "time" | "distribution";
}

const timeData = [
  { time: '00:00', 음주: 12, 졸음: 28, 과속: 8, 난폭운전: 5 },
  { time: '04:00', 음주: 8, 졸음: 35, 과속: 5, 난폭운전: 3 },
  { time: '08:00', 음주: 3, 졸음: 15, 과속: 18, 난폭운전: 12 },
  { time: '12:00', 음주: 2, 졸음: 8, 과속: 22, 난폭운전: 15 },
  { time: '16:00', 음주: 4, 졸음: 12, 과속: 25, 난폭운전: 18 },
  { time: '20:00', 음주: 15, 졸음: 18, 과속: 20, 난폭운전: 10 },
];

const distributionData = [
  { name: '음주', value: 44, color: '#ef4444' },
  { name: '졸음', value: 116, color: '#f97316' },
  { name: '과속', value: 98, color: '#eab308' },
  { name: '난폭운전', value: 63, color: '#dc2626' },
];

export function RiskChart({ type }: RiskChartProps) {
  if (type === "time") {
    return (
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">시간대별 위험운전 발생 추이</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={timeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="음주" fill="#ef4444" />
            <Bar dataKey="졸음" fill="#f97316" />
            <Bar dataKey="과속" fill="#eab308" />
            <Bar dataKey="난폭운전" fill="#dc2626" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">위험 유형별 분포</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={distributionData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {distributionData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {distributionData.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
              <span className="text-sm text-gray-600">{item.name}</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">{item.value}건</span>
          </div>
        ))}
      </div>
    </div>
  );
}
