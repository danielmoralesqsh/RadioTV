'use client';

import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';

export function MobileSidebarToggle() {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="md:hidden p-4">
      <Button variant="ghost" size="icon" onClick={toggleSidebar}>
        <Menu className="h-6 w-6" />
      </Button>
    </div>
  );
}
