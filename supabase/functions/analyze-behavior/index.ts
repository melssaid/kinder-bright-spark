import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { studentName, studentAge, surveyData, locale } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const isArabic = locale === "ar";

    const systemPrompt = isArabic
      ? `أنت خبير في تنمية الطفل ومتخصص في مرحلة رياض الأطفال. حلل بيانات الاستقصاء التالية للطفل وقدم تقريراً شاملاً يتضمن:
1. ملخص عام للحالة النمائية
2. نقاط القوة المُلاحظة
3. مجالات تحتاج تطوير
4. توصيات عملية للمعلم
5. رسالة تعاطفية للأهل مع خطة منزلية لـ 3 أيام
6. مؤشرات مبكرة (موهبة أو تأخر محتمل)

أجب بصيغة JSON بالهيكل التالي:
{
  "summary": "ملخص عام",
  "strengths": ["نقطة قوة 1", "نقطة قوة 2"],
  "improvements": ["مجال تحسين 1", "مجال تحسين 2"],
  "teacherRecommendations": ["توصية 1", "توصية 2"],
  "parentMessage": "رسالة للأهل",
  "actionPlan": ["اليوم 1: ...", "اليوم 2: ...", "اليوم 3: ..."],
  "indicators": { "type": "gifted|typical|delayed|mixed", "details": "التفاصيل" },
  "scores": {
    "attention": 0-100,
    "social": 0-100,
    "emotional": 0-100,
    "speech": 0-100,
    "motor": 0-100,
    "cognitive": 0-100,
    "creativity": 0-100
  }
}`
      : `You are an expert in child development specializing in kindergarten-age children. Analyze the following survey data and provide a comprehensive report including:
1. Overall developmental summary
2. Observed strengths
3. Areas needing improvement
4. Practical teacher recommendations
5. Empathetic parent message with 3-day home action plan
6. Early indicators (giftedness or potential delay)

Respond in JSON format with this structure:
{
  "summary": "Overall summary",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["area 1", "area 2"],
  "teacherRecommendations": ["recommendation 1", "recommendation 2"],
  "parentMessage": "Parent-friendly message",
  "actionPlan": ["Day 1: ...", "Day 2: ...", "Day 3: ..."],
  "indicators": { "type": "gifted|typical|delayed|mixed", "details": "details" },
  "scores": {
    "attention": 0-100,
    "social": 0-100,
    "emotional": 0-100,
    "speech": 0-100,
    "motor": 0-100,
    "cognitive": 0-100,
    "creativity": 0-100
  }
}`;

    const userPrompt = isArabic
      ? `اسم الطفل: ${studentName}\nالعمر: ${studentAge} سنوات\n\nبيانات الاستقصاء:\n${JSON.stringify(surveyData, null, 2)}`
      : `Child name: ${studentName}\nAge: ${studentAge} years\n\nSurvey data:\n${JSON.stringify(surveyData, null, 2)}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Extract JSON from the response
    let analysis;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);
    } catch {
      analysis = { summary: content, strengths: [], improvements: [], teacherRecommendations: [], parentMessage: "", actionPlan: [], indicators: { type: "typical", details: "" }, scores: { attention: 50, social: 50, emotional: 50, speech: 50, motor: 50, cognitive: 50, creativity: 50 } };
    }

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-behavior error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
