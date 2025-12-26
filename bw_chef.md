# KoreaNow × 흑백요리사

## Special Section PRD v1.2

**(Broadcast Image Usage Included)**

> 📌 본 문서는 **방송 공식 포스터 및 회차별 대결 캡처 이미지 사용을 전제로 한 PRD v1.2**이다.  
> 모든 방송 이미지는 **부분 크롭 + 가공 후 `public/` 정적 자산으로 관리**한다.

---

## 1. Overview

### Section Name

**From Screen to Table**  
_As featured in 흑백요리사: 요리 계급 전쟁 (Netflix)_

> 내부 코드명: `black-white-chef-special`

### Placement

- Main Page
- Hero Section 바로 아래
- Region Search 섹션 위

### Goal

방송 콘텐츠(흑백요리사)를 **강력한 진입 훅**으로 활용하되,  
궁극적으로 사용자를 **한국 지역 음식 문화 및 실제 로컬 맛집 탐색**으로 유도한다.

---

## 2. Page Layout (Global)

┌─────────────────────────────────────────┐
│ Hero Section │
│ "What Koreans Are Really Eating..." │
└─────────────────────────────────────────┘
↓
┌─────────────────────────────────────────┐
│ From Screen to Table (Special Section) │
│ ← 본 PRD 대상 │
└─────────────────────────────────────────┘
↓
┌─────────────────────────────────────────┐
│ Region Search │
│ "Where Are Koreans Eating Right Now?" │
└─────────────────────────────────────────┘
↓
┌─────────────────────────────────────────┐
│ Restaurant List + Filters │
└─────────────────────────────────────────┘

yaml
코드 복사

---

## 3. Special Section – Header Design

### 3.1 Header Copy

#### Primary Title

**Regional Food Battles on Screen**

#### Secondary Copy

_Discover real Korean regional foods you saw on screen —  
and where locals actually eat them._

#### Meta Information

- Season X · Round 2
- Episodes 4–7
- Team Battle

> ⚠️ 시즌/라운드 정보는 **보조 정보**  
> 핵심 메시지는 항상 **지역 음식 중심**

---

### 3.2 Visual Treatment

🔄 **[UPDATED – Broadcast Image Usage]**

- 방송 **공식 시즌 포스터 사용 허용**
- 위치:
  - 섹션 헤더 좌측 또는 우측
  - Opacity 10~20% 또는 카드형 썸네일
- 목적:
  - “이 섹션은 해당 프로그램에서 출발했다”는 **맥락 제공**
- 금지:
  - 포스터 단독 히어로 구성 ❌
  - 방송 홍보 페이지처럼 보이는 레이아웃 ❌

---

## 4. Episode Card Grid (Core Content)

### 4.1 Grid Layout

| Device  | Columns             |
| ------- | ------------------- |
| Desktop | 3–4                 |
| Tablet  | 2                   |
| Mobile  | 1 (Vertical Scroll) |

---

### 4.2 Episode Card Structure

🔄 **[UPDATED – Battle Capture Allowed]**

┌─────────────────────────────┐
│ [Battle / Dish Image] │ ← 방송 캡처 or 요리 이미지
│ (16:9, ~200px height) │
├─────────────────────────────┤
│ Episode 4 │
│ │
│ Jeonju · Beef │
│ │
│ Chefs (optional) │
│ ○○○ vs ×××× │
│ │
│ [Result Badge - optional] │
│ 🏆 Black Team Wins │
│ │
│ Short context (2 lines) │
│ │
│ Explore local places → │
└─────────────────────────────┘

yaml
코드 복사

---

### 4.3 Image Policy (Revised – 핵심 변경)

#### ✔ 허용 이미지 타입

1. **방송 대결 장면 캡처 (부분 크롭)**
2. 완성 요리 장면
3. 지역 특산물 / 재료 이미지

#### ❗ 필수 가공 규칙

- 원본 풀 프레임 사용 ❌
- 반드시 적용:
  - 인물 일부 크롭
  - 방송 UI / 자막 제거
  - 색감 보정 (KoreaNow 톤 통일)
- 목적:
  - “방송 장면 소개” ❌
  - “음식 맥락 전달” ⭕

---

### 4.4 Static Asset Management

🔄 **[NEW – public 폴더 기준]**

