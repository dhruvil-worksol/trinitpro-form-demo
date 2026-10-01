import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TrinitPro Form Security Demo",
  description: "Secure contact form testing for TrinitPro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}