import { useState } from "react";
import { Download, FileText, Calendar, TrendingUp, Database, BarChart3, PieChart } from "lucide-react";
import { Driver } from "./DriverTable";
import { BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface DataAnalysisProps {
  drivers: Driver[];
}

interface SavedData {
  id: string;
  date: string;
  type: string;
  driversCount: number;
  description: string;
}

export function DataAnalysis({ drivers }: DataAnalysisProps) {
  const [dateRange, setDateRange] = useState({ from: "2026-01-01", to: "2026-01-12" });
  const [dataType, setDataType] = useState("전체");
  
  const [savedDatasets] = useState<SavedData[]>([
    { id: "DS-001", date: "2026-01-12", type: "위험운전", driversCount: 18, description: "오늘 위험 운전자 데이터" },
    { id: "DS-002", date: "2026-01-11", type: "음주", driversCount: 12, description: "음주 운전 집중 분석" },
    { id: "DS-003", date: "2026-01-10", type: "졸음", driversCount: 25, description: "야간 졸음 운전 데이터" },
    { id: "DS-004", date: "2026-01-09", type: "전체", driversCount: 248, description: "주간 통합 리포트" },
  ]);

  // 시간대별 위험운전 발생 추이 데이터
  const hourlyData = [
    { hour: "00-02", count: 12 },
    { hour: "02-04", count: 8 },
    { hour: "04-06", count: 15 },
    { hour: "06-08", count: 28 },
    { hour: "08-10", count: 42 },
    { hour: "10-12", count: 38 },
    { hour: "12-14", count: 35 },
    { hour: "14-16", count: 40 },
    { hour: "16-18", count: 52 },
    { hour: "18-20", count: 48 },
    { hour: "20-22", count: 32 },
    { hour: "22-24", count: 18 },
  ];

  // 위험유형별 분포 데이터
  const riskTypeData = [
    { name: "음주", value: 85, color: "#ef4444" },
    { name: "졸음", value: 132, color: "#f59e0b" },
    { name: "과속", value: 95, color: "#eab308" },
    { name: "난폭운전", value: 76, color: "#f97316" },
  ];

  const handleExportCSV = () => {
    const csvContent = [
      ["ID", "이름", "상태", "위험유형", "위치", "시간", "위험도"],
      ...drivers.map(d => [d.id, d.name, d.status, d.riskType, d.location, d.time, d.riskLevel]),
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `위험운전데이터_${new Date().toLocaleDateString('ko-KR')}.csv`;
    link.click();
  };

  const handleExportJSON = () => {
    const jsonContent = JSON.stringify(drivers, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `위험운전데이터_${new Date().toLocaleDateString('ko-KR')}.json`;
    link.click();
  };

  const handleGenerateReport = () => {
    alert(`리포트 생성 중...\n\n기간: ${dateRange.from} ~ ${dateRange.to}\n유형: ${dataType}\n대상: ${drivers.length}명\n\n리포트가 생성되었습니다.`);
  };

  const stats = {
    totalIncidents: 321,
    resolvedIncidents: 289,
    avgRiskLevel: 64,
    criticalAlerts: 18,
  };

  return (
    <div className="space-y-6">
      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 시간대별 위험운전 발생 추이 */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-blue-600" />
            시간대별 위험운전 발생 추이
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={hourlyData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" name="발생 건수" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 위험유형별 분포 */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <PieChart className="w-6 h-6 mr-2 text-purple-600" />
            위험유형별 분포
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={riskTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {riskTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 데이터 추출 섹션 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Database className="w-6 h-6 mr-2" />
          데이터 추출
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">시작 날짜</label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">종료 날짜</label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">데이터 유형</label>
            <select
              value={dataType}
              onChange={(e) => setDataType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="전체">전체</option>
              <option value="음주">음주</option>
              <option value="졸음">졸음</option>
              <option value="과속">과속</option>
              <option value="난폭운전">난폭운전</option>
            </select>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleExportCSV}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            CSV 다운로드
          </button>
          <button
            onClick={handleExportJSON}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            JSON 다운로드
          </button>
          <button
            onClick={handleGenerateReport}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <FileText className="w-4 h-4 mr-2" />
            리포트 생성
          </button>
        </div>
      </div>

      {/* 통계 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">총 이벤트</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.totalIncidents}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">해결 완료</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.resolvedIncidents}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">평균 위험도</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.avgRiskLevel}%</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">긴급 알림</p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">{stats.criticalAlerts}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Calendar className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 저장된 데이터셋 */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">저장된 데이터셋</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {savedDatasets.map((dataset) => (
            <div key={dataset.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <FileText className="w-5 h-5 text-gray-400 mr-2" />
                    <h3 className="text-sm font-medium text-gray-900">{dataset.description}</h3>
                    <span className="ml-3 px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                      {dataset.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>ID: {dataset.id}</span>
                    <span>날짜: {dataset.date}</span>
                    <span>운전자: {dataset.driversCount}명</span>
                  </div>
                </div>
                <button className="ml-4 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center">
                  <Download className="w-4 h-4 mr-1" />
                  다운로드
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 데이터 활용 가이드 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">데이터 활용 가이드</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>위험 패턴 분석을 위해 정기적으로 데이터를 저장하세요</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>CSV 형식은 Excel이나 데이터 분석 도구에서 활용할 수 있습니다</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>JSON 형식은 개발자 도구나 API 연동에 적합합니다</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>리포트는 관리 회의나 보고서 작성에 활용하세요</span>
          </li>
        </ul>
      </div>
    </div>
  );
}