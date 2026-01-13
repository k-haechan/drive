import { useState } from "react";
import { DataAnalysis } from "./DataAnalysis";
import { TopDrivers, TopDriver } from "./TopDrivers";
import { Driver } from "./DriverTable";
import { TrendingUp } from "lucide-react";

interface AnalyticsPageProps {
  drivers: Driver[];
}

const topDrivers: TopDriver[] = [
  { rank: 1, id: "DRV-101", name: "강태양", score: 98, safetyDays: 145, totalTrips: 320, noViolations: 320 },
  { rank: 2, id: "DRV-087", name: "오민지", score: 96, safetyDays: 132, totalTrips: 298, noViolations: 298 },
  { rank: 3, id: "DRV-065", name: "임준호", score: 94, safetyDays: 118, totalTrips: 275, noViolations: 273 },
  { rank: 4, id: "DRV-143", name: "윤서아", score: 92, safetyDays: 106, totalTrips: 256, noViolations: 254 },
  { rank: 5, id: "DRV-092", name: "신동현", score: 90, safetyDays: 95, totalTrips: 241, noViolations: 239 },
];

export function AnalyticsPage({ drivers }: AnalyticsPageProps) {
  const [activeTab, setActiveTab] = useState<"data" | "topDrivers">("data");

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
      {activeTab === "topDrivers" && <TopDrivers drivers={topDrivers} />}
    </div>
  );
}
