import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smile, AlertCircle } from "lucide-react";
import { Child } from "@/data/mockData";
import { useI18n } from "@/i18n";

const moodEmoji: Record<string, string> = {
  happy: "😊", focused: "🎯", frustrated: "😤", calm: "😌", anxious: "😰",
};

const moodColor: Record<string, string> = {
  happy: "bg-success/20 border-success/40",
  focused: "bg-info/20 border-info/40",
  frustrated: "bg-destructive/20 border-destructive/40",
  calm: "bg-secondary border-secondary-foreground/20",
  anxious: "bg-warning/20 border-warning/40",
};

export function DailyMoodScale({ child }: { child: Child }) {
  const { t } = useI18n();
  const hasShift = child.moodEntries.some(e => e.mood === "frustrated" || e.mood === "anxious");

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Smile className="h-4 w-4 text-primary" />
          {t("mood.title")}
          {hasShift && (
            <Badge variant="destructive" className="text-[10px] px-1.5 py-0 ms-auto">
              <AlertCircle className="h-3 w-3 me-1" /> {t("mood.shiftDetected")}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {child.moodEntries.map((entry, i) => (
            <div key={i} className={`flex items-center gap-3 p-2 rounded-lg border ${moodColor[entry.mood]}`}>
              <span className="text-xl">{moodEmoji[entry.mood]}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium">{t(`mood.${entry.mood}`)}</p>
                <p className="text-xs text-muted-foreground truncate">{entry.note}</p>
              </div>
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">{entry.time}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
