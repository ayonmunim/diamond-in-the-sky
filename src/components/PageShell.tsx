import type { ReactNode } from "react";
import { AppHeader } from "./AppHeader";
import { AppFooter } from "./AppFooter";
import { StarField } from "./StarField";

export function PageShell({ children, showHeader = true, showFooter = true }: { children: ReactNode; showHeader?: boolean; showFooter?: boolean }) {
  return (
    <>
      <StarField />
      {showHeader && <AppHeader />}
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-10">{children}</main>
      {showFooter && <AppFooter />}
    </>
  );
}
