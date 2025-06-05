import { Home, SquarePen } from 'lucide-react';
import { Link } from 'react-router';
import logo from '@/assets/logo.png';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';

export const AppSidebar = () => {
  const items = [
    {
      title: 'Calculator',
      url: '/',
      icon: Home,
      disabled: false,
    },
    {
      title: 'Recipe Editor',
      url: '/editor',
      icon: SquarePen,
      disabled: false,
    },
  ];
  return (
    <Sidebar collapsible="icon" className="z-50">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2 overflow-hidden">
            <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
              <img src={logo} />
            </div>
            <h3 className="font-medium">BitCalculator</h3>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {item.disabled ? (
                      <p className="text-muted-foreground">
                        <item.icon />
                        <span>{item.title}</span>
                      </p>
                    ) : (
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};
