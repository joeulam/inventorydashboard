"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sideBarItems } from "./sidebarItems";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useProfile } from "@/app/profile/profileHelperFunctions";

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [storeName, setStoreName] = useState("")
  const data = useProfile()
  useEffect(() => {
    setStoreName(data.storeName)
  },[data.storeName])
  return (
    <>
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Button
          size="icon"
          variant="outline"
          onClick={() => setIsOpen(true)}
          className={cn(isOpen && "hidden")}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <aside
        className={cn(
          "fixed z-40 top-0 left-0 h-full w-60 bg-background border-r text-foreground transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0 md:relative md:block"
        )}
      >
        <div className="flex items-center justify-between p-4 md:hidden border-b">
          <div className="text-lg font-semibold">{storeName}</div>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 text-lg font-semibold border-b hidden md:block">
          {storeName}
        </div>

        <ScrollArea className="h-[calc(100vh-60px)] p-4">
          <nav className="space-y-6">
            {sideBarItems.map((group, index) => {
              if (group.type === "divider") {
                return (
                  <div
                    key={`divider-${index}`}
                    className="h-px bg-muted my-4"
                  />
                );
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
                          onClick={() => setIsOpen(false)} 
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
                          onClick={() => setIsOpen(false)}
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
    </>
  );
}
