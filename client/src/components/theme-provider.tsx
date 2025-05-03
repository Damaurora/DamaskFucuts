import { ThemeProvider as NextThemeProvider } from "@/hooks/use-theme";
import { ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: "dark" | "light";
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
}: ThemeProviderProps) {
  return (
    <NextThemeProvider defaultTheme={defaultTheme}>
      {children}
    </NextThemeProvider>
  );
}
