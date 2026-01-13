import { AlertTriangle, Bell, Clock, MapPin } from "lucide-react";

interface Alert {
  id: string;
  driver: string;
  type: "음주" | "졸음" | "과속" | "난폭운전";
  severity: "낮음" | "중간" | "높음" | "위급";
  location: string;
  time: string;
}

const severityColors = {
  "낮음": "text-yellow-600 bg-yellow-50",
  "중간": "text-orange-600 bg-orange-50",
  "높음": "text-red-600 bg-red-50",
  "위급": "text-red-800 bg-red-100",
};

const alerts: Alert[] = [
  { id: "1", driver: "김민수", type: "음주", severity: "위급", location: "서울 강남구", time: "2분 전" },
  { id: "2", driver: "박지영", type: "졸음", severity: "높음", location: "경기 수원시", time: "5분 전" },
  { id: "3", driver: "이철호", type: "과속", severity: "중간", location: "서울 송파구", time: "8분 전" },
  { id: "4", driver: "정수진", type: "졸음", severity: "높음", location: "인천 남동구", time: "12분 전" },
  { id: "5", driver: "최동욱", type: "난폭운전", severity: "중간", location: "서울 마포구", time: "15분 전" },
];

export function AlertPanel() {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          실시간 알림
        </h3>
        <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
          {alerts.length}
        </span>
      </div>
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {alerts.map((alert) => (
          <div key={alert.id} className={`p-4 hover:bg-gray-50 transition-colors ${severityColors[alert.severity]}`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertTriangle className={`w-5 h-5 ${
                  alert.severity === "위급" ? "text-red-800" :
                  alert.severity === "높음" ? "text-red-600" :
                  alert.severity === "중간" ? "text-orange-600" :
                  "text-yellow-600"
                }`} />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {alert.driver} - {alert.type} 감지
                    </p>
                    <div className="mt-1 flex items-center text-xs text-gray-600">
                      <MapPin className="w-3 h-3 mr-1" />
                      {alert.location}
                    </div>
                  </div>
                  <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded ${
                    alert.severity === "위급" ? "bg-red-600 text-white" :
                    alert.severity === "높음" ? "bg-red-500 text-white" :
                    alert.severity === "중간" ? "bg-orange-500 text-white" :
                    "bg-yellow-500 text-white"
                  }`}>
                    {alert.severity}
                  </span>
                </div>
                <div className="mt-2 flex items-center text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {alert.time}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
