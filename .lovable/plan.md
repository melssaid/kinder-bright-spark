

# Kindergarten Child Development Tracking App — Implementation Plan

## Overview
Build a full-featured kindergarten dashboard with 10 core widgets, sidebar navigation, pastel design system, mock data for 3 children, and responsive layout.

## Design System Updates

Update `src/index.css` with a playful pastel color palette:
- Primary: soft indigo/purple
- Accent colors for categories: pastel green (social), pastel blue (cognitive), pastel orange (emotional), pastel pink (health)
- Larger border-radius defaults
- Soft shadows

## Project Structure

```text
src/
├── data/
│   └── mockData.ts              # All mock data for 3 children
├── components/
│   ├── layout/
│   │   ├── AppSidebar.tsx       # Sidebar navigation
│   │   └── DashboardLayout.tsx  # SidebarProvider + header + main
│   ├── dashboard/
│   │   ├── ChildSelector.tsx    # Dropdown to switch between children
│   │   ├── DevelopmentalTracker.tsx   # LineChart: focus, play, learning
│   │   ├── AttentionRadar.tsx         # Gauge + recommendation cards
│   │   ├── DailyMoodScale.tsx         # Emoji timeline + alerts
│   │   ├── LearningStyleProfile.tsx   # RadarChart
│   │   ├── SocialInteractionAnalyzer.tsx # Peer interaction list
│   │   ├── SpeechLanguageCard.tsx     # Vocab/sentence benchmarks
│   │   ├── EarlyTalentDiscoverer.tsx  # Skill badges
│   │   └── NutritionAssistant.tsx     # Nutrient progress bars
│   └── NavLink.tsx (existing)
├── pages/
│   ├── Index.tsx                # Teacher Dashboard (hub with all widgets)
│   ├── EmotionalSkillsCoach.tsx # Scenario cards page
│   ├── BehaviorTranslator.tsx   # Split-screen teacher↔parent notes
│   ├── NutritionPage.tsx        # Full nutrition view
│   └── NotFound.tsx (existing)
└── App.tsx                      # Routes
```

## Mock Data (`src/data/mockData.ts`)

3 children (Lina, Omar, Sophie) each with:
- Daily focus/play/learning scores (7 days)
- Attention scores + behavioral logs
- Mood entries with timestamps and emoji types
- Learning style scores (Visual/Auditory/Kinesthetic/Social)
- Peer interaction records
- Vocabulary size, sentence length, age benchmarks
- Skill badges (Artistic, Logical, Motor)
- Nutrition logs with calories/protein/carbs/vitamins

## Pages & Routes

| Route | Page | Content |
|-------|------|---------|
| `/` | Teacher Dashboard | Grid of all 10 widgets with child selector |
| `/emotional-coach` | Emotional Skills Coach | Scenario cards (Anger, Sharing, Waiting) |
| `/behavior-translator` | Behavior Translator | Split-screen teacher notes → parent message |
| `/nutrition` | Nutrition Page | Full lunchbox tracker + meal plans |

## Sidebar Navigation

Using shadcn Sidebar with `collapsible="icon"`, items:
- Dashboard (LayoutDashboard)
- Emotional Coach (Heart)
- Behavior Translator (MessageSquare)
- Nutrition (Apple)

Pastel-styled with rounded elements, playful icons.

## Component Details

1. **DevelopmentalTracker** — Recharts LineChart with 3 lines (focus, play, learning) over 7 days
2. **AttentionRadar** — Circular progress gauge (0-100) + 2-3 recommendation cards with colored borders
3. **DailyMoodScale** — Horizontal timeline with emoji buttons (😊😐😤) + alert badge for shifts
4. **LearningStyleProfile** — Recharts RadarChart with 4 axes
5. **SocialInteractionAnalyzer** — List of peers with interaction frequency bars and integration level badges
6. **EmotionalSkillsCoach** — Card grid with scenario illustrations, response options, AI assessment badges
7. **BehaviorTranslator** — Two side-by-side textareas with a "Translate" button generating empathetic text + 3-day action plan
8. **EarlyTalentDiscoverer** — Badge grid showing skill proficiency levels with star ratings
9. **SpeechLanguageCard** — Metric cards with progress bars comparing child vs benchmark
10. **NutritionAssistant** — Lunchbox visual with calorie/nutrient progress bars + suggested meals

## Responsive Strategy

- Dashboard: 1 column on mobile, 2-3 columns on desktop
- Sidebar: offcanvas on mobile, persistent on desktop
- Cards stack vertically on small screens

## Implementation Order

All files will be created in a single pass:
1. Mock data file
2. Layout components (sidebar, dashboard layout)
3. All 10 widget components
4. All 4 pages
5. Updated App.tsx with routes
6. Updated index.css with pastel theme

