import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AttendanceTable } from "@/components/attendance/AttendanceTable";
import { AttendanceStats } from "@/components/attendance/AttendanceStats";
import { useI18n } from "@/i18n";
import { getStudents, DbStudent } from "@/lib/database";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AttendancePage = () => {
  const { t, locale } = useI18n();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [refreshKey, setRefreshKey] = useState(0);
  const [students, setStudents] = useState<DbStudent[]>([]);
  const dateLocale = locale === "ar" ? ar : enUS;

  useEffect(() => { getStudents().then(setStudents); }, []);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{t("attendance.title")}</h1>
            <p className="text-muted-foreground text-sm">{t("attendance.subtitle")}</p>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-[220px] justify-start text-left font-normal gap-2")}>
                <CalendarIcon className="h-4 w-4" />
                {format(selectedDate, "PPP", { locale: dateLocale })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="single" selected={selectedDate} onSelect={(d) => d && setSelectedDate(d)} initialFocus className={cn("p-3 pointer-events-auto")} />
            </PopoverContent>
          </Popover>
        </div>

        <Tabs defaultValue="daily" className="space-y-4">
          <TabsList>
            <TabsTrigger value="daily">{t("attendance.daily")}</TabsTrigger>
            <TabsTrigger value="stats">{t("attendance.stats")}</TabsTrigger>
          </TabsList>
          <TabsContent value="daily">
            <AttendanceTable students={students} date={selectedDate} refreshKey={refreshKey} onRefresh={() => setRefreshKey(k => k + 1)} />
          </TabsContent>
          <TabsContent value="stats">
            <AttendanceStats students={students} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AttendancePage;
