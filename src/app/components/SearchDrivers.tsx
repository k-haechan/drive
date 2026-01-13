import { useState } from "react";
import { Search, Filter, SlidersHorizontal, Download, Send } from "lucide-react";
import { Driver } from "./DriverTable";

interface SearchDriversProps {
  drivers: Driver[];
  onSendAlert: (drivers: Driver[]) => void;
  onExportData: (drivers: Driver[]) => void;
  onViewDetails: (driver: Driver) => void;
}

export function SearchDrivers({ drivers, onSendAlert, onExportData, onViewDetails }: SearchDriversProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("전체");
  const [selectedRiskType, setSelectedRiskType] = useState<string>("전체");
  const [selectedDrivers, setSelectedDrivers] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<"riskLevel" | "time">("riskLevel");

  const filteredDrivers = drivers
    .filter(d => {
      const matchesSearch = d.name.includes(searchTerm) || d.id.includes(searchTerm) || d.location.includes(searchTerm);
      const matchesStatus = selectedStatus === "전체" || d.status === selectedStatus;
      const matchesRiskType = selectedRiskType === "전체" || d.riskType === selectedRiskType;
      return matchesSearch && matchesStatus && matchesRiskType;
    })
    .sort((a, b) => {
      if (sortBy === "riskLevel") return b.riskLevel - a.riskLevel;
      return a.time.localeCompare(b.time);
    });

  const toggleDriver = (driverId: string) => {
    const newSelected = new Set(selectedDrivers);
    if (newSelected.has(driverId)) {
      newSelected.delete(driverId);
    } else {
      newSelected.add(driverId);
    }
    setSelectedDrivers(newSelected);
  };

  const toggleAll = () => {
    if (selectedDrivers.size === filteredDrivers.length) {
      setSelectedDrivers(new Set());
    } else {
      setSelectedDrivers(new Set(filteredDrivers.map(d => d.id)));
    }
  };

  const getSelectedDriverData = () => {
    return drivers.filter(d => selectedDrivers.has(d.id));
  };

  return (
    <div className="space-y-6">
      {/* 검색 및 필터 섹션 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">위험 운전자 탐색</h2>
        
        {/* 검색바 */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="운전자명, ID, 위치로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 필터 옵션 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">상태 필터</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="전체">전체</option>
              <option value="위급">위급</option>
              <option value="위험">위험</option>
              <option value="주의">주의</option>
              <option value="정상">정상</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">위험 유형</label>
            <select
              value={selectedRiskType}
              onChange={(e) => setSelectedRiskType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="전체">전체</option>
              <option value="음주">음주</option>
              <option value="졸음">졸음</option>
              <option value="과속">과속</option>
              <option value="난폭운전">난폭운전</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">정렬 기준</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "riskLevel" | "time")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="riskLevel">위험도 높은 순</option>
              <option value="time">최근 감지 순</option>
            </select>
          </div>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedDrivers.size === filteredDrivers.length && filteredDrivers.length > 0}
              onChange={toggleAll}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">
              {selectedDrivers.size}명 선택됨
            </span>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => onSendAlert(getSelectedDriverData())}
              disabled={selectedDrivers.size === 0}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4 mr-2" />
              알림 전송
            </button>
            <button
              onClick={() => onExportData(getSelectedDriverData())}
              disabled={selectedDrivers.size === 0}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              데이터 저장
            </button>
          </div>
        </div>
      </div>

      {/* 검색 결과 */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            검색 결과 ({filteredDrivers.length}명)
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredDrivers.map((driver) => (
            <div
              key={driver.id}
              className={`p-4 hover:bg-gray-50 transition-colors ${
                selectedDrivers.has(driver.id) ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedDrivers.has(driver.id)}
                  onChange={() => toggleDriver(driver.id)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 mr-4"
                />
                <div className="flex-1 grid grid-cols-5 gap-4 items-center">
                  <div 
                    className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => onViewDetails(driver)}
                  >
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-medium">
                      {driver.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{driver.name}</p>
                      <p className="text-xs text-gray-500">{driver.id}</p>
                    </div>
                  </div>
                  <div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      driver.status === "위급" ? "bg-red-100 text-red-800" :
                      driver.status === "위험" ? "bg-orange-100 text-orange-800" :
                      driver.status === "주의" ? "bg-yellow-100 text-yellow-800" :
                      "bg-green-100 text-green-800"
                    }`}>
                      {driver.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-900">{driver.riskType}</div>
                  <div className="text-sm text-gray-500">{driver.location}</div>
                  <div className="flex items-center justify-end">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
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
                    <span className="text-xs text-gray-600 w-10">{driver.riskLevel}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}