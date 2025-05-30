import { Outlet } from 'react-router';
import { AppSearchbar, AppSidebar } from '@/components';
import { SidebarProvider } from '@/components/ui/sidebar';

export const SidebarLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full">
        <AppSearchbar />

        <div className="flex w-full flex-col gap-6 p-4">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};
