"use client"

import Link from "next/link";
import { Calculator } from "lucide-react";
import { SmartSearch } from "@/components/SmartSearch";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Calculator className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold font-headline">FinanceFriend</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <SmartSearch />
          </div>
          <ThemeToggle />
        </div>
      </div>
      <div className="container mx-auto px-4 pb-4 md:hidden">
        <SmartSearch />
      </div>
    </header>
  );
}
