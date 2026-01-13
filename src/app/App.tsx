import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { SearchDrivers } from './components/SearchDrivers';
import { AlertManagement } from './components/AlertManagement';
import { AnalyticsPage } from './components/AnalyticsPage';
import { NotificationDropdown } from './components/NotificationDropdown';
import { DriverDetailModal } from './components/DriverDetailModal';
import { Driver } from './components/DriverTable';
import { Activity } from 'lucide-react';

// 모의 데이터
const initialMockDrivers: Driver[] = [
  { 
    id: "DRV-001", 
    name: "김민수", 
    status: "위급", 
    riskType: "음주", 
    location: "서울 강남구 테헤란로", 
    time: "2분 전", 
    riskLevel: 95,
    vehicleType: "현대 포터II",
    monthlyDrivingMinutes: 2400,
    todayDrivingMinutes: 180,
    averageScore: 92,
    drivingStatus: "주행중",
    drivingStartTime: Date.now() - 30 * 60000, // 30분 전 시작
  },
  { 
    id: "DRV-002", 
    name: "박지영", 
    status: "위험", 
    riskType: "졸음", 
    location: "경기 수원시 영통구", 
    time: "5분 전", 
    riskLevel: 78,
    vehicleType: "기아 봉고III",
    monthlyDrivingMinutes: 2100,
    todayDrivingMinutes: 240,
    averageScore: 88,
    drivingStatus: "휴식중",
  },
  { 
    id: "DRV-003", 
    name: "이철호", 
    status: "주의", 
    riskType: "과속", 
    location: "서울 송파구 잠실동", 
    time: "8분 전", 
    riskLevel: 62,
    vehicleType: "현대 마이티",
    monthlyDrivingMinutes: 2800,
    todayDrivingMinutes: 320,
    averageScore: 85,
    drivingStatus: "주행중",
    drivingStartTime: Date.now() - 120 * 60000, // 2시간 전 시작
  },
  { 
    id: "DRV-004", 
    name: "정수진", 
    status: "위험", 
    riskType: "졸음", 
    location: "인천 남동구 구월동", 
    time: "12분 전", 
    riskLevel: 82,
    vehicleType: "기아 카니발",
    monthlyDrivingMinutes: 1900,
    todayDrivingMinutes: 150,
    averageScore: 90,
    drivingStatus: "휴식중",
  },
  { 
    id: "DRV-005", 
    name: "최동욱", 
    status: "주의", 
    riskType: "난폭운전", 
    location: "서울 마포구 상암동", 
    time: "15분 전", 
    riskLevel: 58,
    vehicleType: "현대 스타렉스",
    monthlyDrivingMinutes: 2600,
    todayDrivingMinutes: 280,
    averageScore: 83,
    drivingStatus: "주행중",
    drivingStartTime: Date.now() - 45 * 60000, // 45분 전 시작
  },
  { 
    id: "DRV-006", 
    name: "한서연", 
    status: "위험", 
    riskType: "음주", 
    location: "부산 해운대구", 
    time: "18분 전", 
    riskLevel: 88,
    vehicleType: "기아 레이",
    monthlyDrivingMinutes: 1800,
    todayDrivingMinutes: 120,
    averageScore: 87,
    drivingStatus: "휴식중",
  },
];

function App() {
  const [currentPage, setCurrentPage] = useState<string>("dashboard");
  const [mockDrivers, setMockDrivers] = useState<Driver[]>(initialMockDrivers);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleViewDetails = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsModalOpen(true);
  };

  const handleUpdateDriver = (updatedDriver: Driver) => {
    setMockDrivers(drivers => 
      drivers.map(d => d.id === updatedDriver.id ? updatedDriver : d)
    );
    setSelectedDriver(updatedDriver);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDriver(null);
  };

  const handleSendAlert = (drivers: Driver[]) => {
    if (drivers.length === 0) {
      alert("선택된 운전자가 없습니다.");
      return;
    }
    alert(`${drivers.length}명의 운전자에게 알림을 전송했습니다.\n\n${drivers.map(d => `- ${d.name} (${d.riskType})`).join('\n')}`);
  };

  const handleExportData = (drivers: Driver[]) => {
    if (drivers.length === 0) {
      alert("선택된 운전자가 없습니다.");
      return;
    }
    alert(`${drivers.length}명의 데이터를 저장했습니다.\n\n파일명: 위험운전_${new Date().toLocaleDateString('ko-KR')}.csv`);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard drivers={mockDrivers} onViewDetails={handleViewDetails} />;
      case "search":
        return <SearchDrivers drivers={mockDrivers} onSendAlert={handleSendAlert} onExportData={handleExportData} onViewDetails={handleViewDetails} />;
      case "alerts":
        return <AlertManagement drivers={mockDrivers} onViewDetails={handleViewDetails} />;
      case "analytics":
        return <AnalyticsPage drivers={mockDrivers} />;
      default:
        return <Dashboard drivers={mockDrivers} onViewDetails={handleViewDetails} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 사이드바 */}
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />

      {/* 메인 콘텐츠 */}
      <div className="flex-1">
        {/* 헤더 */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">위험운전 모니터링 시스템</h1>
                  <p className="text-sm text-gray-500">
                    {currentPage === "dashboard" && "실시간 운전자 상태 관리 대시보드"}
                    {currentPage === "search" && "위험 운전자 검색 및 관리"}
                    {currentPage === "alerts" && "알림 전송 및 상황 해결 관리"}
                    {currentPage === "analytics" && "데이터 분석 및 우수 운전자 관리"}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <NotificationDropdown />
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                    관
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">관리자</p>
                    <p className="text-xs text-gray-500">Admin</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* 페이지 콘텐츠 */}
        <main className="p-8">
          {renderPage()}
        </main>
      </div>

      {/* 운전자 상세 모달 */}
      <DriverDetailModal 
        driver={selectedDriver}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onUpdateDriver={handleUpdateDriver}
      />
    </div>
  );
}

export default App;