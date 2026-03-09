import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Child } from "@/data/mockData";

export function AttentionRadar({ child }: { child: Child }) {
  const score = child.attentionScore;
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? "hsl(var(--success))" : score >= 50 ? "hsl(var(--warning))" : "hsl(var(--destructive))";

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          ADHD & Attention Radar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
              <circle cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="8"
                strokeDasharray={circumference} strokeDashoffset={offset}
                strokeLinecap="round" transform="rotate(-90 50 50)" className="transition-all duration-1000" />
              <text x="50" y="50" textAnchor="middle" dominantBaseline="central"
                className="text-lg font-bold fill-foreground" style={{ fontSize: 20, fontFamily: "Quicksand" }}>
                {score}
              </text>
            </svg>
          </div>
          <div className="space-y-1 flex-1">
            {child.behavioralLogs.map((log, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                {log.type === "positive" ? <CheckCircle className="h-3 w-3 text-success mt-0.5 shrink-0" /> :
                 log.type === "concern" ? <AlertTriangle className="h-3 w-3 text-warning mt-0.5 shrink-0" /> :
                 <Info className="h-3 w-3 text-info mt-0.5 shrink-0" />}
                <span><strong className="text-muted-foreground">{log.time}</strong> — {log.note}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          {child.recommendations.map((rec, i) => (
            <div key={i} className="p-2 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold">{rec.title}</span>
                <Badge variant={rec.priority === "high" ? "destructive" : rec.priority === "medium" ? "secondary" : "outline"} className="text-[10px] px-1.5 py-0">
                  {rec.priority}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{rec.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
