"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // The theme is unknown on the server, so wait for the client to mount
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label="Toggle dark mode"
      aria-pressed={isDark}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="size-11 cursor-pointer rounded-none border-foreground bg-background text-foreground transition-none hover:bg-foreground hover:text-background focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground focus-visible:ring-0 active:translate-y-0 dark:border-foreground dark:bg-background dark:hover:bg-foreground dark:hover:text-background"
    >
      {isDark ? (
        <Sun className="size-4.5" strokeWidth={1.5} aria-hidden="true" />
      ) : (
        <Moon className="size-4.5" strokeWidth={1.5} aria-hidden="true" />
      )}
    </Button>
  );
}
