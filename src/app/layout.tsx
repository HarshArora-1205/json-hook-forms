import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react"

const gilroy = localFont({
  src: [
    {
      path: './fonts/Gilroy-Thin.ttf',
      weight: '100'
    },
    {
      path: './fonts/Gilroy-UltraLight.ttf',
      weight: '200',
    },
    {
      path: './fonts/Gilroy-Light.ttf',
      weight: '300',
    },
    {
      path: './fonts/Gilroy-Regular.ttf',
      weight: '400'
    },
    {
      path: './fonts/Gilroy-Medium.ttf',
      weight: '500',
    },
    {
      path: './fonts/Gilroy-SemiBold.ttf',
      weight: '600',
    },
    {
      path: './fonts/Gilroy-Bold.ttf',
      weight: '700',
    },
    {
      path: './fonts/Gilroy-ExtraBold.ttf',
      weight: '800',
    },
    {
      path: './fonts/Gilroy-Black.ttf',
      weight: '900',
    },
  ],
  variable: "--font-gilroy",
});

export const metadata: Metadata = {
  title: "Json Hook Forms",
  description: "A utility application that helps you to build ShadCn UI components based React Hook Forms using JSON schemas, validate using Zod constraints.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${gilroy.variable} font-gilroy antialiased`}
      >
        <Analytics />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
