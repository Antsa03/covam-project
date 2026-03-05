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
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

type ModalSize = "sm" | "md" | "lg" | "xl";

interface AppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  /** "dialog" = centered modal (default), "sheet" = force right side-panel */
  variant?: "dialog" | "sheet";
  /** Controls dialog width on desktop. Mobile always uses bottom sheet. */
  size?: ModalSize;
  className?: string;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: "sm:max-w-md",
  md: "sm:max-w-lg lg:max-w-xl",
  lg: "sm:max-w-2xl lg:max-w-3xl",
  xl: "sm:max-w-4xl lg:max-w-5xl",
};

export function AppModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  variant = "dialog",
  size = "md",
  className,
}: AppModalProps) {
  const isMobile = useIsMobile();

  // Force right-side sheet (e.g. for filter panels)
  if (variant === "sheet") {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className={cn("w-full sm:max-w-lg overflow-y-auto", className)}
        >
          <SheetHeader className="mb-5 pb-4 border-b">
            <SheetTitle>{title}</SheetTitle>
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
          {children}
        </SheetContent>
      </Sheet>
    );
  }

  // On mobile → bottom drawer (like a native mobile sheet)
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className={cn(
            "max-h-[92vh] overflow-y-auto rounded-t-2xl px-5 pb-8",
            className,
          )}
        >
          {/* Drag handle */}
          <div className="mx-auto mt-2 mb-5 h-1 w-10 rounded-full bg-border" />
          <SheetHeader className="mb-5 pb-4 border-b text-left">
            <SheetTitle>{title}</SheetTitle>
            {description && (
              <SheetDescription className="text-sm leading-relaxed">
                {description}
              </SheetDescription>
            )}
          </SheetHeader>
          {children}
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop → centered Dialog, grows with screen width
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "w-[95vw] max-h-[90vh] overflow-y-auto",
          sizeClasses[size],
          className,
        )}
      >
        <DialogHeader className="pb-3 border-b mb-1">
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-sm leading-relaxed">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
