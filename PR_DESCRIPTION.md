# Summary
- Refactor app architecture into feature-oriented modules
- Introduce service layer and reusable query hooks
- Decouple UI from direct database access
- Add parent communication foundation
- Prepare analysis flow for parent-facing reports and delivery tracking

# Why
The current app mixes UI, data fetching, and business logic inside page components such as dashboard, survey flow, and history view. It also lacks a proper data model for parent communication and currently shares reports through a manual WhatsApp deep link only.

# Included
- Shared domain types
- Typed analysis contract
- Students / assessments / analysis services
- Parent reports foundation
- Message delivery tracking foundation
- File map for refactoring `Index`, `SurveyPage`, `SurveyForm`, and `HistoryPage`

# Not included yet
- Direct WhatsApp Business API sending
- Automatic PR creation from ChatGPT
- Full parent portal UI

# Test checklist
- Dashboard loads via hooks and not direct database calls
- Survey submission still creates record and saves analysis
- History screen still shows past analyses
- Parent report payload can be generated from an analysis result
- Message delivery records can be created with `pending` status
