import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ChildSelector } from "@/components/dashboard/ChildSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, ArrowRight, FileText, CheckCircle } from "lucide-react";
import { children, Child } from "@/data/mockData";

const BehaviorTranslator = () => {
  const [selectedChild, setSelectedChild] = useState<Child>(children[0]);
  const [teacherText, setTeacherText] = useState(selectedChild.teacherNotes);
  const [translated, setTranslated] = useState(false);

  const handleChildChange = (child: Child) => {
    setSelectedChild(child);
    setTeacherText(child.teacherNotes);
    setTranslated(false);
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
              <MessageSquare className="h-7 w-7 text-primary" />
              Behavior Translator
            </h1>
            <p className="text-muted-foreground text-sm">Convert teacher notes into empathetic parent messages</p>
          </div>
          <ChildSelector selectedChild={selectedChild} onSelect={handleChildChange} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Teacher's Raw Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={teacherText}
                onChange={(e) => { setTeacherText(e.target.value); setTranslated(false); }}
                className="min-h-[200px] text-sm"
                placeholder="Enter your observations..."
              />
              <Button onClick={() => setTranslated(true)} className="mt-3 w-full gap-2">
                <ArrowRight className="h-4 w-4" /> Translate for Parents
              </Button>
            </CardContent>
          </Card>

          <Card className={translated ? "border-primary/30 shadow-md" : ""}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                Parent-Friendly Message
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {translated ? (
                <>
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <p className="text-sm leading-relaxed">{selectedChild.parentMessage}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      3-Day Home Action Plan
                    </h4>
                    <div className="space-y-2">
                      {selectedChild.actionPlan.map((action, i) => (
                        <div key={i} className="p-2 rounded-lg bg-muted/30 border text-sm">
                          {action}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                  <MessageSquare className="h-10 w-10 mb-2 opacity-30" />
                  <p className="text-sm">Click "Translate" to generate parent message</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BehaviorTranslator;
