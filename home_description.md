# 우리의 새로운 목표

## 1. 블로그가 아니라 현지인들이 진짜로 좋아하는 로컬 맛집의 리스트 검색과 추천이 먼저

### 1) home 화면의 첫번째로 레스토랑 리스트가 보여지도록 구현

### 2) 이때 지역별 검색창 필요(콤보박스로 지역 선택) 

#### 지역별로 검색하기 위한 테이블 관계 설명

-- popular_restaurants.region이 지역 코드임
-- 지역코드 리스트 추출 쿼리 :
select 
    substring(region_name FROM '^[^ ]+')
  from koreanow.popular_restaurants_localizations
  group by substring(region_name FROM '^[^ ]+'); ; 
  
  -- 이때 Gangnam과 Gangbuk은 Seoul이라는 큰 카테고리로 분류. 
  -- 즉, Seoul을 선택하면 Gangnam과 Gangbuk이 모두 나오고, Gangbuk이나 Gangnam만 별개로 선택할 수도 있도록 구현. 
  --     substring(region_name FROM '^[^ ]+')여기서 지역코드 추출할 때는 모두 대문자로 변환하여 작업
  

#### 지역 검색은 간단하게 메인 메뉴에서 지역 검색할 수 있도록 구현

-- https://tabelog.com/kr/ (타베로그) 이 사이트의 메인 uiux를 참고하면 됨.

### 3) 블로그 글(현재 메인에 가장 위에 있는)과 editorial 메뉴는 서브메뉴로 구성

### 4) 그 외 서브 메뉴 (구현 예정) 고려하여 메인화면 레이아웃 개발
-- 1) 유튜브에 실시간 인기있는 먹방 컨텐츠
-- 2) 한국 로컬 커뮤니티의 음식에 대한 인기글들
