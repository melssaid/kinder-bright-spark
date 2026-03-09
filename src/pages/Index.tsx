import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ChildSelector } from "@/components/dashboard/ChildSelector";
import { DevelopmentalTracker } from "@/components/dashboard/DevelopmentalTracker";
import { AttentionRadar } from "@/components/dashboard/AttentionRadar";
import { DailyMoodScale } from "@/components/dashboard/DailyMoodScale";
import { LearningStyleProfile } from "@/components/dashboard/LearningStyleProfile";
import { SocialInteractionAnalyzer } from "@/components/dashboard/SocialInteractionAnalyzer";
import { SpeechLanguageCard } from "@/components/dashboard/SpeechLanguageCard";
import { EarlyTalentDiscoverer } from "@/components/dashboard/EarlyTalentDiscoverer";
import { NutritionAssistant } from "@/components/dashboard/NutritionAssistant";
import { children, Child } from "@/data/mockData";

const Index = () => {
  const [selectedChild, setSelectedChild] = useState<Child>(children[0]);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Teacher Dashboard</h1>
            <p className="text-muted-foreground text-sm">Track development, behavior, and wellbeing</p>
          </div>
          <ChildSelector selectedChild={selectedChild} onSelect={setSelectedChild} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <DevelopmentalTracker child={selectedChild} />
          </div>
          <LearningStyleProfile child={selectedChild} />
          <AttentionRadar child={selectedChild} />
          <DailyMoodScale child={selectedChild} />
          <SocialInteractionAnalyzer child={selectedChild} />
          <SpeechLanguageCard child={selectedChild} />
          <EarlyTalentDiscoverer child={selectedChild} />
          <NutritionAssistant child={selectedChild} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
