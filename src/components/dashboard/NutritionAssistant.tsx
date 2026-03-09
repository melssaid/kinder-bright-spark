import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Apple, Utensils } from "lucide-react";
import { Child } from "@/data/mockData";

export function NutritionAssistant({ child }: { child: Child }) {
  const totalCalories = child.nutrition.reduce((s, m) => s + m.calories, 0);
  const targetCalories = 900;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Apple className="h-4 w-4 text-primary" />
          Nutrition Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span>Daily Calories</span>
          <span className="font-semibold">{totalCalories} / {targetCalories} kcal</span>
        </div>
        <Progress value={Math.min((totalCalories / targetCalories) * 100, 100)} className="h-2" />

        {child.nutrition.map((meal, i) => (
          <div key={i} className="p-2 rounded-lg border bg-muted/20 space-y-1">
            <div className="flex items-center gap-2">
              <Utensils className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm font-medium">{meal.meal}</span>
              <span className="text-xs text-muted-foreground ml-auto">{meal.calories} kcal</span>
            </div>
            <p className="text-xs text-muted-foreground">{meal.items.join(", ")}</p>
            <div className="grid grid-cols-3 gap-2 text-[10px]">
              <div>
                <span className="text-muted-foreground">Protein</span>
                <Progress value={meal.protein * 3} className="h-1 mt-0.5" />
              </div>
              <div>
                <span className="text-muted-foreground">Carbs</span>
                <Progress value={meal.carbs} className="h-1 mt-0.5" />
              </div>
              <div>
                <span className="text-muted-foreground">Vitamins</span>
                <Progress value={meal.vitamins} className="h-1 mt-0.5" />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
