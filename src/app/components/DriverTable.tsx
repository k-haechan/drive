import { AlertTriangle, Eye } from "lucide-react";

export interface Driver {
  id: string;
  name: string;
  status: "정상" | "주의" | "위험" | "위급";
  riskType: "정상" | "음주" | "졸음" | "과속" | "난폭운전";
  location: string;
  time: string;
  riskLevel: number;
  // 추가 상세 정보
  image?: string;
  vehicleType?: string;
  monthlyDrivingMinutes?: number;
  todayDrivingMinutes?: number;
  averageScore?: number;
  drivingStatus?: "주행중" | "휴식중";
  drivingStartTime?: number; // timestamp when driving started
}

interface DriverTableProps {
  drivers: Driver[];
  onViewDetails?: (driver: Driver) => void;
}

const statusColors = {
  "정상": "bg-green-100 text-green-800",
  "주의": "bg-yellow-100 text-yellow-800",
  "위험": "bg-orange-100 text-orange-800",
  "위급": "bg-red-100 text-red-800",
};

const riskTypeColors = {
  "정상": "text-green-600",
  "음주": "text-red-600",
  "졸음": "text-orange-600",
  "과속": "text-yellow-600",
  "난폭운전": "text-red-600",
};

export function DriverTable({ drivers, onViewDetails }: DriverTableProps) {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900">실시간 위험 운전자 목록</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                운전자
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                위험 유형
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                위치
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                감지 시간
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                위험도
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                액션
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {drivers.map((driver) => (
              <tr key={driver.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white font-medium">
                      {driver.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{driver.name}</p>
                      <p className="text-xs text-gray-500">{driver.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[driver.status]}`}>
                    {driver.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-medium ${riskTypeColors[driver.riskType]}`}>
                    {driver.riskType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {driver.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {driver.time}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2 mr-2" style={{ width: '60px' }}>
                      <div 
                        className={`h-2 rounded-full ${
                          driver.riskLevel >= 80 ? 'bg-red-600' : 
                          driver.riskLevel >= 60 ? 'bg-orange-500' : 
                          driver.riskLevel >= 40 ? 'bg-yellow-500' : 
                          'bg-green-500'
                        }`}
                        style={{ width: `${driver.riskLevel}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">{driver.riskLevel}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <button
                    onClick={() => onViewDetails?.(driver)}
                    className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    상세보기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}