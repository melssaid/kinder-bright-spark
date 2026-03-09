import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { children, Child } from "@/data/mockData";

interface ChildSelectorProps {
  selectedChild: Child;
  onSelect: (child: Child) => void;
}

export function ChildSelector({ selectedChild, onSelect }: ChildSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-3xl">{selectedChild.avatar}</span>
      <div>
        <Select value={selectedChild.id} onValueChange={(id) => {
          const child = children.find(c => c.id === id);
          if (child) onSelect(child);
        }}>
          <SelectTrigger className="w-[200px] border-primary/20 bg-card font-semibold text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {children.map(child => (
              <SelectItem key={child.id} value={child.id}>
                {child.avatar} {child.name} (Age {child.age})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">Age {selectedChild.age} years</p>
      </div>
    </div>
  );
}
