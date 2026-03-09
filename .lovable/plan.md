

# خطة: نظام أكواد الدعوة + إدارة الروضات المتعددة

## الفكرة
بدلاً من التسجيل الحر، **الأدمن فقط** ينشئ أكواد دعوة ويعطيها للمعلمات. كل معلمة تنتمي لروضة محددة ولا ترى بيانات غيرها. الأدمن يرى كل شيء.

---

## التغييرات المطلوبة

### 1. قاعدة البيانات (4 جداول جديدة + تعديل)

```text
kindergartens          invitation_codes         user_roles
┌──────────────┐      ┌───────────────────┐    ┌──────────────┐
│ id (uuid)    │      │ id (uuid)         │    │ id (uuid)    │
│ name         │◄─────│ kindergarten_id   │    │ user_id      │
│ created_by   │      │ code (unique)     │    │ role (enum)  │
│ created_at   │      │ created_by        │    └──────────────┘
└──────────────┘      │ used_by (nullable)│    admin | teacher
                      │ expires_at        │
                      └───────────────────┘

تعديل الجداول الحالية:
- profiles: + kindergarten_id (nullable, FK)
- students: + kindergarten_id (nullable, FK)
```

- إنشاء `app_role` enum بقيمتي `admin` و `teacher`
- إنشاء `user_roles` مع RLS عبر `has_role()` security definer function
- إنشاء `kindergartens` و `invitation_codes` مع RLS مناسبة
- إضافة `kindergarten_id` لـ `profiles` و `students`

### 2. صفحة تسجيل الدخول المعدّلة
- إزالة خيار "إنشاء حساب" الحر
- إضافة حقل **"كود الدعوة"** — المعلمة تدخل الكود + بياناتها → النظام يتحقق من الكود ويربطها بالروضة تلقائياً
- أول مستخدم يُعيَّن كأدمن تلقائياً (أو عبر seed في قاعدة البيانات)

### 3. لوحة تحكم الأدمن (صفحات جديدة)
- **صفحة `/admin/kindergartens`**: إضافة/تعديل روضات
- **صفحة `/admin/teachers`**: عرض المعلمات لكل روضة + توليد أكواد دعوة
- **صفحة `/admin`**: إحصائيات عامة (عدد الروضات، المعلمات، الطلاب)
- حماية بـ `AdminRoute` يتحقق من الدور عبر `user_roles`

### 4. تعديل الصفحات الحالية
- `AppSidebar`: إظهار روابط الأدمن فقط للأدمن
- `DashboardLayout`: عرض اسم الروضة للمعلمة
- تحديث RLS: المعلمة ترى طلاب روضتها فقط (أو طلابها فقط حسب `teacher_id`)

### 5. آلية العمل
```text
أدمن → ينشئ روضة → يولّد كود دعوة → يعطيه للمعلمة
معلمة → تدخل الكود في صفحة التسجيل → حسابها يُربط بالروضة
معلمة → ترى طلابها فقط | أدمن → يرى كل الروضات والمعلمات
```

### التفاصيل التقنية
- **الملفات الجديدة**: `src/pages/admin/AdminDashboard.tsx`, `AdminKindergartens.tsx`, `AdminTeachers.tsx`, `src/hooks/useRole.tsx`
- **الملفات المعدّلة**: `AuthPage.tsx`, `App.tsx`, `AppSidebar.tsx`, `DashboardLayout.tsx`, `database.ts`, `useAuth.tsx`
- **Edge function**: `generate-invite-code` لتوليد أكواد آمنة
- **Migration**: إنشاء الجداول + enum + function + RLS policies

