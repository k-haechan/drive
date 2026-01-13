import { Driver } from '../app/components/DriverTable';

// 수도권 중심(강남)으로 분산된 위치 목록
const locations = [
  // 서울(강남 중심)
  "서울 강남구 테헤란로",
  "서울 강남구 역삼동",
  "서울 강남구 논현동",
  "서울 강남구 신사동",
  "서울 강남구 청담동",
  "서울 강남구 삼성동",
  // 서울 기타
  "서울 송파구 잠실동",
  "서울 마포구 상암동",
  "서울 용산구 이촌동",
  "서울 성동구 성수동",
  // 경기 남부
  "경기 성남시 분당구 정자동",
  "경기 용인시 수지구 죽전동",
  "경기 수원시 영통구 망포동",
  "경기 하남시 미사동",
  "경기 과천시 중앙로",
  // 경기 북/서부 & 인천
  "경기 고양시 일산서구 주엽동",
  "경기 부천시 중동",
  "경기 김포시 구래동",
  "경기 의정부시 민락동",
  "인천 연수구 송도동",
];

const names = [
  "김민수", "박지영", "이철호", "정수진", "최동욱", "한서연",
  "윤태현", "강미영", "송준혁", "임지은", "오성호", "배수아",
  "전혜진", "조민석", "황서윤", "신동욱", "유나영", "홍준호",
  "문지혜", "양성훈", "남다은", "고민준", "노서연", "류태영",
  "마지은", "방현우", "서유진", "안준호", "엄지혜", "원동욱",
];

const vehicleTypes = [
  "현대 포터II", "기아 봉고III", "현대 마이티", "기아 카니발",
  "현대 스타렉스", "기아 레이", "현대 그랜드 스타렉스", "기아 쏘울",
  "현대 싼타페", "기아 셀토스", "현대 코나", "기아 니로",
  "현대 아반떼", "기아 K3", "현대 소나타", "기아 K5",
];

const statuses: Driver['status'][] = ["정상", "주의", "위험", "위급"];
const riskTypes: Driver['riskType'][] = ["정상", "음주", "졸음", "과속", "난폭운전"];
const riskCycle: Driver['riskType'][] = ["음주", "졸음", "과속", "난폭운전"];
const drivingStatuses: Driver['drivingStatus'][] = ["주행중", "휴식중"];

// 랜덤 데이터 생성 함수
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDriver(id: string, name: string, status?: Driver['status'], locationOverride?: string): Driver {
  const resolvedStatus = status ?? getRandomElement(statuses);
  const riskType =
    resolvedStatus === "정상"
      ? "정상"
      : riskCycle[(parseInt(id.replace(/\D/g, ""), 10) || 0) % riskCycle.length];
  const location = locationOverride ?? getRandomElement(locations);
  const drivingStatus = getRandomElement(drivingStatuses);

  // 상태에 따른 위험도 조정
  let riskLevel: number;
  switch (resolvedStatus) {
    case "위급":
      riskLevel = getRandomInt(85, 100);
      break;
    case "위험":
      riskLevel = getRandomInt(70, 84);
      break;
    case "주의":
      riskLevel = getRandomInt(50, 69);
      break;
    default:
      riskLevel = getRandomInt(0, 49);
  }

  const timeAgo = getRandomInt(1, 30);
  const monthlyMinutes = getRandomInt(1500, 3000);
  const todayMinutes = getRandomInt(60, 400);
  const averageScore = getRandomInt(75, 95);

  const driver: Driver = {
    id,
    name,
    status: resolvedStatus,
    riskType,
    location,
    time: `${timeAgo}분 전`,
    riskLevel,
    vehicleType: getRandomElement(vehicleTypes),
    monthlyDrivingMinutes: monthlyMinutes,
    todayDrivingMinutes: todayMinutes,
    averageScore,
    drivingStatus,
  };

  if (drivingStatus === "주행중") {
    driver.drivingStartTime = Date.now() - getRandomInt(10, 180) * 60000;
  }

  return driver;
}

// 30명의 운전자 데이터 생성 (상태 패턴 + 수도권 위치 분산)
export const mockDrivers: Driver[] = names.map((name, index) => {
  const id = `DRV-${String(index + 1).padStart(3, '0')}`;
  const status = statuses[index % statuses.length];
  const location = locations[index % locations.length];
  return generateDriver(id, name, status, location);
});

// 데모에 사용할 초기 데이터 (mockDrivers를 그대로 사용)
export const initialMockDrivers: Driver[] = mockDrivers;
