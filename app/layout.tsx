import "./globals.css";
import { ReactNode } from "react";
import { QueryProvider } from "@/components/query-provider";

export const metadata = {
  title: "Müzik Distribütörü",
  description: "Sanatçılar ve label'lar için dijital müzik dağıtım paneli"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
