import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Palette, Calculator, Dumbbell, Users, BookOpen } from "lucide-react";
import { Child } from "@/data/mockData";
import { useI18n } from "@/i18n";

const categoryIcon: Record<string, React.ElementType> = {
  artistic: Palette, logical: Calculator, motor: Dumbbell, social: Users, linguistic: BookOpen,
};

const categoryColor: Record<string, string> = {
  artistic: "bg-accent text-accent-foreground",
  logical: "bg-info/15 text-info",
  motor: "bg-success/15 text-success",
  social: "bg-warning/15 text-warning-foreground",
  linguistic: "bg-secondary text-secondary-foreground",
};

export function EarlyTalentDiscoverer({ child }: { child: Child }) {
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Star className="h-4 w-4 text-primary" />
          {t("talent.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2">
          {child.talents.map((talent, i) => {
            const Icon = categoryIcon[talent.category] || Star;
            return (
              <div key={i} className={`flex items-center gap-3 p-2 rounded-lg ${categoryColor[talent.category]}`}>
                <Icon className="h-4 w-4 shrink-0" />
                <span className="text-sm font-medium flex-1">{talent.skill}</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className={`h-3 w-3 ${s < talent.level ? "fill-current" : "opacity-20"}`} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
