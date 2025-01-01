"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-background border-b">
          <div className="container mx-auto px-4">
            <nav className="flex items-center justify-between py-4">
              <Link href="/" className="text-2xl font-bold text-primary">
                AI Astrology
              </Link>
              <div className="hidden md:flex space-x-4">
                <Button variant="ghost" asChild>
                  <Link href="/ask">Ask Question</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="/today">Today&apos;s Day</Link>
                </Button>
              </div>
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </Button>
              </div>
            </nav>
          </div>
        </header>
        {isMenuOpen && (
          <div className="md:hidden bg-background border-b">
            <div className="container mx-auto px-4 py-2">
              <Button variant="ghost" asChild className="w-full justify-start">
                <Link href="/ask" onClick={() => setIsMenuOpen(false)}>
                  Ask Question
                </Link>
              </Button>
              <Button variant="ghost" asChild className="w-full justify-start">
                <Link href="/today" onClick={() => setIsMenuOpen(false)}>
                  Today&apos;s Day
                </Link>
              </Button>
            </div>
          </div>
        )}
        <main className="container mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
