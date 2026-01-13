import {
  LayoutDashboard,
  Search,
  Bell,
  BarChart3,
  FileText,
} from "lucide-react";

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "대시보드", icon: LayoutDashboard },
  { id: "search", label: "위험 탐색", icon: Search },
  { id: "alerts", label: "알림 관리", icon: Bell },
  { id: "analytics", label: "분석", icon: BarChart3 },
];

export function Sidebar({
  currentPage,
  onPageChange,
}: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <div className="flex items-center mb-8">
          <img 
            src="/logo.png" 
            alt="S-CORT Logo" 
            className="h-10 w-auto object-contain"
          />
          <div className="ml-3">
            <h2 className="font-semibold text-gray-900">
              S-CORT
            </h2>
            <p className="text-xs text-gray-500">위험운전 모니터링</p>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon
                  className={`w-5 h-5 mr-3 ${isActive ? "text-blue-600" : "text-gray-400"}`}
                />
                {item.label}
                {item.id === "alerts" && (
                  <span className="ml-auto bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                    5
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}