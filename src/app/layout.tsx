import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AnalyticsWrapper } from "@/components/AnalyticsWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "My Portfolio",
  description: "Built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow px-6 sm:px-12">{children}</main>
            <Footer
              email="aman141kumar.ak@gmail.com"
              githubUrl="https://github.com/Aman141"
              linkedinUrl="https://www.linkedin.com/in/aman-aks-007/"
              twitterUrl="https://x.com/twt2aman"
              instagramUrl="https://www.instagram.com/happy._.habitat/"
            />
          </div>
        </ThemeProvider>
        <AnalyticsWrapper />
      </body>
    </html>
  );
}
