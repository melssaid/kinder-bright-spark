import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ChildSelector } from "@/components/dashboard/ChildSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import { children, Child } from "@/data/mockData";
import { useI18n } from "@/i18n";

const assessmentColor: Record<string, string> = {
  excellent: "bg-success/15 text-success border-success/30",
  good: "bg-info/15 text-info border-info/30",
  "needs-practice": "bg-warning/15 text-warning-foreground border-warning/30",
};

const EmotionalSkillsCoach = () => {
  const [selectedChild, setSelectedChild] = useState<Child>(children[0]);
  const { t } = useI18n();

  const assessmentLabel: Record<string, string> = {
    excellent: t("emotional.excellent"),
    good: t("emotional.good"),
    "needs-practice": t("emotional.needsPractice"),
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
              <Heart className="h-7 w-7 text-primary" />
              {t("emotional.title")}
            </h1>
            <p className="text-muted-foreground text-sm">{t("emotional.subtitle")}</p>
          </div>
          <ChildSelector selectedChild={selectedChild} onSelect={setSelectedChild} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedChild.emotionalScenarios.map((scenario, i) => (
            <Card key={i} className={`border-2 ${assessmentColor[scenario.assessment]}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{scenario.icon}</span>
                    {scenario.scenario}
                  </div>
                  <Badge variant={scenario.assessment === "excellent" ? "default" : scenario.assessment === "good" ? "secondary" : "outline"} className="capitalize text-xs">
                    {assessmentLabel[scenario.assessment]}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1">{t("emotional.response")}</p>
                  <p className="text-sm">{scenario.response}</p>
                </div>
                <div className="p-2 rounded-lg bg-primary/5 border border-primary/10">
                  <p className="text-xs font-semibold text-primary mb-1">💡 {t("emotional.tip")}</p>
                  <p className="text-xs text-muted-foreground">{scenario.tip}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmotionalSkillsCoach;
