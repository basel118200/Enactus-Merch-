import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import LoadingScreen from "@/components/LoadingScreen";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Enactus Cairo | Student-Powered Merch",
  description:
    "Enactus Cairo — a student-run organization building projects, brands, and communities. Shop our exclusive merch drops.",
  openGraph: {
    title: "Enactus Cairo | Student-Powered Merch",
    description:
      "Shop exclusive Enactus Cairo merchandise. Limited edition drops from a student-powered brand.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <LoadingScreen />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
        <Analytics />
      </body>
    </html>
  );
}
