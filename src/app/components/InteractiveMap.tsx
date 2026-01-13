/// <reference path="../../types/naver.d.ts" />
import React, { useEffect, useRef, useState } from "react";
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

  // 1. 지역 그룹화 로직 (수도권 중심, 강남 우선)
  const regions: Region[] = [
    { name: "서울 강남구", lat: 37.4979, lng: 127.0276, drivers: drivers.filter(d => d.location.includes("강남")) },
    { name: "서울 송파구", lat: 37.5146, lng: 127.1061, drivers: drivers.filter(d => d.location.includes("송파")) },
    { name: "서울 마포구", lat: 37.5665, lng: 126.9018, drivers: drivers.filter(d => d.location.includes("마포")) },
    { name: "서울 용산구", lat: 37.5311, lng: 126.9810, drivers: drivers.filter(d => d.location.includes("용산")) },
    { name: "경기 성남시", lat: 37.3770, lng: 127.1150, drivers: drivers.filter(d => d.location.includes("성남") || d.location.includes("분당")) },
    { name: "경기 용인시", lat: 37.3229, lng: 127.0947, drivers: drivers.filter(d => d.location.includes("용인") || d.location.includes("수지") || d.location.includes("죽전")) },
    { name: "경기 수원시", lat: 37.2636, lng: 127.0286, drivers: drivers.filter(d => d.location.includes("수원")) },
    { name: "경기 하남시", lat: 37.5410, lng: 127.2060, drivers: drivers.filter(d => d.location.includes("하남")) },
    { name: "경기 과천시", lat: 37.4292, lng: 126.9876, drivers: drivers.filter(d => d.location.includes("과천")) },
    { name: "경기 고양시", lat: 37.6747, lng: 126.7476, drivers: drivers.filter(d => d.location.includes("고양") || d.location.includes("일산")) },
    { name: "경기 부천시", lat: 37.5034, lng: 126.7660, drivers: drivers.filter(d => d.location.includes("부천")) },
    { name: "경기 김포시", lat: 37.6176, lng: 126.7150, drivers: drivers.filter(d => d.location.includes("김포")) },
    { name: "경기 의정부시", lat: 37.7380, lng: 127.0330, drivers: drivers.filter(d => d.location.includes("의정부")) },
    { name: "인천 연수구", lat: 37.4100, lng: 126.6780, drivers: drivers.filter(d => d.location.includes("인천") || d.location.includes("송도")) },
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
    script.onload = () => {
      // API가 완전히 로드될 때까지 약간의 지연
      setTimeout(() => setIsMapLoaded(true), 100);
    };
    script.onerror = () => {
      console.error("네이버 지도 API 스크립트 로드 실패");
    };
    document.head.appendChild(script);
  }, []);

  // 3. 지도 초기화 및 마커 생성 (Event 리스너 수정)
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || !window.naver?.maps) return;

    if (!mapInstanceRef.current) {
      const map = new window.naver.maps.Map(mapRef.current, {
        center: new window.naver.maps.LatLng(37.4979, 127.0276), // 서울 강남구 중심
        zoom: 11, // 수도권을 한눈에 볼 수 있도록 확대/축소
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

      // 마커 클릭 이벤트
      // 네이버 지도 API v3는 Event (대문자) 사용
      if (window.naver.maps.Event && window.naver.maps.Event.addListener) {
        window.naver.maps.Event.addListener(marker, "click", () => {
          infoWindowsRef.current.forEach(iw => iw.close());
          infoWindow.open(map, marker);
        });
      }

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