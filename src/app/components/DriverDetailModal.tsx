import { useState, useEffect } from "react";
import { X, Car, Clock, Star, Activity, PlayCircle, PauseCircle } from "lucide-react";
import { Driver } from "./DriverTable";

interface DriverDetailModalProps {
  driver: Driver | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateDriver?: (updatedDriver: Driver) => void;
}

export function DriverDetailModal({ driver, isOpen, onClose, onUpdateDriver }: DriverDetailModalProps) {
  const [currentDriver, setCurrentDriver] = useState<Driver | null>(driver);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  // 운전자가 변경되면 상태 업데이트
  useEffect(() => {
    if (driver) {
      setCurrentDriver(driver);
      
      // 주행중인 경우 경과 시간 계산
      if (driver.drivingStatus === "주행중" && driver.drivingStartTime) {
        const elapsed = Math.floor((Date.now() - driver.drivingStartTime) / 60000);
        setElapsedMinutes(elapsed);
      } else {
        setElapsedMinutes(0);
      }
    }
  }, [driver]);

  // 주행중일 때 매 분마다 시간 업데이트
  useEffect(() => {
    if (!currentDriver || currentDriver.drivingStatus !== "주행중") return;

    const interval = setInterval(() => {
      if (currentDriver.drivingStartTime) {
        const elapsed = Math.floor((Date.now() - currentDriver.drivingStartTime) / 60000);
        setElapsedMinutes(elapsed);
      }
    }, 60000); // 1분마다 업데이트

    return () => clearInterval(interval);
  }, [currentDriver]);

  // 운전 상태 토글
  const toggleDrivingStatus = () => {
    if (!currentDriver) return;

    const newStatus = currentDriver.drivingStatus === "주행중" ? "휴식중" : "주행중";
    let updatedDriver = { ...currentDriver };

    if (newStatus === "휴식중") {
      // 휴식중으로 변경: 현재까지의 주행 시간을 저장
      const drivingTime = currentDriver.drivingStartTime 
        ? Math.floor((Date.now() - currentDriver.drivingStartTime) / 60000)
        : 0;
      
      updatedDriver = {
        ...currentDriver,
        drivingStatus: "휴식중",
        todayDrivingMinutes: (currentDriver.todayDrivingMinutes || 0) + drivingTime,
        monthlyDrivingMinutes: (currentDriver.monthlyDrivingMinutes || 0) + drivingTime,
        drivingStartTime: undefined,
      };
      setElapsedMinutes(0);
    } else {
      // 주행중으로 변경: 시작 시간 기록
      updatedDriver = {
        ...currentDriver,
        drivingStatus: "주행중",
        drivingStartTime: Date.now(),
      };
    }

    setCurrentDriver(updatedDriver);
    onUpdateDriver?.(updatedDriver);
  };

  // 시간을 "X시간 Y분" 형식으로 변환
  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분`;
  };

  // 현재 주행중인 시간 포함한 금일 총 운전시간
  const getCurrentTodayMinutes = () => {
    if (!currentDriver) return 0;
    const base = currentDriver.todayDrivingMinutes || 0;
    return currentDriver.drivingStatus === "주행중" ? base + elapsedMinutes : base;
  };

  // 현재 주행중인 시간 포함한 이달 총 운전시간
  const getCurrentMonthlyMinutes = () => {
    if (!currentDriver) return 0;
    const base = currentDriver.monthlyDrivingMinutes || 0;
    return currentDriver.drivingStatus === "주행중" ? base + elapsedMinutes : base;
  };

  if (!isOpen || !currentDriver) return null;

  return (
    <>
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* 모달 */}
        <div
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 헤더 */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between rounded-t-xl">
            <h2 className="text-xl font-semibold text-white">운전자 상세 정보</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-blue-500 rounded-lg p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* 콘텐츠 */}
          <div className="p-6 space-y-6">
            {/* 프로필 섹션 */}
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <img
                  src={currentDriver.image || "https://images.unsplash.com/photo-1718434137166-b3cb7d944b27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkcml2ZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjgyMjU0NDR8MA&ixlib=rb-4.1.0&q=80&w=1080"}
                  alt={currentDriver.name}
                  className="w-32 h-32 rounded-lg object-cover border-4 border-gray-200 shadow-md"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{currentDriver.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{currentDriver.id}</p>
                
                <div className="flex items-center space-x-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    currentDriver.status === "위급" ? "bg-red-600 text-white" :
                    currentDriver.status === "위험" ? "bg-orange-500 text-white" :
                    currentDriver.status === "주의" ? "bg-yellow-500 text-white" :
                    "bg-green-500 text-white"
                  }`}>
                    {currentDriver.status}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                    {currentDriver.riskType}
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Car className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="font-medium">{currentDriver.vehicleType || "현대 포터II"}</span>
                </div>
              </div>
            </div>

            {/* 운전 상태 토글 */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-blue-600" />
                  <span className="font-semibold text-gray-900">운전 상태</span>
                </div>
                <button
                  onClick={toggleDrivingStatus}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    currentDriver.drivingStatus === "주행중"
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                  }`}
                >
                  {currentDriver.drivingStatus === "주행중" ? (
                    <>
                      <PlayCircle className="w-5 h-5" />
                      <span>주행중</span>
                    </>
                  ) : (
                    <>
                      <PauseCircle className="w-5 h-5" />
                      <span>휴식중</span>
                    </>
                  )}
                </button>
              </div>
              {currentDriver.drivingStatus === "주행중" && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <p className="text-xs text-gray-600">현재 주행 시간</p>
                  <p className="text-lg font-bold text-blue-600">{formatMinutes(elapsedMinutes)}</p>
                </div>
              )}
            </div>

            {/* 통계 그리드 */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* 금일 운전시간 */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center mb-2">
                  <Clock className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-xs font-medium text-gray-600">오늘 운전시간</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {formatMinutes(getCurrentTodayMinutes())}
                </p>
              </div>

              {/* 이달 운전시간 */}
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center mb-2">
                  <Clock className="w-5 h-5 text-purple-600 mr-2" />
                  <span className="text-xs font-medium text-gray-600">이달 운전시간</span>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  {formatMinutes(getCurrentMonthlyMinutes())}
                </p>
              </div>

              {/* 평균 운전점수 */}
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center mb-2">
                  <Star className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="text-xs font-medium text-gray-600">평균 점수</span>
                </div>
                <p className="text-2xl font-bold text-yellow-600">
                  {currentDriver.averageScore || 85}점
                </p>
              </div>
            </div>

            {/* 추가 정보 */}
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">현재 위치</span>
                <span className="text-sm font-semibold text-gray-900">{currentDriver.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">마지막 업데이트</span>
                <span className="text-sm font-semibold text-gray-900">{currentDriver.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">위험도</span>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className={`h-2 rounded-full ${
                        currentDriver.riskLevel >= 80 ? 'bg-red-600' : 
                        currentDriver.riskLevel >= 60 ? 'bg-orange-500' : 
                        currentDriver.riskLevel >= 40 ? 'bg-yellow-500' : 
                        'bg-green-500'
                      }`}
                      style={{ width: `${currentDriver.riskLevel}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{currentDriver.riskLevel}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* 푸터 */}
          <div className="px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              닫기
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              알림 전송
            </button>
          </div>
        </div>
      </div>
    </>
  );
}