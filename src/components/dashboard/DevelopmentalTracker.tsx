import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp } from "lucide-react";
import { Child } from "@/data/mockData";
import { useI18n } from "@/i18n";

export function DevelopmentalTracker({ child }: { child: Child }) {
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          {t("dev.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={child.developmentalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }} />
            <Legend />
            <Line type="monotone" dataKey="focus" stroke="hsl(var(--chart-focus))" strokeWidth={2} dot={{ r: 3 }} name={t("dev.focus")} />
            <Line type="monotone" dataKey="play" stroke="hsl(var(--chart-play))" strokeWidth={2} dot={{ r: 3 }} name={t("dev.play")} />
            <Line type="monotone" dataKey="learning" stroke="hsl(var(--chart-learning))" strokeWidth={2} dot={{ r: 3 }} name={t("dev.learning")} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
