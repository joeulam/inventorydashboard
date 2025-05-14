"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sideBarItems } from "./sidebarItems";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 h-screen border-r bg-background text-foreground">
      <div className="p-4 text-lg font-semibold border-b">Lam Mark Trading</div>
      <ScrollArea className="h-[calc(100vh-60px)] p-4">
        <nav className="space-y-6">
          {sideBarItems.map((group, index) => {
            if (group.type === "divider") {
              return <div key={`divider-${index}`} className="h-px bg-muted my-4" />;
            }

            return (
              <div key={group.label}>
                <div className="text-xs text-muted-foreground uppercase mb-2 tracking-wide">
                  {group.label}
                </div>
                <ul className="space-y-1">
                  {group.children?.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                          pathname === item.href
                            ? "bg-muted text-primary"
                            : "hover:bg-muted"
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                  {!group.children && group.href && (
                    <li>
                      <Link
                        href={group.href}
                        className={cn(
                          "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                          pathname === group.href
                            ? "bg-muted text-primary"
                            : "hover:bg-muted"
                        )}
                      >
                        {group.label}
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
}
