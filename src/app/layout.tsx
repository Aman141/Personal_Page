import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
              email="aman.kumar@gmail.com"
              githubUrl="https://github.com/aman-kumar"
              linkedinUrl="https://www.linkedin.com/in/aman-kumar-b0b0b0b0b0/"
              twitterUrl="https://twitter.com/aman-kumar"
              instagramUrl="https://instagram.com/aman-kumar"
            />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
