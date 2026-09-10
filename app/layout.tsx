import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/common/ThemeContext";
import { ProgressProvider } from "@/features/progress/ProgressContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Maharashtra Board Physics Platform | Learning & Classroom OS",
  description:
    "Complete 16-chapter Maharashtra Board Class 12 Physics course, interactive labs, practice engine, formulas, and classroom presentation system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <ProgressProvider>{children}</ProgressProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
