import { MapPin, Navigation, Zap } from "lucide-react";
import { Driver } from "./DriverTable";

interface InteractiveMapProps {
  drivers: Driver[];
  onDriverClick?: (driver: Driver) => void;
}

export function InteractiveMap({ drivers, onDriverClick }: InteractiveMapProps) {
  // 지역별로 운전자 그룹화 (간단한 예시)
  const regions = [
    { name: "서울 강남구", lat: 37.5, lng: 127.05, drivers: drivers.filter(d => d.location.includes("강남")) },
    { name: "경기 수원시", lat: 37.3, lng: 127.0, drivers: drivers.filter(d => d.location.includes("수원")) },
    { name: "서울 송파구", lat: 37.52, lng: 127.12, drivers: drivers.filter(d => d.location.includes("송파")) },
    { name: "인천 남동구", lat: 37.45, lng: 126.7, drivers: drivers.filter(d => d.location.includes("인천")) },
    { name: "서울 마포구", lat: 37.56, lng: 126.9, drivers: drivers.filter(d => d.location.includes("마포")) },
    { name: "부산 해운대구", lat: 35.16, lng: 129.16, drivers: drivers.filter(d => d.location.includes("부산")) },
  ];

  // 위급/위험 운전자만 필터링
  const criticalDrivers = drivers.filter(d => d.status === "위급" || d.status === "위험");

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 h-full overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Navigation className="w-5 h-5 mr-2 text-blue-600" />
          실시간 차량 위치
        </h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-600">위급 {criticalDrivers.filter(d => d.status === "위급").length}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-xs text-gray-600">위험 {criticalDrivers.filter(d => d.status === "위험").length}</span>
          </div>
        </div>
      </div>
      
      <div className="relative bg-gradient-to-br from-blue-50 to-gray-100" style={{ height: "calc(100% - 65px)" }}>
        {/* 지도 배경 그리드 */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="gray" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* 지역 마커 */}
        {regions.map((region, index) => {
          const hasDrivers = region.drivers.length > 0;
          const hasCritical = region.drivers.some(d => d.status === "위급" || d.status === "위험");
          
          return (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
              style={{
                left: `${20 + index * 15}%`,
                top: `${30 + (index % 2) * 20}%`,
              }}
            >
              {/* 펄스 효과 (위급/위험 시) */}
              {hasCritical && (
                <div className="absolute inset-0 w-12 h-12 -top-6 -left-6">
                  <div className="absolute inset-0 bg-red-500 rounded-full opacity-75 animate-ping"></div>
                </div>
              )}
              
              {/* 마커 */}
              <div className={`relative z-10 p-2 rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-110 ${
                hasCritical ? "bg-red-600" : hasDrivers ? "bg-blue-600" : "bg-gray-400"
              }`}>
                <MapPin className="w-6 h-6 text-white" />
              </div>

              {/* 툴팁 */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-xl">
                  <p className="font-semibold">{region.name}</p>
                  <p className="text-gray-300">운전자: {region.drivers.length}명</p>
                  {hasCritical && (
                    <p className="text-red-400 flex items-center mt-1">
                      <Zap className="w-3 h-3 mr-1" />
                      위험 감지
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* 범례 */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">범례</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-red-600" />
              <span className="text-xs text-gray-600">위급/위험 지역</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-gray-600">정상 운행</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-600">운전자 없음</span>
            </div>
          </div>
        </div>

        {/* 통계 오버레이 */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4">
          <div className="text-center">
            <p className="text-xs text-gray-600">총 차량</p>
            <p className="text-2xl font-semibold text-gray-900">{drivers.length}</p>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">활성:</span>
              <span className="font-semibold text-green-600">{drivers.length - criticalDrivers.length}</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-gray-600">경고:</span>
              <span className="font-semibold text-red-600">{criticalDrivers.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
