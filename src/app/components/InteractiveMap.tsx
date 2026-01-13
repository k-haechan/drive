/// <reference path="../../types/naver.d.ts" />
import { useEffect, useRef, useState } from "react";
import { Navigation } from "lucide-react";
import { Driver } from "./DriverTable";

interface InteractiveMapProps {
  drivers: Driver[];
  onDriverClick?: (driver: Driver) => void;
}

interface Region {
  name: string;
  lat: number;
  lng: number;
  drivers: Driver[];
}

export function InteractiveMap({ drivers, onDriverClick }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<naver.maps.Map | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);
  const infoWindowsRef = useRef<naver.maps.InfoWindow[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // 1. 지역 그룹화 로직
  const regions: Region[] = [
    { name: "서울 강남구", lat: 37.5, lng: 127.05, drivers: drivers.filter(d => d.location.includes("강남")) },
    { name: "경기 수원시", lat: 37.3, lng: 127.0, drivers: drivers.filter(d => d.location.includes("수원")) },
    { name: "서울 송파구", lat: 37.52, lng: 127.12, drivers: drivers.filter(d => d.location.includes("송파")) },
    { name: "인천 남동구", lat: 37.45, lng: 126.7, drivers: drivers.filter(d => d.location.includes("인천")) },
    { name: "서울 마포구", lat: 37.56, lng: 126.9, drivers: drivers.filter(d => d.location.includes("마포")) },
    { name: "부산 해운대구", lat: 35.16, lng: 129.16, drivers: drivers.filter(d => d.location.includes("부산")) },
  ];

  const criticalDrivers = drivers.filter(d => d.status === "위급" || d.status === "위험");

  // 2. 스크립트 로드 로직 (ncpClientId로 수정)
  useEffect(() => {
    const clientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID || "1kh591ouem";
    
    if (window.naver && window.naver.maps) {
      setIsMapLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.type = "text/javascript";
    // ncpKeyId -> ncpClientId로 수정
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
    script.async = true;
    script.onload = () => setIsMapLoaded(true);
    document.head.appendChild(script);
  }, []);

  // 3. 지도 초기화 및 마커 생성 (Event 리스너 수정)
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || !window.naver?.maps) return;

    if (!mapInstanceRef.current) {
      const map = new window.naver.maps.Map(mapRef.current, {
        center: new window.naver.maps.LatLng(37.5665, 126.9780),
        zoom: 10,
      });
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // 기존 마커 정리
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    regions.forEach((region) => {
      const hasCritical = region.drivers.some(d => d.status === "위급" || d.status === "위험");
      const markerColor = hasCritical ? "#DC2626" : "#2563EB";

      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(region.lat, region.lng),
        map: map,
        icon: {
          content: `<div style="width:30px; height:30px; background:${markerColor}; border-radius:50%; border:2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; color:white; font-size:12px;">📍</div>`,
          anchor: new window.naver.maps.Point(15, 15),
        }
      });

      const infoWindow = new window.naver.maps.InfoWindow({
        content: `<div style="padding:10px; font-size:12px;"><b>${region.name}</b><br/>운전자: ${region.drivers.length}명</div>`
      });

      // ERROR FIX: maps.event -> naver.maps.Event로 수정
      window.naver.maps.Event.addListener(marker, "click", () => {
        infoWindowsRef.current.forEach(iw => iw.close());
        infoWindow.open(map, marker);
      });

      markersRef.current.push(marker);
      infoWindowsRef.current.push(infoWindow);
    });
  }, [isMapLoaded, drivers]);

  return (
    <div className="bg-white rounded-lg shadow border h-full flex flex-col overflow-hidden">
      <div className="px-6 py-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center">
          <Navigation className="w-5 h-5 mr-2 text-blue-600" /> 실시간 차량 위치
        </h3>
      </div>
      <div className="flex-1 relative">
        <div 
          ref={mapRef} 
          style={{ width: "100%", height: "100%", minHeight: "450px" }} 
        />
      </div>
    </div>
  );
}