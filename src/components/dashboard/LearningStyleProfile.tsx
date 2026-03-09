import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
import { BookOpen } from "lucide-react";
import { Child } from "@/data/mockData";

export function LearningStyleProfile({ child }: { child: Child }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          Learning Style Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={child.learningStyle}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Radar name="Style" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.25} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-2 mt-2">
          {child.learningStyle.map(s => (
            <div key={s.subject} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
              {s.subject}: {s.value}%
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
