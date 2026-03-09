import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ChildSelector } from "@/components/dashboard/ChildSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Apple, Utensils, Lightbulb } from "lucide-react";
import { children, Child } from "@/data/mockData";
import { useI18n } from "@/i18n";

const NutritionPage = () => {
  const [selectedChild, setSelectedChild] = useState<Child>(children[0]);
  const { t } = useI18n();
  const totalCalories = selectedChild.nutrition.reduce((s, m) => s + m.calories, 0);
  const totalProtein = selectedChild.nutrition.reduce((s, m) => s + m.protein, 0);
  const totalCarbs = selectedChild.nutrition.reduce((s, m) => s + m.carbs, 0);
  const totalVitamins = Math.round(selectedChild.nutrition.reduce((s, m) => s + m.vitamins, 0) / selectedChild.nutrition.length);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
              <Apple className="h-7 w-7 text-primary" />
              {t("nutrition.fullTitle")}
            </h1>
            <p className="text-muted-foreground text-sm">{t("nutrition.fullSubtitle")}</p>
          </div>
          <ChildSelector selectedChild={selectedChild} onSelect={setSelectedChild} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: t("nutrition.calories"), value: `${totalCalories} kcal`, target: 900, current: totalCalories },
            { label: t("nutrition.protein"), value: `${totalProtein}g`, target: 40, current: totalProtein },
            { label: t("nutrition.carbs"), value: `${totalCarbs}g`, target: 120, current: totalCarbs },
            { label: t("nutrition.vitamins"), value: `${totalVitamins}%`, target: 100, current: totalVitamins },
          ].map((stat, i) => (
            <Card key={i}>
              <CardContent className="pt-4 pb-3 space-y-2">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
                <Progress value={Math.min((stat.current / stat.target) * 100, 100)} className="h-1.5" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Utensils className="h-4 w-4 text-primary" />
                {t("nutrition.todayMeals")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedChild.nutrition.map((meal, i) => (
                <div key={i} className="p-3 rounded-lg border bg-muted/20 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{meal.meal}</span>
                    <span className="text-xs text-muted-foreground">{meal.calories} kcal</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{meal.items.join(" • ")}</p>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <div className="flex justify-between mb-0.5"><span>{t("nutrition.protein")}</span><span>{meal.protein}g</span></div>
                      <Progress value={meal.protein * 3} className="h-1" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-0.5"><span>{t("nutrition.carbs")}</span><span>{meal.carbs}g</span></div>
                      <Progress value={meal.carbs} className="h-1" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-0.5"><span>{t("nutrition.vitamins")}</span><span>{meal.vitamins}%</span></div>
                      <Progress value={meal.vitamins} className="h-1" />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-warning" />
                {t("nutrition.aiSuggestions")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {selectedChild.suggestedMeals.map((meal, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border bg-warning/5 border-warning/20">
                  <span className="text-lg">🍽️</span>
                  <span className="text-sm">{meal}</span>
                </div>
              ))}
              <p className="text-xs text-muted-foreground italic mt-2">{t("nutrition.suggestionsNote")}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NutritionPage;
