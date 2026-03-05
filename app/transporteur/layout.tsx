import { AppSidebar } from "@/components/shared/app-sidebar";

export default function TransporteurLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppSidebar>{children}</AppSidebar>;
}
