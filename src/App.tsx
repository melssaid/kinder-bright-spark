import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nProvider } from "@/i18n";
import Index from "./pages/Index";
import EmotionalSkillsCoach from "./pages/EmotionalSkillsCoach";
import BehaviorTranslator from "./pages/BehaviorTranslator";
import NutritionPage from "./pages/NutritionPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/emotional-coach" element={<EmotionalSkillsCoach />} />
            <Route path="/behavior-translator" element={<BehaviorTranslator />} />
            <Route path="/nutrition" element={<NutritionPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
