import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ClaudeKeep - Save and Share Your AI Conversations",
  description: "Save, organize, and share your conversations with Claude AI assistant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          src="https://beamanalytics.b-cdn.net/beam.min.js"
          data-token="5ef93360-2cba-4abc-841b-cfabe3abcff7"
          async
        >
        </script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
          storageKey="claudekeep-theme"
        >
          <div className="min-h-screen">
            <Header />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
