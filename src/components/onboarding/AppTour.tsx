import { useState, useEffect } from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import { useI18n } from "@/i18n";
import { useLocation } from "react-router-dom";

const TOUR_COMPLETED_KEY = "kindertrack_tour_completed";

export function AppTour() {
  const { t, locale } = useI18n();
  const location = useLocation();
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const tourCompleted = localStorage.getItem(TOUR_COMPLETED_KEY);
    if (!tourCompleted && location.pathname === "/") {
      const timer = setTimeout(() => setRun(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  const steps: Step[] = [
    {
      target: "body",
      content: t("tour.welcome"),
      placement: "center",
      disableBeacon: true,
    },
    {
      target: '[data-tour="students"]',
      content: t("tour.students"),
      placement: "right",
    },
    {
      target: '[data-tour="survey"]',
      content: t("tour.survey"),
      placement: "right",
    },
    {
      target: '[data-tour="attendance"]',
      content: t("tour.attendance"),
      placement: "right",
    },
    {
      target: '[data-tour="history"]',
      content: t("tour.history"),
      placement: "right",
    },
    {
      target: '[data-tour="dashboard"]',
      content: t("tour.dashboard"),
      placement: "bottom",
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, index } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem(TOUR_COMPLETED_KEY, "true");
    }

    setStepIndex(index);
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      stepIndex={stepIndex}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      locale={{
        back: locale === "ar" ? "السابق" : "Back",
        close: locale === "ar" ? "إغلاق" : "Close",
        last: locale === "ar" ? "إنهاء" : "Finish",
        next: locale === "ar" ? "التالي" : "Next",
        skip: locale === "ar" ? "تخطي" : "Skip",
      }}
      styles={{
        options: {
          primaryColor: "hsl(var(--primary))",
          textColor: "hsl(var(--foreground))",
          backgroundColor: "hsl(var(--background))",
          arrowColor: "hsl(var(--background))",
          zIndex: 10000,
        },
        tooltip: {
          fontSize: 14,
          padding: 20,
          borderRadius: 8,
        },
        buttonNext: {
          backgroundColor: "hsl(var(--primary))",
          fontSize: 14,
          padding: "8px 16px",
          borderRadius: 6,
        },
        buttonBack: {
          color: "hsl(var(--muted-foreground))",
          fontSize: 14,
        },
        buttonSkip: {
          color: "hsl(var(--muted-foreground))",
          fontSize: 14,
        },
      }}
    />
  );
}
