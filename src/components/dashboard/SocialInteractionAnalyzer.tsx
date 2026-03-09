import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Child } from "@/data/mockData";
import { useI18n } from "@/i18n";

export function SocialInteractionAnalyzer({ child }: { child: Child }) {
  const { t } = useI18n();
  const maxFreq = Math.max(...child.peerInteractions.map(p => p.frequency));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          {t("social.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {child.peerInteractions.map((peer, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{peer.peer}</span>
              <Badge variant={peer.quality === "strong" ? "default" : peer.quality === "moderate" ? "secondary" : "outline"} className="text-[10px] capitalize">
                {t(`social.${peer.quality}`)}
              </Badge>
            </div>
            <Progress value={(peer.frequency / maxFreq) * 100} className="h-2" />
            <p className="text-[10px] text-muted-foreground">{peer.frequency} {t("social.interactions")}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
