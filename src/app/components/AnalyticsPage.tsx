import { useState } from "react";
import { DataAnalysis } from "./DataAnalysis";
import { TopDrivers, TopDriver } from "./TopDrivers";
import { Driver } from "./DriverTable";
import { TrendingUp } from "lucide-react";

interface AnalyticsPageProps {
  drivers: Driver[];
  onViewDetails?: (driver: Driver) => void;
}

export function AnalyticsPage({ drivers, onViewDetails }: AnalyticsPageProps) {
  const [activeTab, setActiveTab] = useState<"data" | "topDrivers">("data");

  // 실제 운전자 데이터에서 우수 운전자 TOP 5 생성
  const topDrivers: TopDriver[] = drivers
    .filter(d => d.status === "정상" && d.averageScore) // 정상 운전자 중에서
    .sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0)) // 점수 높은 순으로 정렬
    .slice(0, 5) // 상위 5명
    .map((driver, index) => ({
      rank: index + 1,
      id: driver.id,
      name: driver.name,
      score: driver.averageScore || 0,
      safetyDays: Math.floor((driver.monthlyDrivingMinutes || 0) / 60 / 24), // 월간 운행 시간을 일수로 변환
      totalTrips: Math.floor((driver.monthlyDrivingMinutes || 0) / 60), // 월간 운행 시간을 횟수로 변환
      noViolations: Math.floor((driver.monthlyDrivingMinutes || 0) / 60) - Math.floor((driver.riskLevel || 0) / 10), // 위반 없음 횟수
    }));

  return (
    <div className="space-y-6">
      {/* 탭 네비게이션 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("data")}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "data"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            데이터 분석 & 추출
          </button>
          <button
            onClick={() => setActiveTab("topDrivers")}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${
              activeTab === "topDrivers"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            우수 운전자
          </button>
        </div>
      </div>

      {/* 탭 컨텐츠 */}
      {activeTab === "data" && <DataAnalysis drivers={drivers} />}
      {activeTab === "topDrivers" && <TopDrivers drivers={topDrivers} allDrivers={drivers} onViewDetails={onViewDetails} />}
    </div>
  );
}
