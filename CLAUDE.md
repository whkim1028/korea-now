# KoreaNow – Build Brief (Web)

## Goal
Build a content-first web experience using existing translated data.

## Pages
- Home
- Editorial List
- Editorial Detail
- Restaurant List
- Restaurant Detail
- Glossary

## Data Usage
- Use translated tables only (lang = 'en')
- No LLM calls in frontend
- No crawling logic in frontend

## Page ↔ Table Mapping
(Home)
- editorials_translations.summary_short
- editorials_translations.hero_image

(Editorial Detail)
- editorial_content_translations.content_translated
- glossary (jsonb)

(Restaurant Detail)
- popular_restaurants_translations
- popular_restaurant_detail_translations

## Design Direction
- Layout: Eater
- Tone: Condé Nast Traveler
- Typography > animations

## Non-goals
- No login
- No personalization
- No comments

#Supabase   connection Infomation
 "SUPABASE_URL": "https://ekxyxvpdwurgrvimagcg.supabase.co",
    "SUPABASE_SERVICE_ROLE_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVreHl4dnBkd3VyZ3J2aW1hZ2NnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTE1ODU4OSwiZXhwIjoyMDc2NzM0NTg5fQ.wTaxyLLIq6r38lkbwjUy2lqdoSPKXPiHFq0ATigoJVM", 
anonkey : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVreHl4dnBkd3VyZ3J2aW1hZ2NnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNTg1ODksImV4cCI6MjA3NjczNDU4OX0.Vv7SKECOigVMiHBiFNwDna-wYq7pxdTP4FgJVupuFP8


#supabase database information 
This document describes how the KoreaNow web client should read data from Supabase.
All crawling, LLM translation, and data processing are already completed.
The frontend MUST only read existing translated data.
---
## 1. General Rules

- Database: Supabase (PostgreSQL)
- Schema: `koreanow`
- Language: **English only**
  - Always query with `lang = 'en'`
- Frontend responsibilities:
  - Read-only access

---

## 2. Core Concept

All original (Korean) data is stored in base tables.
All translated / summarized / localized content is stored in `*_translations` tables.

Frontend MUST use:
- `*_translations` tables for rendering content
- Join logic based on `(site, url, lang)`
- No foreign keys are required

---

## 3. Tables Overview

### Editorial (List / Metadata)

**Source**
- `koreanow.food_editorial_posts`

**Translated**
- `koreanow.food_editorial_posts_translations`

Used for:
- Home (featured editorial)
- Editorial list page
- Editorial detail header

---

### Editorial Content (Full Body)

**Source**
- `koreanow.food_editorial_post_content`

**Translated**
- `koreanow.food_editorial_post_content_translations`

Used for:
- Editorial detail main body

---

### Restaurant List

**Source**
- `koreanow.popular_restaurants`

**Translated**
- `koreanow.popular_restaurants_translations`

Used for:
- Restaurant list page
- Editorial → restaurant blocks
- Restaurant detail header

---

### Restaurant Detail

**Source**
- `koreanow.popular_restaurant_detail`

**Translated**
- `koreanow.popular_restaurant_detail_translations`

Used for:
- Restaurant detail page (full information)

---

## 4. Page-by-Page Data Usage

---

### 4.1 Home Page (`/`)

Purpose:
- Introduce KoreaNow
- Highlight featured editorial content

Use tables:
- `food_editorial_posts_translations`

Required fields:
- `title_translated`
- `summary_short`
- `summary_bullets` (optional)
- `image_url` (from source table if needed)
- `url`

Filter:
- `lang = 'en'`

---

### 4.2 Editorial List Page (`/editorials`)

Use tables:
- `food_editorial_posts_translations`

Fields:
- `title_translated`
- `summary_short`
- `url`
- `site`
- `created_at`

Optional filters:
- theme / region (if metadata exists)

---

### 4.3 Editorial Detail Page (`/editorials/{slug}`)

#### Header Section
Use:
- `food_editorial_posts_translations`

Fields:
- `title_translated`
- `summary_translated`
- `summary_short`
- `summary_bullets`
- `glossary`

Join condition:
- `site + url + lang = 'en'`

---

#### Main Content Section
Use:
- `food_editorial_post_content_translations`

Fields:
- `content_translated`
- `content_summary`
- `content_bullets`
- `glossary`

---

#### Restaurant Blocks (inside editorial)
Use:
- `popular_restaurants_translations`

Fields:
- `name_translated`
- `short_description`
- `region`
- `url`

---

### 4.4 Restaurant List Page (`/restaurants`)

Use tables:
- `popular_restaurants_translations`

Fields:
- `name_translated`
- `summary_short`
- `region`
- `url`

Sorting:
- By relevance or recency

---

### 4.5 Restaurant Detail Page (`/restaurants/{slug}`)

#### Header
Use:
- `popular_restaurants_translations`

Fields:
- `name_translated`
- `summary_short`
- `summary_bullets`
- `glossary`

---

#### Detail Content
Use:
- `popular_restaurant_detail_translations`

Fields:
- `content_translated`
- `menu_translated`
- `tips_translated`
- `glossary`

---

### 4.6 Glossary Page (`/glossary`)

Use glossary fields aggregated from:
- `food_editorial_posts_translations.glossary`
- `food_editorial_post_content_translations.glossary`
- `popular_restaurants_translations.glossary`
- `popular_restaurant_detail_translations.glossary`

Format:
- Key-value list
- Alphabetical order

---

## 5. Notes for Implementation

- Treat glossary as structured JSON (`jsonb`)
- Inline glossary rendering is preferred (hover or expandable)
- Do not assume all records have glossary data
- Always handle empty/null gracefully

---

## 6. Explicit Non-Goals

- No Korean text rendering
- No translation logic
- No crawler logic
- No LLM API calls
- No authentication / user accounts

---

## 7. Design Direction Reminder

- Layout reference: https://www.eater.com
- Editorial tone reference: https://www.cntraveler.com
- Focus on:
  - Typography
  - Readability
  - Spacing
- Avoid:
  - Over-animation
  - Heavy UI effects

---

End of document.
