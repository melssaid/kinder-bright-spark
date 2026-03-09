import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Share2, FileDown, CheckCircle, AlertTriangle, Star, TrendingUp, MessageCircle, Heart } from "lucide-react";
import { useI18n } from "@/i18n";
import { AnalysisResult, Student, SurveyResponse } from "@/lib/storage";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface AnalysisViewProps {
  student: Student;
  survey: SurveyResponse;
}

export function AnalysisView({ student, survey }: AnalysisViewProps) {
  const { t, locale } = useI18n();
  const reportRef = useRef<HTMLDivElement>(null);
  const analysis = survey.analysis;

  if (!analysis) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          {locale === "ar" ? "لا توجد نتائج تحليل لهذا الاستقصاء" : "No analysis results for this survey"}
        </CardContent>
      </Card>
    );
  }

  const radarData = [
    { subject: locale === "ar" ? "الانتباه" : "Attention", value: analysis.scores.attention },
    { subject: locale === "ar" ? "اجتماعي" : "Social", value: analysis.scores.social },
    { subject: locale === "ar" ? "عاطفي" : "Emotional", value: analysis.scores.emotional },
    { subject: locale === "ar" ? "نطق" : "Speech", value: analysis.scores.speech },
    { subject: locale === "ar" ? "حركي" : "Motor", value: analysis.scores.motor },
    { subject: locale === "ar" ? "إدراكي" : "Cognitive", value: analysis.scores.cognitive },
    { subject: locale === "ar" ? "إبداع" : "Creativity", value: analysis.scores.creativity },
  ];

  const barData = Object.entries(analysis.scores).map(([key, value]) => ({
    name: key,
    score: value,
  }));

  const indicatorColor: Record<string, string> = {
    gifted: "bg-success/15 text-success border-success/30",
    typical: "bg-info/15 text-info border-info/30",
    delayed: "bg-warning/15 text-warning-foreground border-warning/30",
    mixed: "bg-accent text-accent-foreground border-accent/30",
  };

  const handleShareWhatsApp = () => {
    const msg = `${locale === "ar" ? "تقرير نمو الطفل" : "Child Development Report"}: ${student.name}\n\n${analysis.parentMessage}\n\n${analysis.actionPlan.join("\n")}`;
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    try {
      toast.info(locale === "ar" ? "جاري إنشاء PDF..." : "Generating PDF...");
      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${student.name}-report-${new Date().toLocaleDateString()}.pdf`);
      toast.success(locale === "ar" ? "تم تصدير PDF" : "PDF exported");
    } catch {
      toast.error(locale === "ar" ? "خطأ في التصدير" : "Export error");
    }
  };

  return (
    <div className="space-y-4">
      {/* Action buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button onClick={handleShareWhatsApp} variant="outline" className="gap-2">
          <Share2 className="h-4 w-4" /> {t("analysis.share")}
        </Button>
        <Button onClick={handleExportPDF} variant="outline" className="gap-2">
          <FileDown className="h-4 w-4" /> {t("analysis.exportPdf")}
        </Button>
      </div>

      <div ref={reportRef} className="space-y-4 bg-background p-2">
        {/* Header */}
        <div className="text-center pb-2 border-b">
          <h2 className="text-xl font-bold">🌈 Kinder BH</h2>
          <p className="text-sm text-muted-foreground">{student.name} — {new Date(survey.date).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US")}</p>
        </div>

        {/* Indicator badge */}
        <Card className={`border-2 ${indicatorColor[analysis.indicators.type] || ""}`}>
          <CardContent className="py-3 flex items-center gap-3">
            <Star className="h-5 w-5" />
            <div>
              <p className="text-sm font-bold">{t("analysis.indicators")}: {t(`indicators.${analysis.indicators.type}`)}</p>
              <p className="text-xs text-muted-foreground">{analysis.indicators.details}</p>
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> {t("analysis.summary")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{analysis.summary}</p>
          </CardContent>
        </Card>

        {/* Charts side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{t("analysis.scores")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "hsl(var(--foreground))" }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                  <Radar dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.25} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{t("analysis.scores")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Score details */}
        <Card>
          <CardContent className="pt-4 space-y-2">
            {radarData.map(item => (
              <div key={item.subject} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">{item.subject}</span>
                  <span>{item.value}/100</span>
                </div>
                <Progress value={item.value} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Strengths & Improvements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-success/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-success">
                <CheckCircle className="h-4 w-4" /> {t("analysis.strengths")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {analysis.strengths.map((s, i) => (
                  <li key={i} className="text-sm flex gap-2"><span className="text-success">✓</span> {s}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-warning/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-warning">
                <AlertTriangle className="h-4 w-4" /> {t("analysis.improvements")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {analysis.improvements.map((s, i) => (
                  <li key={i} className="text-sm flex gap-2"><span className="text-warning">!</span> {s}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" /> {t("analysis.recommendations")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analysis.teacherRecommendations.map((r, i) => (
                <li key={i} className="text-sm p-2 rounded-lg bg-primary/5 border border-primary/10">{r}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Parent Message */}
        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-primary" /> {t("analysis.parentMessage")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm leading-relaxed bg-primary/5 p-3 rounded-lg">{analysis.parentMessage}</p>
            <h4 className="text-sm font-semibold">{t("analysis.actionPlan")}</h4>
            <div className="space-y-2">
              {analysis.actionPlan.map((a, i) => (
                <div key={i} className="text-sm p-2 rounded-lg bg-muted/30 border">{a}</div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
