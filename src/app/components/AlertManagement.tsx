import { useState } from "react";
import { Send, CheckCircle, Clock, AlertTriangle, Settings } from "lucide-react";
import { Driver } from "./DriverTable";

interface AlertManagementProps {
  drivers: Driver[];
  onViewDetails: (driver: Driver) => void;
}

interface AlertHistory {
  id: string;
  driver: Driver;
  sentAt: string;
  status: "전송됨" | "확인됨" | "해결됨";
  message: string;
  resolvedAt?: string;
}

export function AlertManagement({ drivers, onViewDetails }: AlertManagementProps) {
  const [autoAlertEnabled, setAutoAlertEnabled] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState(70);
  const [alertHistory, setAlertHistory] = useState<AlertHistory[]>([
    {
      id: "AH-001",
      driver: drivers[0],
      sentAt: "2026-01-12 14:32",
      status: "해결됨",
      message: "음주 운전 의심 - 즉시 차량 정지 요청",
      resolvedAt: "2026-01-12 14:45"
    },
    {
      id: "AH-002",
      driver: drivers[1],
      sentAt: "2026-01-12 14:35",
      status: "확인됨",
      message: "졸음 운전 감지 - 휴게소 이용 권장",
    },
    {
      id: "AH-003",
      driver: drivers[3],
      sentAt: "2026-01-12 14:28",
      status: "전송됨",
      message: "졸음 운전 감지 - 안전 확인 필요",
    },
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState("음주");
  const [customMessage, setCustomMessage] = useState("");

  const templates = {
    음주: "음주 운전이 감지되었습니다. 즉시 안전한 장소에 차량을 정차해 주세요.",
    졸음: "졸음 운전이 감지되었습니다. 가까운 휴게소에서 휴식을 취해 주세요.",
    과속: "과속이 감지되었습니다. 안전 속도를 준수해 주세요.",
    난폭운전: "난폭 운전이 감지되었습니다. 안전 운전을 부탁드립니다.",
  };

  const handleSendAlert = (driver: Driver) => {
    const message = customMessage || templates[selectedTemplate as keyof typeof templates];
    const newAlert: AlertHistory = {
      id: `AH-${String(alertHistory.length + 1).padStart(3, '0')}`,
      driver,
      sentAt: new Date().toLocaleString('ko-KR'),
      status: "전송됨",
      message,
    };
    setAlertHistory([newAlert, ...alertHistory]);
    alert(`${driver.name}에게 알림이 전송되었습니다.\n\n메시지: ${message}`);
    setCustomMessage("");
  };

  const handleResolve = (alertId: string) => {
    setAlertHistory(alertHistory.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: "해결됨" as const, resolvedAt: new Date().toLocaleString('ko-KR') }
        : alert
    ));
  };

  const highRiskDrivers = drivers.filter(d => d.riskLevel >= alertThreshold);

  return (
    <div className="space-y-6">
      {/* 자동 알림 설정 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Settings className="w-6 h-6 mr-2" />
            자동 알림 설정
          </h2>
          <label className="flex items-center cursor-pointer">
            <span className="mr-3 text-sm text-gray-700">자동 알림</span>
            <div className="relative">
              <input
                type="checkbox"
                checked={autoAlertEnabled}
                onChange={(e) => setAutoAlertEnabled(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${
                autoAlertEnabled ? 'bg-blue-600' : 'bg-gray-300'
              }`}>
                <div className={`w-4 h-4 bg-white rounded-full mt-1 ml-1 transition-transform ${
                  autoAlertEnabled ? 'transform translate-x-5' : ''
                }`}></div>
              </div>
            </div>
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              알림 발송 위험도 기준: {alertThreshold}%
            </label>
            <input
              type="range"
              min="50"
              max="100"
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              현재 {highRiskDrivers.length}명의 운전자가 자동 알림 기준을 초과했습니다.
              {autoAlertEnabled && " 자동으로 알림이 전송됩니다."}
            </p>
          </div>
        </div>
      </div>

      {/* 수동 알림 전송 */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">수동 알림 전송</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">메시지 템플릿</label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="음주">음주 운전 경고</option>
              <option value="졸음">졸음 운전 경고</option>
              <option value="과속">과속 경고</option>
              <option value="난폭운전">난폭 운전 경고</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">커스텀 메시지 (선택)</label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder={templates[selectedTemplate as keyof typeof templates]}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {highRiskDrivers.slice(0, 6).map((driver) => (
              <div
                key={driver.id}
                className="flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div 
                  className="flex items-center flex-1 cursor-pointer"
                  onClick={() => onViewDetails(driver)}
                >
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {driver.name.charAt(0)}
                  </div>
                  <div className="ml-3 text-left">
                    <p className="text-sm font-medium text-gray-900">{driver.name}</p>
                    <p className="text-xs text-gray-500">{driver.riskType} - {driver.riskLevel}%</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSendAlert(driver)}
                  className="ml-2"
                >
                  <Send className="w-4 h-4 text-blue-600 hover:text-blue-800" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 알림 히스토리 */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">알림 전송 내역</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {alertHistory.map((alert) => (
            <div key={alert.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div 
                      className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => onViewDetails(alert.driver)}
                    >
                      {alert.driver.name.charAt(0)}
                    </div>
                    <div 
                      className="ml-3 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => onViewDetails(alert.driver)}
                    >
                      <p className="text-sm font-medium text-gray-900">{alert.driver.name}</p>
                      <p className="text-xs text-gray-500">{alert.id}</p>
                    </div>
                    <span className={`ml-4 px-2 py-1 text-xs font-semibold rounded-full ${
                      alert.status === "해결됨" ? "bg-green-100 text-green-800" :
                      alert.status === "확인됨" ? "bg-blue-100 text-blue-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {alert.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      전송: {alert.sentAt}
                    </div>
                    {alert.resolvedAt && (
                      <div className="flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        해결: {alert.resolvedAt}
                      </div>
                    )}
                  </div>
                </div>
                {alert.status !== "해결됨" && (
                  <button
                    onClick={() => handleResolve(alert.id)}
                    className="ml-4 px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    해결 완료
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}