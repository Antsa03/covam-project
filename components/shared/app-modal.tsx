"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface AppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  /** "dialog" = centered modal (default), "sheet" = slide-in from right */
  variant?: "dialog" | "sheet";
  className?: string;
}

/**
 * Responsive modal wrapper:
 * - On sm+ screens uses a centered Dialog
 * - On xs screens the "sheet" variant slides in from the bottom/right
 * The default "dialog" is appropriate for most forms.
 */
export function AppModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  variant = "dialog",
  className,
}: AppModalProps) {
  if (variant === "sheet") {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className={cn("w-full sm:max-w-lg overflow-y-auto", className)}
        >
          <SheetHeader className="mb-4">
            <SheetTitle>{title}</SheetTitle>
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
          {children}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto",
          className,
        )}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
