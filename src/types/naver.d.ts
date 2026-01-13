// 네이버 지도 API 타입 정의
/// <reference types="vite/client" />

declare namespace naver {
  namespace maps {
    class Map {
      constructor(element: HTMLElement | string, options: MapOptions);
      setCenter(latlng: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
      getCenter(): LatLng;
      getZoom(): number;
      setMapTypeId(mapTypeId: MapTypeId): void;
      panTo(latlng: LatLng | LatLngLiteral): void;
    }

    interface MapOptions {
      center: LatLng | LatLngLiteral;
      zoom: number;
      mapTypeControl?: boolean;
      mapTypeControlOptions?: MapTypeControlOptions;
      zoomControl?: boolean;
      zoomControlOptions?: ZoomControlOptions;
    }

    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    enum MapTypeId {
      NORMAL = 'normal',
      SATELLITE = 'satellite',
      HYBRID = 'hybrid',
    }

    interface MapTypeControlOptions {
      position?: Position;
    }

    interface ZoomControlOptions {
      position?: Position;
    }

    enum Position {
      TOP_LEFT = 1,
      TOP_CENTER = 2,
      TOP_RIGHT = 3,
      LEFT_TOP = 4,
      RIGHT_TOP = 5,
      LEFT_CENTER = 6,
      RIGHT_CENTER = 7,
      LEFT_BOTTOM = 8,
      RIGHT_BOTTOM = 9,
      BOTTOM_LEFT = 10,
      BOTTOM_CENTER = 11,
      BOTTOM_RIGHT = 12,
    }

    class Marker {
      constructor(options: MarkerOptions);
      setPosition(latlng: LatLng | LatLngLiteral): void;
      setMap(map: Map | null): void;
      getPosition(): LatLng;
      setIcon(icon: MarkerIcon | string): void;
      setTitle(title: string): void;
      setZIndex(zIndex: number): void;
    }

    interface MarkerOptions {
      position: LatLng | LatLngLiteral;
      map?: Map;
      icon?: MarkerIcon | string;
      title?: string;
      zIndex?: number;
      clickable?: boolean;
      draggable?: boolean;
    }

    interface MarkerIcon {
      content: string;
      size?: Size;
      anchor?: Point;
      scaledSize?: Size;
    }

    class Size {
      constructor(width: number, height: number);
      width: number;
      height: number;
    }

    class Point {
      constructor(x: number, y: number);
      x: number;
      y: number;
    }

    class InfoWindow {
      constructor(options?: InfoWindowOptions);
      open(map: Map, marker?: Marker): void;
      close(): void;
      setContent(content: string | HTMLElement): void;
      getMap(): Map | null;
    }

    interface InfoWindowOptions {
      content?: string | HTMLElement;
      maxWidth?: number;
      backgroundColor?: string;
      borderColor?: string;
      borderWidth?: number;
      anchorColor?: string;
      pixelOffset?: Point;
      position?: LatLng | LatLngLiteral;
      zIndex?: number;
    }

    class event {
      static addListener(instance: any, eventName: string, handler: Function): void;
      static removeListener(instance: any, eventName: string, handler: Function): void;
      static trigger(instance: any, eventName: string, ...args: any[]): void;
    }
  }
}

declare global {
  interface Window {
    naver?: {
      maps: typeof naver.maps;
    };
  }
}
