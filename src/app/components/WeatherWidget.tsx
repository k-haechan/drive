import { Cloud, CloudRain, CloudSnow, CloudDrizzle, Sun, Wind, Users } from "lucide-react";

interface WeatherRegion {
  name: string;
  weather: "Heavy Rain" | "Snow" | "Rain" | "Drizzle" | "Cloudy" | "Clear";
  severity: number; // 1-5, 5 being worst
  driverCount: number;
  temperature: number;
}

export function WeatherWidget() {
  // 모의 데이터 - 심각도 순으로 정렬
  const regions: WeatherRegion[] = [
    { name: "강원 강릉시", weather: "Heavy Rain", severity: 5, driverCount: 12, temperature: 8 },
    { name: "경기 수원시", weather: "Snow", severity: 4, driverCount: 24, temperature: -2 },
    { name: "부산 해운대구", weather: "Rain", severity: 3, driverCount: 15, temperature: 12 },
    { name: "서울 강남구", weather: "Drizzle", severity: 2, driverCount: 45, temperature: 10 },
    { name: "대전 유성구", weather: "Cloudy", severity: 1, driverCount: 18, temperature: 9 },
    { name: "인천 남동구", weather: "Clear", severity: 0, driverCount: 21, temperature: 11 },
  ].sort((a, b) => b.severity - a.severity).slice(0, 6);

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case "Heavy Rain": return <CloudRain className="w-6 h-6 text-blue-600" />;
      case "Snow": return <CloudSnow className="w-6 h-6 text-blue-400" />;
      case "Rain": return <CloudRain className="w-6 h-6 text-blue-500" />;
      case "Drizzle": return <CloudDrizzle className="w-6 h-6 text-gray-500" />;
      case "Cloudy": return <Cloud className="w-6 h-6 text-gray-400" />;
      default: return <Sun className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 4) return "bg-red-50 border-red-200";
    if (severity >= 3) return "bg-orange-50 border-orange-200";
    if (severity >= 2) return "bg-yellow-50 border-yellow-200";
    return "bg-gray-50 border-gray-200";
  };

  const getSeverityBadge = (severity: number) => {
    if (severity >= 4) return <span className="px-2 py-0.5 text-xs font-semibold bg-red-600 text-white rounded-full">위험</span>;
    if (severity >= 3) return <span className="px-2 py-0.5 text-xs font-semibold bg-orange-500 text-white rounded-full">주의</span>;
    if (severity >= 2) return <span className="px-2 py-0.5 text-xs font-semibold bg-yellow-500 text-white rounded-full">양호</span>;
    return <span className="px-2 py-0.5 text-xs font-semibold bg-green-500 text-white rounded-full">정상</span>;
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Wind className="w-5 h-5 mr-2 text-blue-600" />
            지역별 날씨 & 운전자 현황
          </h3>
          <span className="text-xs text-gray-500">실시간 업데이트</span>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {regions.map((region, index) => (
            <div
              key={index}
              className={`border rounded-lg p-4 transition-all hover:shadow-md ${getSeverityColor(region.severity)}`}
            >
              <div className="flex items-start justify-between mb-3">
                {getWeatherIcon(region.weather)}
                {getSeverityBadge(region.severity)}
              </div>

              <h4 className="text-sm font-semibold text-gray-900 mb-1">{region.name}</h4>
              <p className="text-xs text-gray-600 mb-3">{region.weather}</p>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">온도</span>
                  <span className="text-sm font-semibold text-gray-900">{region.temperature}°C</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-3 h-3 text-gray-500 mr-1" />
                    <span className="text-xs text-gray-600">운전자</span>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">{region.driverCount}명</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