/public/images/black-white-chef/
├─ posters/
│ └─ season-x.webp
├─ episodes/
│ ├─ ep4/
│ │ ├─ battle-1.webp
│ │ ├─ battle-2.webp
│ │ └─ dish.webp
│ ├─ ep5/
│ └─ ...

markdown
코드 복사

**Rules**

- 모든 방송 이미지는 정적 자산으로 관리
- 외부 URL hotlink ❌
- 파일명은 의미 기반 (battle / dish / ingredient)

---

## 5. Episode Detail View

🔄 **[UPDATED – Image Slider Included]**

### Purpose

- 카드에서 전달하지 못한 **대결 맥락 보강**
- 단, 주인공은 항상 **지역 & 음식**

### Image Usage

- 회차별 대결 이미지 **3~5장 사용**
- 상단: 이미지 슬라이더 (battle shots)
- 하단:
  - 지역 음식 설명
  - 연결된 로컬 맛집 리스트

> ⚠️ 에피소드 상세 페이지는  
> “방송 요약 페이지”가 아니라  
> **음식 큐레이션 페이지**로 유지

---

## 6. Interaction Flow

### Primary Flow (Recommended)

Episode Card Click
↓
Scroll to Restaurant Section
↓
Auto-applied Filters
(Region + Ingredient Category)

shell
코드 복사

### URL Pattern

/restaurants?region=JEONJU&category=BEEF

yaml
코드 복사

---

## 7. Visual Design System

### Color Palette

| Usage          | Color   |
| -------------- | ------- |
| Background     | #FFFFFF |
| Primary Text   | #1A202C |
| Secondary Text | #9CA3AF |
| Card Border    | #E5E7EB |
| Hover BG       | #F9FAFB |
| Black Team     | #000000 |
| White Team     | #D1D5DB |

### Typography

- Title: KoreaNow Serif, 32px, Bold
- Subtitle: 16px, Light
- Card Text: Sans-serif, 12–14px
- Tags/Badges: 10–12px

---

## 8. Content Rules

🔄 **[UPDATED – Broadcast Context Allowed]**

- 방송 언급은 **사실 서술만 허용**
- 감정적·서사적 표현 최소화
- “누가 이겼다”보다  
  → “어떤 지역·재료가 주목받았다”에 초점

---

## 9. Post-Broadcast Transition Plan

🔄 **[UPDATED – Image Retained]**

- Section Title:
  **From Screen to Table (Archive)**
- 안내 문구:
  > _This collection was inspired by a trending Korean cooking show and curated during its broadcast period._
- 포스터 및 에피소드 이미지 유지
- 메인 최상단 고정 ❌ → 하단 섹션 이동
- 상단 메뉴: **Special**

---

## 10. KPI

- Episode Card CTR
- Filtered Restaurant List Views
- Avg. Session Duration
- Restaurant Detail Clicks

---

## 11. Change Log (v1.1 → v1.2)

| Area         | Change                        |
| ------------ | ----------------------------- |
| Image Policy | 방송 캡처 이미지 공식 허용    |
| Header       | 시즌 포스터 사용 명시         |
| Card         | 대결 캡처 이미지 사용         |
| Detail View  | 회차별 3~5장 이미지 슬라이더  |
| Asset        | `public/` 정적 자산 구조 명시 |
| Risk         | 크롭·가공·비중 통제 규칙 추가 |

---

## 12. Final Summary

- Placement: Hero 바로 아래
- Role: 방송 콘텐츠 → 로컬 음식 브리지
- Interaction: Card → 기존 필터 UX
- Design: Minimal, Food-first
- Lifecycle: Broadcast Boost → Archive Asset

> 본 PRD v1.2는  
> **KoreaNow 메인 트래픽을 견인하는 실전 콘텐츠 섹션**을 목표로 한다.

** 데이터베이스 구조와 스키마 **

1. 테이블명 : black_white_chef

- 흑백요리사 회차 및 대결라운드 정보 테이블 (지역, 지역에서 세부지역, 대결 쉐프명, 대결재료, 대결내용 등등)

2. 테이블명 : bw_chef_intf_popular_restaurants

- black_white_chef 테이블과 popular_restaurants 테이블을 매핑하는 중계 테이블

3. popular_restaurants에 해당 black_white_chef의 지역에 대한 레스토랑 리스트를 가져오고 그 이후부터는 큐 메시지를 보내 llm번역처리, 가게 상세 정보 등록 등의 프로세스는 동일하게 유지
