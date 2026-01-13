import { useState } from "react";
import { Bell, X, AlertTriangle, Clock, MapPin } from "lucide-react";

interface Notification {
  id: string;
  type: "critical" | "warning" | "info";
  driver: string;
  message: string;
  location: string;
  time: string;
  read: boolean;
}

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "N-001",
      type: "critical",
      driver: "김민수",
      message: "음주 운전 의심 감지",
      location: "서울 강남구",
      time: "2분 전",
      read: false,
    },
    {
      id: "N-002",
      type: "critical",
      driver: "박지영",
      message: "졸음 운전 감지",
      location: "경기 수원시",
      time: "5분 전",
      read: false,
    },
    {
      id: "N-003",
      type: "warning",
      driver: "이철호",
      message: "과속 감지",
      location: "서울 송파구",
      time: "8분 전",
      read: false,
    },
    {
      id: "N-004",
      type: "warning",
      driver: "정수진",
      message: "졸음 운전 감지",
      location: "인천 남동구",
      time: "12분 전",
      read: true,
    },
    {
      id: "N-005",
      type: "info",
      driver: "최동욱",
      message: "난폭 운전 감지",
      location: "서울 마포구",
      time: "15분 전",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "critical": return "bg-red-50 border-l-4 border-red-600";
      case "warning": return "bg-orange-50 border-l-4 border-orange-500";
      default: return "bg-blue-50 border-l-4 border-blue-500";
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-600 text-white text-xs font-semibold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* 드롭다운 */}
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] overflow-hidden flex flex-col">
            {/* 헤더 */}
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">알림</h3>
                <p className="text-xs text-gray-500">{unreadCount}개의 읽지 않은 알림</p>
              </div>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    모두 읽음
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* 알림 목록 */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">새로운 알림이 없습니다</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className={`w-full p-4 text-left transition-colors hover:bg-gray-50 ${
                        !notification.read ? getTypeColor(notification.type) : "bg-white"
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <AlertTriangle className={`w-5 h-5 ${
                            notification.type === "critical" ? "text-red-600" :
                            notification.type === "warning" ? "text-orange-500" :
                            "text-blue-500"
                          }`} />
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.driver} - {notification.message}
                          </p>
                          <div className="mt-1 flex items-center text-xs text-gray-600">
                            <MapPin className="w-3 h-3 mr-1" />
                            {notification.location}
                          </div>
                          <div className="mt-1 flex items-center text-xs text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            {notification.time}
                          </div>
                        </div>
                        {!notification.read && (
                          <div className="flex-shrink-0 ml-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 푸터 */}
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
              <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
                모든 알림 보기
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
