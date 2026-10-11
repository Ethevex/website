import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ethevex",
  description: "A domain that encompasses all",
  icons: {
    apple: "/ethevex-assets/apple-touch-icon.png",
  },
  manifest: "/ethevex-assets/site.webmanifest",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} min-h-full antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
