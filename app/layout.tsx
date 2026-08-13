import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LogistikOhneLogik",
  description:
    "Eine unabhängige Plattform für Berufskraftfahrer – Probleme sichtbar machen, Fahrer zusammenbringen und Lösungen voranbringen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}