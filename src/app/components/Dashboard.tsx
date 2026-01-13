import { Driver } from './DriverTable';
import { InteractiveMap } from './InteractiveMap';
import { DriverListPanel } from './DriverListPanel';
import { WeatherWidget } from './WeatherWidget';

interface DashboardProps {
  drivers: Driver[];
  onViewDetails: (driver: Driver) => void;
}

export function Dashboard({ drivers, onViewDetails }: DashboardProps) {
  return (
    <div className="space-y-6">
      {/* Bento Grid: Top Row - Map + Driver List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Box 1: Interactive Map (70-75% width) */}
        <div className="lg:col-span-3 h-[450px]">
          <InteractiveMap drivers={drivers} onDriverClick={onViewDetails} />
        </div>

        {/* Box 2: Driver List Panel (25-30% width) */}
        <div className="lg:col-span-1 h-[450px]">
          <DriverListPanel drivers={drivers} onDriverClick={onViewDetails} />
        </div>
      </div>

      {/* Box 3: Weather Widget (Full Width) - 별도 행 */}
      <div className="w-full">
        <WeatherWidget />
      </div>
    </div>
  );
}