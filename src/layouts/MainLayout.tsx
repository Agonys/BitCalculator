import { Outlet } from 'react-router';
import { AppSearchbar, AppSidebar, CraftListSummary } from '@/components';
import { SidebarProvider } from '@/components/ui/sidebar';

export const MainLayout = () => {
  return (
    <SidebarProvider className="bg-background text-foreground h-full min-h-screen w-full">
      <AppSidebar />
      <div className="w-full">
        <AppSearchbar />

        <div className="flex w-full flex-col gap-6 p-4">
          <Outlet />
        </div>
      </div>
      <CraftListSummary />
    </SidebarProvider>
  );
};
