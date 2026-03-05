import { AppSidebar } from "@/components/shared/app-sidebar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppSidebar>{children}</AppSidebar>;
}
