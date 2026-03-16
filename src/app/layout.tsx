import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Loading from "./loading";

export const metadata: Metadata = {
  title: "SMFC Finance",
  description: "Digital Loan Management Platform",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<Loading />}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
