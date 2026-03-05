import { AppSidebar } from "@/components/shared/app-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppSidebar>{children}</AppSidebar>;
}
