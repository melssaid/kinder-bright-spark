
-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  school_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

-- Students table
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male','female')),
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers manage own students" ON public.students FOR ALL TO authenticated USING (teacher_id = auth.uid()) WITH CHECK (teacher_id = auth.uid());

-- Surveys table
CREATE TABLE public.surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date TIMESTAMPTZ DEFAULT now(),
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  analysis JSONB
);
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers manage own surveys" ON public.surveys FOR ALL TO authenticated USING (teacher_id = auth.uid()) WITH CHECK (teacher_id = auth.uid());

-- Attendance table
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('present','absent','late','excused')),
  UNIQUE(student_id, date)
);
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers manage own attendance" ON public.attendance FOR ALL TO authenticated USING (teacher_id = auth.uid()) WITH CHECK (teacher_id = auth.uid());

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, school_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'school_name', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
