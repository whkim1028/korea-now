// Black White Chef Episode Type (from DB)
export interface BlackWhiteChefEpisode {
  id: number;
  season: number;
  episode: number;
  region: string; // 숫자 코드 (예: "13")
  region_name: string; // 한글 지역명 (예: "전남")
  region_detail: string; // 숫자 코드 (예: "602")
  region_detail_name: string; // 한글 세부지역명 (예: "진도")
  region_detail_name_eng: string; // 영문 세부지역명 (예: "Jindo")
  related_chef: string; // 셰프 이름들 (예: "Choi Kang-rok vs Musipal")
  episode_desc: string; // 영어 설명
  image_srcs: string[]; // 이미지 URL 배열
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// UI에서 사용할 가공된 타입
export interface BlackWhiteChefCard {
  id: number;
  episode: number;
  regionCode: string; // 영문 코드 (예: "JEONNAM")
  regionName: string; // 영문 지역명 (예: "Jeonnam")
  regionDetailName: string; // 영문 세부지역명 (예: "Jindo")
  ingredient: string; // 재료명 추출 (예: "Green Onion")
  description: string; // 짧은 설명
  chefs: string; // 셰프 이름
  thumbnail: string | null; // 썸네일 이미지 (추후 추가)
}

// 한글 지역명 → 영문 Region 코드 매핑
export const REGION_NAME_TO_CODE: Record<string, string> = {
  '강원': 'GANGWON',
  '경기': 'GYEONGGI',
  '경남': 'GYEONGNAM',
  '경북': 'GYEONGBUK',
  '광주': 'GWANGJU',
  '대구': 'DAEGU',
  '대전': 'DAEJEON',
  '부산': 'BUSAN',
  '서울': 'SEOUL',
  '세종': 'SEJONG',
  '울산': 'ULSAN',
  '인천': 'INCHEON',
  '전남': 'JEONNAM',
  '전북': 'JEONBUK',
  '제주도': 'JEJU',
  '제주': 'JEJU',
  '충남': 'CHUNGNAM',
  '충북': 'CHUNGBUK',
};

// 영문 지역명 표시용 (카드에 보여줄 이름)
export const REGION_NAME_TO_DISPLAY: Record<string, string> = {
  '강원': 'Gangwon',
  '경기': 'Gyeonggi',
  '경남': 'Gyeongnam',
  '경북': 'Gyeongbuk',
  '광주': 'Gwangju',
  '대구': 'Daegu',
  '대전': 'Daejeon',
  '부산': 'Busan',
  '서울': 'Seoul',
  '세종': 'Sejong',
  '울산': 'Ulsan',
  '인천': 'Incheon',
  '전남': 'Jeonnam',
  '전북': 'Jeonbuk',
  '제주도': 'Jeju',
  '제주': 'Jeju',
  '충남': 'Chungnam',
  '충북': 'Chungbuk',
};
