'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Tv, Radio } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';

const menuItems = [
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/tv', label: 'TV', icon: Tv },
  { href: '/radio', label: 'Radio', icon: Radio },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="group-data-[variant=floating]:border-none group-data-[variant=floating]:shadow-none">
      <SidebarHeader className="flex items-center p-2">
        <Button variant="ghost" className="h-auto p-1" asChild>
          <Link href="/">
            <Logo className="w-8 h-8" />
            <span className="ml-2 text-lg font-bold tracking-tight font-headline group-data-[collapsible=icon]:hidden">
              StreamVerse
            </span>
          </Link>
        </Button>
        {state === 'expanded' ? (
          <SidebarTrigger className="ml-auto" />
        ) : (
          <div className="flex-1" />
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {state === 'collapsed' && (
             <SidebarMenuItem>
              <SidebarTrigger />
            </SidebarMenuItem>
          )}
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
