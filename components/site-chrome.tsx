"use client";

import { usePathname } from "next/navigation";

export function SiteChrome({
  children,
  header,
  footer,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname();
  const standalone = pathname.startsWith("/admin") || pathname === "/bio";

  if (standalone) return <>{children}</>;

  return (
    <>
      {header}
      <main>{children}</main>
      {footer}
    </>
  );
}
