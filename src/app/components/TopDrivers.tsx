import { Trophy, Award, Star, TrendingUp } from "lucide-react";

export interface TopDriver {
  rank: number;
  id: string;
  name: string;
  score: number;
  safetyDays: number;
  totalTrips: number;
  noViolations: number;
}

import { Driver } from "./DriverTable";

interface TopDriversProps {
  drivers: TopDriver[];
  allDrivers?: Driver[];
  onViewDetails?: (driver: Driver) => void;
}

export function TopDrivers({ drivers, allDrivers, onViewDetails }: TopDriversProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2: return <Award className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-orange-600" />;
      default: return <Star className="w-5 h-5 text-blue-500" />;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1: return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
      case 2: return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
      case 3: return "bg-gradient-to-r from-orange-400 to-orange-600 text-white";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Trophy className="w-6 h-6 mr-2 text-yellow-600" />
          이달의 우수 운전자
        </h3>
        <p className="text-xs text-gray-600 mt-1">안전 운전 우수자 TOP 5</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {drivers.map((driver) => {
            // 실제 Driver 데이터 찾기
            const actualDriver = allDrivers?.find(d => d.id === driver.id);
            const isClickable = actualDriver && onViewDetails;
            
            return (
            <div
              key={driver.id}
              onClick={() => {
                if (isClickable) {
                  onViewDetails(actualDriver);
                }
              }}
              className={`relative rounded-lg border-2 p-4 transition-all ${
                driver.rank <= 3 ? "border-yellow-300 bg-yellow-50" : "border-gray-200"
              } ${
                isClickable ? "cursor-pointer hover:shadow-lg hover:scale-[1.02]" : ""
              }`}
            >
              <div className="flex items-center">
                {/* 순위 아이콘 */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getRankBadge(driver.rank)}`}>
                  {driver.rank <= 3 ? (
                    getRankIcon(driver.rank)
                  ) : (
                    <span className="text-lg font-bold">{driver.rank}</span>
                  )}
                </div>

                {/* 운전자 정보 */}
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-base font-semibold text-gray-900">{driver.name}</h4>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-lg font-bold text-gray-900">{driver.score}</span>
                      <span className="text-xs text-gray-500">점</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{driver.id}</p>

                  {/* 통계 */}
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    <div className="text-center">
                      <p className="text-xs text-gray-600">무사고</p>
                      <p className="text-sm font-semibold text-green-600">{driver.safetyDays}일</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">총 운행</p>
                      <p className="text-sm font-semibold text-blue-600">{driver.totalTrips}회</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600">위반 없음</p>
                      <p className="text-sm font-semibold text-purple-600">{driver.noViolations}회</p>
                    </div>
                  </div>
                </div>

                {/* 1등 배지 */}
                {driver.rank === 1 && (
                  <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    BEST
                  </div>
                )}
              </div>
            </div>
            );
          })}
        </div>

        {/* 추가 정보 */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-start">
            <TrendingUp className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">우수 운전자 혜택</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• 안전 운전 포상금 지급</li>
                <li>• 우선 배차 기회 제공</li>
                <li>• 안전 운전 인증서 발급</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
