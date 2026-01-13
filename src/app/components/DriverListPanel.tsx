import { User, AlertCircle, CheckCircle } from "lucide-react";
import { Driver } from "./DriverTable";

interface DriverListPanelProps {
  drivers: Driver[];
  onDriverClick?: (driver: Driver) => void;
}

export function DriverListPanel({ drivers, onDriverClick }: DriverListPanelProps) {
  // 위험도 순으로 정렬
  const sortedDrivers = [...drivers].sort((a, b) => b.riskLevel - a.riskLevel);

  const getStatusIcon = (status: string) => {
    if (status === "위급" || status === "위험") {
      return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
    return <CheckCircle className="w-4 h-4 text-green-600" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "위급": return "border-l-4 border-red-600 bg-red-50";
      case "위험": return "border-l-4 border-orange-500 bg-orange-50";
      case "주의": return "border-l-4 border-yellow-500 bg-yellow-50";
      default: return "border-l-4 border-green-500 bg-white";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 h-full flex flex-col">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <User className="w-5 h-5 mr-2 text-blue-600" />
          운전자 목록
        </h3>
        <p className="text-xs text-gray-500 mt-1">총 {drivers.length}명</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-200">
          {sortedDrivers.map((driver) => (
            <button
              key={driver.id}
              onClick={() => onDriverClick?.(driver)}
              className={`w-full px-4 py-3 text-left transition-colors hover:bg-gray-50 ${getStatusColor(driver.status)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    {getStatusIcon(driver.status)}
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {driver.name}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{driver.id}</p>
                  <p className="text-xs text-gray-600 mt-1 truncate">{driver.location}</p>
                  
                  <div className="mt-2 flex items-center space-x-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      driver.status === "위급" ? "bg-red-600 text-white" :
                      driver.status === "위험" ? "bg-orange-500 text-white" :
                      driver.status === "주의" ? "bg-yellow-500 text-white" :
                      "bg-green-500 text-white"
                    }`}>
                      {driver.status}
                    </span>
                    <span className="text-xs text-gray-600">{driver.riskType}</span>
                  </div>
                </div>

                <div className="ml-3 flex flex-col items-end">
                  <div className="flex items-center">
                    <div className="w-12 bg-gray-200 rounded-full h-1.5 mr-1">
                      <div 
                        className={`h-1.5 rounded-full ${
                          driver.riskLevel >= 80 ? 'bg-red-600' : 
                          driver.riskLevel >= 60 ? 'bg-orange-500' : 
                          driver.riskLevel >= 40 ? 'bg-yellow-500' : 
                          'bg-green-500'
                        }`}
                        style={{ width: `${driver.riskLevel}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-semibold text-gray-700">{driver.riskLevel}%</span>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">{driver.time}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 빠른 통계 */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xs text-gray-600">위급</p>
            <p className="text-sm font-semibold text-red-600">
              {drivers.filter(d => d.status === "위급").length}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">위험</p>
            <p className="text-sm font-semibold text-orange-600">
              {drivers.filter(d => d.status === "위험").length}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">정상</p>
            <p className="text-sm font-semibold text-green-600">
              {drivers.filter(d => d.status === "정상").length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
