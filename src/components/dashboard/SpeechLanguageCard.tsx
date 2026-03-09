import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MessageCircle, TrendingUp, TrendingDown } from "lucide-react";
import { Child } from "@/data/mockData";
import { useI18n } from "@/i18n";

export function SpeechLanguageCard({ child }: { child: Child }) {
  const { t } = useI18n();
  const { vocabularySize, avgSentenceLength, benchmark } = child.speechMetrics;
  const vocabPercent = Math.min((vocabularySize / benchmark.vocabulary) * 100, 150);
  const sentencePercent = Math.min((avgSentenceLength / benchmark.sentenceLength) * 100, 150);
  const vocabAbove = vocabularySize >= benchmark.vocabulary;
  const sentenceAbove = avgSentenceLength >= benchmark.sentenceLength;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-primary" />
          {t("speech.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>{t("speech.vocabulary")}</span>
            <div className="flex items-center gap-1">
              {vocabAbove ? <TrendingUp className="h-3 w-3 text-success" /> : <TrendingDown className="h-3 w-3 text-warning" />}
              <span className="font-semibold">{vocabularySize.toLocaleString()}</span>
              <span className="text-muted-foreground text-xs">/ {benchmark.vocabulary.toLocaleString()}</span>
            </div>
          </div>
          <Progress value={Math.min(vocabPercent, 100)} className="h-2" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>{t("speech.sentence")}</span>
            <div className="flex items-center gap-1">
              {sentenceAbove ? <TrendingUp className="h-3 w-3 text-success" /> : <TrendingDown className="h-3 w-3 text-warning" />}
              <span className="font-semibold">{avgSentenceLength} {t("speech.words")}</span>
              <span className="text-muted-foreground text-xs">/ {benchmark.sentenceLength}</span>
            </div>
          </div>
          <Progress value={Math.min(sentencePercent, 100)} className="h-2" />
        </div>
        <p className="text-xs text-muted-foreground italic">
          {vocabAbove && sentenceAbove ? t("speech.exceeding") : !vocabAbove && !sentenceAbove ? t("speech.below") : t("speech.developing")}
        </p>
      </CardContent>
    </Card>
  );
}
