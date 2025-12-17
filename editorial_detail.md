## 1. 목표 : editorial 상세 보기 페이지 구현

## 구현 방법

1. 슬러그 : food_editorial_post_content_translations의 id 컬럼
2. 가져올 데이터

1)  블로그 본문에 들어갈 컨텐츠들
    select content_summary --컨텐츠 요약
    , content_translated -- 컨텐츠 본문
    , content_bullets
    , glossary -- 용어 설명
    from koreanow.food_editorial_post_content_translations
    where url = {food_editorial_posts_translations.url}
2)  본문에 삽입할 이미지
3)           select images  -- 이미지 링크의 배열로 본문에 적당한 위치에 순서대로 배치
    from koreanow.food_editorial_post_content
    where url = {food_editorial_post_content_translations.url}

3. 본문 스타일
   깔끔한 블로그 형식으로 가독성을 보기 좋고, 디자인도 세련되게 우리 철학에 맞춰 구현
