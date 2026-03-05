import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between pb-5 mb-2 border-b border-slate-100">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 h-8 w-1 rounded-full bg-primary shrink-0" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-slate-500 mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {action && (
        <Button
          onClick={action.onClick}
          className="mt-3 sm:mt-0 self-start sm:self-auto bg-primary hover:bg-primary/90 text-white shadow-sm"
        >
          {action.icon ?? <Plus className="mr-2 h-4 w-4" />}
          {action.label}
        </Button>
      )}
    </div>
  );
}
