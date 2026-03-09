

# خطة إضافة تسجيل دخول المعلمين وقاعدة بيانات سحابية

## نظرة عامة

تحويل التطبيق من التخزين المحلي (localStorage) إلى قاعدة بيانات سحابية عبر Lovable Cloud، مع نظام تسجيل دخول للمعلمين. كل معلمة ستدير طلابها وبياناتهم بشكل مستقل.

---

## أفضل المكتبات المستخدمة

التطبيق يستخدم بالفعل مكتبات قوية، وسنضيف/نستفيد من:

1. **@supabase/supabase-js** — المصادقة وقاعدة البيانات (موجودة)
2. **@tanstack/react-query** — إدارة حالة البيانات والتخزين المؤقت (موجودة)
3. **react-hook-form + zod** — التحقق من صحة النماذج (موجودة)
4. **react-router-dom** — حماية المسارات والتوجيه (موجودة)
5. **recharts** — الرسوم البيانية (موجودة)
6. **date-fns** — معالجة التواريخ (موجودة)
7. **sonner** — إشعارات التفاعل (موجودة)

لا حاجة لمكتبات إضافية — المشروع مجهز بالكامل.

---

## قاعدة البيانات — الجداول المطلوبة

### 1. `profiles` — بيانات المعلمات
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  school_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 2. `students` — الطلاب (مربوطة بالمعلمة)
```sql
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male','female')),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 3. `surveys` — الاستقصاءات
```sql
CREATE TABLE surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date TIMESTAMPTZ DEFAULT now(),
  answers JSONB NOT NULL,
  analysis JSONB
);
```

### 4. `attendance` — الحضور والغياب
```sql
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present','absent','late','excused')),
  UNIQUE(student_id, date)
);
```

### RLS — كل معلمة ترى بياناتها فقط
- كل جدول يحتوي سياسة: `USING (teacher_id = auth.uid())` أو `USING (id = auth.uid())` للـ profiles
- Trigger لإنشاء profile تلقائياً عند التسجيل

---

## الملفات المطلوب إنشاؤها/تعديلها

### ملفات جديدة:
- **`src/pages/AuthPage.tsx`** — صفحة تسجيل الدخول/التسجيل (اسم المعلمة، البريد، كلمة المرور، اسم المدرسة)
- **`src/hooks/useAuth.tsx`** — AuthProvider + useAuth hook لإدارة الجلسة
- **`src/lib/database.ts`** — دوال CRUD للتعامل مع قاعدة البيانات بدل localStorage

### ملفات معدلة:
- **`src/App.tsx`** — إضافة AuthProvider + حماية المسارات + مسار `/auth`
- **`src/pages/Index.tsx`** — استبدال localStorage بـ database queries
- **`src/pages/StudentsPage.tsx`** — ربط بقاعدة البيانات
- **`src/pages/SurveyPage.tsx`** — ربط بقاعدة البيانات
- **`src/pages/HistoryPage.tsx`** — ربط بقاعدة البيانات
- **`src/pages/AttendancePage.tsx`** — ربط بقاعدة البيانات
- **`src/components/students/StudentManager.tsx`** — استخدام database بدل storage
- **`src/components/survey/SurveyForm.tsx`** — حفظ في قاعدة البيانات
- **`src/components/attendance/AttendanceTable.tsx`** — ربط بقاعدة البيانات
- **`src/components/attendance/AttendanceStats.tsx`** — ربط بقاعدة البيانات
- **`src/components/layout/DashboardLayout.tsx`** — إضافة اسم المعلمة + زر تسجيل خروج
- **`src/i18n/index.tsx`** — إضافة ترجمات المصادقة

---

## تدفق التطبيق

```text
المعلمة تفتح التطبيق
  ↓
غير مسجلة؟ → صفحة تسجيل الدخول/التسجيل
  ↓
مسجلة؟ → لوحة التحكم (بياناتها فقط)
  ↓
الطلاب والاستقصاءات والحضور ← قاعدة بيانات سحابية
```

## ملاحظات مهمة
- سيتم تفعيل التأكيد التلقائي للبريد لتسهيل التسجيل (ما لم ترغب بتأكيد البريد)
- البيانات المخزنة محلياً سابقاً لن تنتقل تلقائياً
- كل معلمة ترى طلابها فقط — أمان كامل عبر RLS

